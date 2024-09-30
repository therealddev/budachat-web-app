import { NextApiRequest, NextApiResponse } from 'next';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

interface PageData {
  url: string;
  pageTitle: string;
  text: string;
  links: { href: string; text: string }[];
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  maxDuration: 60, // 60 seconds timeout
};

async function scrapePage(
  page: puppeteer.Page,
  url: string,
): Promise<PageData> {
  console.log(`Scraping page: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  const pageTitle = await page.title();
  const { text, links } = await page.evaluate(() => {
    const text = document.body.innerText;
    const links = Array.from(document.querySelectorAll('a')).map((link) => ({
      href: link.href,
      text: link.textContent?.trim() || '',
    }));
    return { text, links };
  });

  console.log(
    `Scraped ${url}: Title: "${pageTitle}", Text length: ${text.length}, Links: ${links.length}`,
  );
  return { url, pageTitle, text, links };
}

function isSameDomain(url1: string, url2: string): boolean {
  try {
    const getDomain = (url: string) => {
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.');
      if (parts.length > 2) {
        // Remove 'www' if present
        if (parts[0] === 'www') {
          parts.shift();
        }
        // Ensure we're not including specific subdomains
        if (parts[0] !== 'admin' && parts[0] !== 'api' && parts[0] !== 'mail') {
          return parts.join('.');
        }
      }
      return hostname.replace(/^www\./, '');
    };

    const domain1 = getDomain(url1);
    const domain2 = getDomain(url2);
    return domain1 === domain2;
  } catch {
    return false;
  }
}

function normalizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.hash = ''; // Remove hash/fragment
    parsedUrl.search = ''; // Remove query parameters
    let path = parsedUrl.pathname;
    if (path.endsWith('/')) {
      path = path.slice(0, -1); // Remove trailing slash
    }
    parsedUrl.pathname = path;
    // Remove 'www.' from the hostname
    parsedUrl.hostname = parsedUrl.hostname.replace(/^www\./, '');
    return parsedUrl.toString().toLowerCase(); // Convert to lowercase for case-insensitive comparison
  } catch {
    return url.toLowerCase(); // Return original URL in lowercase if parsing fails
  }
}

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

  console.log(`Starting crawl for URL: ${url}`);

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  let browser = null;

  try {
    console.log('Launching browser...');
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
    console.log('Browser launched successfully');

    const results: PageData[] = [];
    const visited = new Set<string>();
    const queue: string[] = [url]; // Use the original URL here
    const maxPages = 3; // Limit to 3 pages

    while (queue.length > 0 && results.length < maxPages) {
      const currentUrl = queue.shift();
      if (currentUrl) {
        const normalizedUrl = normalizeUrl(currentUrl);
        if (!visited.has(normalizedUrl)) {
          visited.add(normalizedUrl);
          try {
            const page = await browser.newPage();
            await page.setUserAgent(
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            );
            const pageData = await scrapePage(page, currentUrl); // Use the original URL for scraping
            await page.close();

            results.push(pageData);
            console.log(`Added result for: ${currentUrl}`);

            // Add new links to the queue
            for (const link of pageData.links) {
              const normalizedLink = normalizeUrl(link.href);
              if (
                !visited.has(normalizedLink) &&
                isSameDomain(url, link.href) && // Use original URLs for domain comparison
                !queue.includes(link.href) && // Check against original URLs in queue
                results.length + queue.length < maxPages
              ) {
                queue.push(link.href); // Add original URL to queue
                console.log(`Added to queue: ${link.href}`);
              }
            }
          } catch (error) {
            console.error(`Error processing ${currentUrl}:`, error);
          }
        }
      }
    }

    console.log(`Total pages crawled: ${results.length}`);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error in main crawling process:', error);
    res.status(500).json({ message: 'Error crawling webpages' });
  } finally {
    if (browser !== null) {
      console.log('Closing browser...');
      await browser.close();
      console.log('Browser closed');
    }
  }
}
