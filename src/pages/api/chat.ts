import { NextApiRequest, NextApiResponse } from 'next';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { BusinessDocument, MatchDocument } from '@/types/document';

async function cors(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await cors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { businessId, messages } = req.body;

  try {
    // Get embedding for the message
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: await getEmbedding(
        messages[messages.length - 1].content,
      ),
      match_count: 2, // Always get top 2 documents
      p_business_id: parseInt(businessId, 10),
    });

    console.log('Full query results:', documents);
    console.log('Query error:', error);

    if (error) throw error;

    // Extract relevant context from Supabase results
    const context = documents
      .map((doc: BusinessDocument) => doc.content)
      .join('\n\n');

    console.log('context:', context);

    // Prepare messages for OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Be really concise. You are a customer support agent for the business. Use the following information to answer the user's question: ${context}`,
        },
        ...messages,
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content });

    console.log(
      'Matched documents:',
      documents.map((doc: MatchDocument) => ({
        id: doc.id,
        similarity: doc.similarity,
        contentPreview: doc.content.substring(0, 50) + '...',
      })),
    );
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
