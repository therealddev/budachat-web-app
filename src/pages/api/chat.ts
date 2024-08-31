import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { BusinessDocument } from '@/types/document';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, chatHistory } = req.body;

  try {
    // Get embedding for the message
    const queryEmbedding = await getEmbedding(message);

    // Query Supabase for relevant context
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.78, // Choose an appropriate threshold
      match_count: 5, // Choose how many matches you want
    });

    if (error) throw error;

    // Extract relevant context from Supabase results
    const context = documents
      .map((doc: BusinessDocument) => doc.content)
      .join('\n');

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...chatHistory,
      { role: 'user', content: `Context: ${context}\n\nUser: ${message}` },
    ];

    // Get completion from OpenAI using GPT-4o mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using GPT-4o mini as requested
      messages,
      max_tokens: 16384, // Max output tokens for GPT-4o mini
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // Using the latest small embedding model
    input: text,
  });
  return response.data[0].embedding;
}
