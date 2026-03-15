import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Link from 'next/link';

export const gitConfig = {
  user: 'bankaixyz',
  repo: 'bankai-docs',
  branch: 'main',
};

export function baseOptions(): BaseLayoutProps {
  return {
    themeSwitch: {
      enabled: true,
      mode: 'light-dark-system',
    },
    nav: {
      title: (
        <Link href="/" className="bankai-brand">
          <img src="/icon.png" alt="" />
          <span>Bankai Docs</span>
        </Link>
      ),
      transparentMode: 'top',
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        type: 'main',
        text: 'Concepts',
        url: '/docs/concepts',
      },
      {
        type: 'main',
        text: 'SDK',
        url: '/docs/sdk',
      },
      {
        type: 'main',
        text: 'API',
        url: '/docs/api',
      },
      {
        type: 'main',
        text: 'GitHub',
        url: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
        external: true,
      },
    ],
  };
}
