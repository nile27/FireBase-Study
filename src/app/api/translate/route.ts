import { NextRequest, NextResponse } from "next/server";

import { JSDOM } from "jsdom";
import { Translator, TargetLanguageCode } from "deepl-node";

const deepLApiKey = process.env.DEEPL_API_KEY!;
const translator = new Translator(deepLApiKey);

export const config = {
  runtime: "edge",
};

const extractTextNodes = (node: Node, texts: string[] = []): string[] => {
  if (node.nodeType === node.TEXT_NODE) {
    texts.push(node.nodeValue || "");
  } else if (node.nodeType === node.ELEMENT_NODE) {
    node.childNodes.forEach((child) => extractTextNodes(child, texts));
  }
  return texts;
};

const replaceTextNodes = (
  node: Node,
  translations: string[],
  index: { value: number }
) => {
  if (node.nodeType === node.TEXT_NODE) {
    node.nodeValue = translations[index.value++] || node.nodeValue;
  } else if (node.nodeType === node.ELEMENT_NODE) {
    node.childNodes.forEach((child) =>
      replaceTextNodes(child, translations, index)
    );
  }
};

export async function POST(req: NextRequest) {
  "use server";
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Only POST requests are allowed" },
      { status: 405 }
    );
  }

  try {
    const { html, targetLang } = await req.json();

    if (!html || !targetLang) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const dom = new JSDOM(html);
    const textNodes = extractTextNodes(dom.window.document.body);

    const translations = await Promise.all(
      textNodes.map(async (text) => {
        const result = await translator.translateText(
          text,
          null,
          targetLang as TargetLanguageCode
        );
        return result.text;
      })
    );

    replaceTextNodes(dom.window.document.body, translations, { value: 0 });

    return NextResponse.json({ translatedHTML: dom.serialize() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export default POST;
