// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import core from "puppeteer-core";

// Environment stuff.
const inProduction =
  process.env.ENVIRONMENT && process.env.ENVIRONMENT == "production";
const secretKey = process.env.SECRET;

type RequestBody = {
  url: string;
};

type ResponseBody = {
  content?: string;
  error?: string;
};

let _page: core.Page | null;

async function getPage() {
  if (_page) {
    return _page;
  }
  const browser = await core.launch({
    args: inProduction ? ["--no-sandbox", "--font-render-hinting=none"] : [],
    executablePath: inProduction
      ? "/usr/bin/chromium-browser"
      : process.platform === "win32"
      ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "linux"
      ? "/usr/bin/google-chrome"
      : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  _page = await browser.newPage();
  return _page;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (!req.headers.authorization || req.headers.authorization != secretKey) {
    res.status(401).json({ error: "not authorized" });
    return
  }
  let body = req.body as RequestBody;
  if (!body.url || body.url == "") {
    res.status(400).json({ error: "invalid request url" });
    return;
  }
  const start = new Date().getTime();
  var content;
  try {
    const page = await getPage();
    await page.goto(body.url, { waitUntil: "networkidle0" });
    content = await page.evaluate(() => document.querySelector("*")?.outerHTML);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: "error occured while fetching; see console output" });
    return;
  }
  console.log("Fetched %s in %dms.", body.url, new Date().getTime() - start);
  res.status(200).json({ content });
}
