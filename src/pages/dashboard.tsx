import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <nav className="flex flex-col space-y-4">
        <Link
          href="/chat-history"
          className="text-blue-500 hover:text-blue-700"
        >
          1. Chats recientes
        </Link>
        <Link href="/training" className="text-blue-500 hover:text-blue-700">
          2. Entrenar IA
        </Link>
        <Link
          href="/personalization"
          className="text-blue-500 hover:text-blue-700"
        >
          3. Personalización
        </Link>
      </nav>
    </div>
  );
}
