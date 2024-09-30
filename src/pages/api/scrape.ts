// This file recieves a url
// Scrapes the url for text and links
// IMPORTANT: Might get deprecated soon for "crawl.ts"

import { NextApiRequest, NextApiResponse } from 'next';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { TimeoutError } from 'puppeteer-core';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  maxDuration: 60, // 60 seconds timeout
};

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

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        (await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar',
        )),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000, // 30 seconds timeout
    });

    // Extract page title
    const pageTitle = await page.title();

    // Extract text content and links
    const { text, links } = await page.evaluate(() => {
      const text = document.body.innerText;
      const links = Array.from(document.querySelectorAll('a')).map((link) => ({
        href: link.href,
        text: link.textContent?.trim() || '',
      }));
      return { text, links };
    });

    res.status(200).json({ pageTitle, text, links });
  } catch (error) {
    console.error('Error scraping webpage:', error);
    if (error instanceof TimeoutError) {
      res.status(504).json({ message: 'Timeout while scraping webpage' });
    } else {
      res.status(500).json({ message: 'Error scraping webpage' });
    }
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
