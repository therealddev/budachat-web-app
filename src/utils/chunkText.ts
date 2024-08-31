export function chunkText(text: string, maxChars = 1000): string[] {
  const chunks: string[] = [];
  let chunk = '';

  const words = text.split(/\s+/);
  for (const word of words) {
    if (chunk.length + word.length + 1 > maxChars && chunk.length > 0) {
      chunks.push(chunk.trim());
      chunk = '';
    }
    chunk += (chunk.length > 0 ? ' ' : '') + word;
  }
  if (chunk.length > 0) {
    chunks.push(chunk.trim());
  }

  return chunks;
}
