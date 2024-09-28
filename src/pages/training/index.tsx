import Link from 'next/link';
export default function Training() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Entrenamiento de IA</h1>
      <nav className="flex flex-col space-y-4">
        <Link
          href="/training/pdf"
          className="text-blue-500 hover:text-blue-700"
        >
          Entrenar con PDF
        </Link>
        <Link
          href="/training/link"
          className="text-blue-500 hover:text-blue-700"
        >
          Entrenar con Link
        </Link>
        <Link
          href="/training/text"
          className="text-blue-500 hover:text-blue-700"
        >
          Entrenar con Texto
        </Link>
      </nav>
    </div>
  );
}
