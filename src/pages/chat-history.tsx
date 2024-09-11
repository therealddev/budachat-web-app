import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useBusiness } from '../contexts/BusinessContext';
import { useUser } from '@supabase/auth-helpers-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface ChatSession {
  id: string;
  created_at: string;
  messages: Message[];
}

interface ChatHistoryResponse {
  sessions: ChatSession[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { page = '1' } = router.query;
  const { business, loading: businessLoading } = useBusiness();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      router.push('/login'); // Redirect to login if not authenticated
    } else if (business && !businessLoading) {
      fetchChatHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, business, businessLoading, page]);

  async function fetchChatHistory() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/get-messages?businessId=${business?.id}&page=${page}`,
      );
      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data: ChatHistoryResponse = await response.json();
      setChatHistory(data);
    } catch (err) {
      setError('Error fetching chat history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null; // Don't render anything if not authenticated
  if (businessLoading || loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chatHistory) return <div>No chat history found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat History</h1>
      {chatHistory.sessions.map((session) => (
        <div key={session.id} className="mb-8 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">
            Session: {new Date(session.created_at).toLocaleString()}
          </h2>
          {session.messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded ${
                message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
              }`}
            >
              <strong>{message.role === 'user' ? 'User' : 'Assistant'}:</strong>{' '}
              {message.content}
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4">
        {Array.from({ length: chatHistory.totalPages }, (_, i) => i + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              onClick={() =>
                router.push(
                  `/chat-history?businessId=${business?.id}&page=${pageNum}`,
                )
              }
              className={`mr-2 px-3 py-1 border rounded ${
                pageNum === chatHistory.currentPage
                  ? 'bg-blue-500 text-white'
                  : ''
              }`}
            >
              {pageNum}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
