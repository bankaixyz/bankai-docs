import path from 'node:path';
import { docs } from 'collections/server';
import { type InferPageType, loader, multiple, source as createSource } from 'fumadocs-core/source';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import type { TOCItemType } from 'fumadocs-core/toc';
import { createOpenAPI } from 'fumadocs-openapi/server';
import type { ApiPageProps, OperationItem } from 'fumadocs-openapi/ui';
import Slugger from 'github-slugger';

type ApiTag = {
  name: string;
  description?: string;
};

type ApiOperation = {
  description?: string;
  operationId?: string;
  summary?: string;
  tags?: string[];
};

type ApiSchema = {
  paths?: Record<string, Partial<Record<OperationItem['method'], ApiOperation>>>;
  tags?: ApiTag[];
};

export const OPENAPI_DOCUMENT = path.join(process.cwd(), 'openapi.json');
export const openapi = createOpenAPI({
  input: [OPENAPI_DOCUMENT],
});

const apiDocument = await openapi.getSchema(OPENAPI_DOCUMENT);
const apiSchema = apiDocument.dereferenced as ApiSchema;

function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function idToTitle(id: string) {
  let result: string[] = [];

  for (const char of id) {
    if (result.length === 0) {
      result.push(char.toUpperCase());
    } else if (char === '.') {
      result = [];
    } else if (/^[A-Z]$/.test(char) && result.at(-1) !== ' ') {
      result.push(' ', char);
    } else if (char === '-') {
      result.push(' ');
    } else {
      result.push(char);
    }
  }

  return result.join('');
}

function getOperationTitle(path: string, method: OperationItem['method'], operation: ApiOperation) {
  return operation.summary || (operation.operationId ? idToTitle(operation.operationId) : `${method.toUpperCase()} ${path}`);
}

function buildApiToc(operations: OperationItem[]) {
  const slugger = new Slugger();
  const toc: TOCItemType[] = [];

  for (const item of operations) {
    const operation = apiSchema.paths?.[item.path]?.[item.method];
    if (!operation) continue;

    const title = getOperationTitle(item.path, item.method, operation);
    toc.push({
      depth: 2,
      title,
      url: `#${slugger.slug(title)}`,
    });
  }

  return toc;
}

function buildApiStructuredData(operations: OperationItem[]) {
  const slugger = new Slugger();
  const structuredData: StructuredData = {
    headings: [],
    contents: [],
  };

  for (const item of operations) {
    const operation = apiSchema.paths?.[item.path]?.[item.method];
    if (!operation) continue;

    const title = getOperationTitle(item.path, item.method, operation);
    const id = slugger.slug(title);

    structuredData.headings.push({
      content: title,
      id,
    });

    if (operation.description) {
      structuredData.contents.push({
        content: operation.description,
        heading: id,
      });
    }
  }

  return structuredData;
}

function buildApiSource() {
  const grouped = new Map<string, OperationItem[]>();

  for (const [route, pathItem] of Object.entries(apiSchema.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem ?? {})) {
      if (!operation) continue;

      const tag = operation.tags?.[0] ?? 'API';
      const entry = grouped.get(tag) ?? [];
      entry.push({
        path: route,
        method: method as OperationItem['method'],
      });
      grouped.set(tag, entry);
    }
  }

  const orderedTags = [
    ...(apiSchema.tags ?? []).map((tag) => tag.name).filter((tag) => grouped.has(tag)),
    ...[...grouped.keys()].filter((tag) => !(apiSchema.tags ?? []).some((item) => item.name === tag)),
  ];

  const pages = orderedTags.map((tag) => {
    const operations = grouped.get(tag) ?? [];
    const tagMeta = apiSchema.tags?.find((item) => item.name === tag);

    return {
      type: 'page' as const,
      path: `api/${slugifyTag(tag)}.mdx`,
      slugs: ['api', slugifyTag(tag)],
      data: {
        title: tag,
        description: tagMeta?.description ?? `${tag} endpoints.`,
        full: true,
        toc: buildApiToc(operations),
        structuredData: buildApiStructuredData(operations),
        getAPIPageProps(): ApiPageProps {
          return {
            document: OPENAPI_DOCUMENT,
            showTitle: true,
            showDescription: true,
            operations,
          };
        },
      },
    };
  });

  return createSource({
    pages,
    metas: [
      {
        type: 'meta',
        path: 'api/meta.json',
        data: {
          title: 'API',
          defaultOpen: true,
          pages: [...orderedTags.map(slugifyTag)],
        },
      },
    ],
  });
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: multiple({
    docs: docs.toFumadocsSource(),
    generatedApi: buildApiSource(),
  }),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

function normalizeLLMMarkdown(text: string) {
  const lines = text.split('\n');
  const output: string[] = [];
  let inCodeBlock = false;
  let skippingCard = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      output.push(line);
      continue;
    }

    if (inCodeBlock) {
      output.push(line);
      continue;
    }

    if (skippingCard) {
      if (trimmed.includes('/>')) skippingCard = false;
      continue;
    }

    if (trimmed === '<Cards>' || trimmed === '</Cards>') continue;

    if (trimmed.startsWith('<Card')) {
      if (!trimmed.includes('/>')) skippingCard = true;
      continue;
    }

    if (trimmed.startsWith('<Callout') || trimmed === '</Callout>') continue;

    output.push(line.replace(/ \[#[-\w]+\]/g, ''));
  }

  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const llmSectionPageOrder = {
  concepts: [
    'concepts',
    'stateless-light-clients',
    'bankai-blocks',
    'merkle-mountain-ranges',
    'trust-model',
  ],
  sdk: [
    'sdk',
    'quickstart',
    'proof-bundles',
    'verify-a-proof',
    'api-client',
    'supported-surfaces',
  ],
} as const;

type LLMSection = keyof typeof llmSectionPageOrder;

export function getLLMSectionUrl(section: LLMSection) {
  return `/llms-${section}.txt`;
}

async function getLLMDocText(page: InferPageType<typeof source>, includeTitle = true) {
  if ('getAPIPageProps' in page.data) {
    throw new Error('API pages do not support markdown text extraction.');
  }

  const processed = await page.data.getText('processed');
  const body = normalizeLLMMarkdown(processed);

  if (!includeTitle) return body;

  return `# ${page.data.title}

${body}`;
}

export async function getLLMSectionText(section: LLMSection) {
  const order = llmSectionPageOrder[section];
  const positions = new Map<string, number>(order.map((slug, index) => [slug, index]));
  const pages = source
    .getPages()
    .filter((page) => !('getAPIPageProps' in page.data) && page.slugs[0] === section)
    .sort(
      (a, b) =>
      (positions.get(a.slugs[1] ?? section) ?? Number.MAX_SAFE_INTEGER) -
      (positions.get(b.slugs[1] ?? section) ?? Number.MAX_SAFE_INTEGER),
    );

  const content = await Promise.all(pages.map((page, index) => getLLMDocText(page, index !== 0)));

  return [
    `# ${section === 'sdk' ? 'SDK' : 'Concepts'}`,
    '',
    `Combined plain-text Bankai ${section} documentation for agents.`,
    '',
    content.join('\n\n---\n\n'),
  ].join('\n');
}

export async function getLLMText(page: InferPageType<typeof source>) {
  if ('getAPIPageProps' in page.data) {
    const operations = page.data
      .getAPIPageProps()
      .operations?.map((item) => `- ${item.method.toUpperCase()} ${item.path}`)
      .join('\n');

    return `# ${page.data.title}

${page.data.description ?? ''}

${operations ?? ''}`;
  }

  return getLLMDocText(page);
}
