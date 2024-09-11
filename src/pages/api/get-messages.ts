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
  if (req.method === 'GET') {
    const { businessId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    try {
      // First, get the chat sessions for the business
      const { data: sessions, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('id, created_at')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (sessionError) throw sessionError;

      // Then, get the chat messages for each session
      const sessionsWithMessages = await Promise.all(
        sessions.map(async (session) => {
          const { data: messages, error: messageError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_session_id', session.id)
            .order('created_at', { ascending: true });

          if (messageError) throw messageError;

          return { ...session, messages };
        }),
      );

      // Get total count of sessions for pagination
      const { count, error: countError } = await supabase
        .from('chat_sessions')
        .select('id', { count: 'exact' })
        .eq('business_id', businessId);

      if (countError) throw countError;

      res.status(200).json({
        sessions: sessionsWithMessages,
        totalCount: count ?? 0,
        currentPage: page,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      });
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
