import { NextApiRequest, NextApiResponse } from 'next';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  maxDuration: 60, // Increase to 60 seconds
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
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Extract page title
    const pageTitle = await page.title();

    // Extract text content
    const text = await page.evaluate(() => {
      return document.body.innerText;
    });

    // Take a screenshot
    const screenshot = await page.screenshot();
    // Note: You would typically upload this screenshot to a service like Cloudinary
    // and return the URL instead of the raw data

    res
      .status(200)
      .json({ pageTitle, text, screenshot: screenshot.toString('base64') });
  } catch (error) {
    console.error('Error scraping webpage:', error);
    res.status(500).json({ message: 'Error scraping webpage' });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
