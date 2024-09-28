import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      console.log('Received files:', files);
      console.log('Received fields:', fields);

      const pdfFile = files.pdf;
      if (!pdfFile) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      // Handle both single file and array cases
      const file = Array.isArray(pdfFile) ? pdfFile[0] : pdfFile;

      try {
        const dataBuffer = fs.readFileSync(file.filepath);
        const data = await pdf(dataBuffer);
        res.status(200).json({ text: data.text });
      } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Error processing PDF' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
