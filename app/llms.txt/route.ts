import { getLLMSectionUrl } from '@/lib/source';

export const revalidate = false;

export function GET() {
  const body = [
    '# Bankai Docs',
    '',
    '> Agent-friendly Bankai documentation.',
    '',
    '## Primary Docs',
    '',
    `- [SDK bundle](${getLLMSectionUrl('sdk')}): Combined plain-text SDK documentation for agents.`,
    `- [Concepts bundle](${getLLMSectionUrl('concepts')}): Combined plain-text concepts documentation for agents.`,
    '',
    'These routes return plain text only and combine each section into a single document.',
    '',
    '## Optional',
    '',
    '- [Docs site](/docs): Human-oriented documentation UI.',
    '- [API reference](/docs/api): Interactive HTTP API reference.',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
