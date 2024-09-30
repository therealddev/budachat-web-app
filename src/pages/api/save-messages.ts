// endpoint for the widget (another domain)
// save messages to the database

import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { chatSessionId, userMessage, aiMessage } = req.body;

    try {
      const { error: userError } = await supabase.from('chat_messages').insert([
        {
          chat_session_id: chatSessionId,
          role: 'user',
          content: userMessage,
        },
      ]);

      if (userError) throw userError;

      const { error: aiError } = await supabase.from('chat_messages').insert([
        {
          chat_session_id: chatSessionId,
          role: 'assistant',
          content: aiMessage,
        },
      ]);

      if (aiError) throw aiError;

      res.status(200).json({ message: 'Messages saved successfully' });
    } catch (error) {
      console.error('Error saving messages:', error);
      res.status(500).json({ error: 'Failed to save messages' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
