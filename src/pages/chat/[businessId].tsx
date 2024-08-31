import { useState } from 'react';
import { useRouter } from 'next/router';
import ChatInterface from '@/components/ChatInterface';

export default function BusinessChat() {
  const router = useRouter();
  const { businessId } = router.query;
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);

  const handleSendMessage = async (message: string) => {
    const newMessages = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, messages: newMessages }),
    });

    const data = await response.json();
    setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
  };

  return (
    <div>
      <h1>Chat with Business {businessId}</h1>
      <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}
