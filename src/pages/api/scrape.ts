import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Extract text content
    const text = await page.evaluate(() => {
      return document.body.innerText;
    });

    res.status(200).json({ text });
  } catch (error) {
    console.error('Error scraping webpage:', error);
    res.status(500).json({ message: 'Error scraping webpage' });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
