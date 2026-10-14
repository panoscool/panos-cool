/**
 * Page content lives here — edit this file, nothing else, to update the page.
 *
 * App card fields:
 *   title       shown on the card
 *   tagline     short line under the title (one sentence works best)
 *   url         where the "Launch" button goes
 *   host        small label shown next to the live dot
 *   tags        up to 3 short keywords
 *   accent      card accent colour, any CSS colour
 *   icon        inline SVG markup (use `var(--card-accent)` / `currentColor`),
 *               or set `logo: 'assets/img/my-logo.png'` to use an image instead
 */
window.PAGE_DATA = {
  links: {
    github: 'https://github.com/panoscool',
    coffee: 'https://buymeacoffee.com/panoscool',
    linkedin: 'https://linkedin.com/in/lkullolli',
  },

  /* Lines typed out in the hero console. `out` lines are printed as responses. */
  console: [
    { cmd: 'whoami' },
    { out: 'Lavdimir K.  ·  software engineer  ·  @panoscool' },
    { cmd: 'cat stack.json --top' },
    { out: 'TypeScript · React · Next.js · Node · MongoDB' },
    { cmd: 'apps --list' },
    { out: 'hmlx · Truth or Dare · Blank Quest' },
    { cmd: 'packages --list' },
    { out: '@panoscool/fetch-client · @panoscool/query-string' },
  ],

  apps: [
    {
      title: 'hmlx',
      tagline: 'Personal expenses, household costs, and split bills.',
      description:
        'Record expenses in their original currency, split costs, and track repayments. Paid plans add budgets and forecasts.',
      url: 'https://hmlx.app',
      host: 'hmlx.app',
      tags: ['Expenses', 'Split bills', 'Multi-currency'],
      accent: '#22c1e0',
      icon: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="9" width="36" height="30" rx="5" stroke="currentColor" stroke-width="2.2"/>
        <path d="M6 17h36" stroke="currentColor" stroke-width="2.2"/>
        <path d="M24 17v22" stroke="var(--card-accent)" stroke-width="2.2" stroke-dasharray="3 3"/>
        <path d="M12 24h7M12 31h7M29 24h7M29 31h7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="36" cy="13" r="3.2" fill="var(--card-accent)"/>
      </svg>`,
    },
    {
      title: 'Truth or Dare',
      tagline: 'Play on one device or in a private room.',
      description:
        'Choose categories and play on a shared device without an account. Sign in to host a private room for friends on their own phones and add custom truths and dares.',
      url: 'https://tord.panoscool.com',
      host: 'tord.panoscool.com',
      tags: ['Private rooms', 'Custom prompts'],
      accent: '#ff6b9d',
      icon: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="5" y="14" width="24" height="24" rx="6" stroke="currentColor" stroke-width="2.2"/>
        <circle cx="13" cy="22" r="2.1" fill="currentColor"/>
        <circle cx="21" cy="30" r="2.1" fill="currentColor"/>
        <circle cx="13" cy="30" r="2.1" fill="currentColor"/>
        <path d="M27 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3l-4 4v-4h-7a2 2 0 0 1-2-2v-3" stroke="var(--card-accent)" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M33.6 11.4a1.9 1.9 0 0 1 3.2 1.4c0 1.3-1.6 1.5-1.6 2.8" stroke="var(--card-accent)" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    },
    {
      title: 'Blank Quest',
      tagline: 'A hangman word game.',
      description:
        'Guess letters to complete a word before you run out of attempts. Supports keyboard input and light and dark themes.',
      url: 'https://blankquest.netlify.app',
      host: 'blankquest.netlify.app',
      tags: ['Word game', 'Categories', 'Difficulty'],
      accent: '#8b7cff',
      icon: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="4" y="13" width="12" height="15" rx="3" stroke="currentColor" stroke-width="2.2"/>
        <rect x="18" y="13" width="12" height="15" rx="3" stroke="var(--card-accent)" stroke-width="2.2"/>
        <rect x="32" y="13" width="12" height="15" rx="3" stroke="currentColor" stroke-width="2.2"/>
        <path d="M21 24l3-7 3 7m-5-2.2h4" stroke="var(--card-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 35h8M34 35h8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>`,
    },
  ],

  /* Small strip under the app grid. Delete this array to hide the section. */
  packages: [
    {
      name: '@panoscool/fetch-client',
      description: 'A typed fetch client with interceptors, JSON handling, and structured errors.',
      url: 'https://www.npmjs.com/package/@panoscool/fetch-client',
    },
    {
      name: '@panoscool/query-string',
      description: 'URL query string parsing and serialisation with configurable array formats and value types.',
      url: 'https://www.npmjs.com/package/@panoscool/query-string',
    },
  ],
};
