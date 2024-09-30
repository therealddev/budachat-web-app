// This file recieves a text
// If text is too long, it chunks it
// Then it creates an embedding for each chunk
// Finally, saves to database

import { NextApiRequest, NextApiResponse } from 'next';
import { chunkText } from '@/utils/chunkText';
import { supabase } from '@/lib/supabase';
import { openai } from '@/lib/openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { businessId, content } = req.body;

  try {
    const chunks = chunkText(content);
    for (let chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      await supabase
        .from('business_documents')
        .insert({ business_id: businessId, content: chunk, embedding });
    }

    res
      .status(200)
      .json({ message: 'Document uploaded and chunked successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}
