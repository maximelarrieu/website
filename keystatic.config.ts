import { config, fields, collection } from '@keystatic/core';

const isForcedLocal = (
  typeof window !== 'undefined' && window.location.search.includes('storage=local')
);

const isForcedGitHub = (
  typeof window !== 'undefined' && window.location.search.includes('storage=github')
);

const isProductionHost = (
  typeof window !== 'undefined' && (
    window.location.hostname === 'maximelarrieu.io' ||
    window.location.hostname.endsWith('.maximelarrieu.io')
  )
);

const isDevOrPreview = (
  typeof window !== 'undefined' && (
    window.location.hostname.includes('ais-dev-') ||
    window.location.hostname.includes('ais-pre-') ||
    window.location.hostname.includes('localhost') ||
    window.location.hostname === '127.0.0.1'
  )
);

const isGitHubMode = !isForcedLocal && (
  isForcedGitHub ||
  (!isDevOrPreview && isProductionHost) ||
  (typeof process !== 'undefined' && (
    process.env.KEYSTATIC_STORAGE_KIND === 'github' ||
    !!process.env.KEYSTATIC_GITHUB_CLIENT_ID
  ))
);

export default config({
  storage: isGitHubMode
    ? {
        kind: 'github',
        repo: 'maximelarrieu/website',
      }
    : {
        kind: 'local',
      },
  collections: {
    posts: collection({
      label: 'Carnet d’étude (Articles)',
      slugField: 'title',
      path: 'content/posts/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Titre (FR)' } }),
        titleEn: fields.text({ label: 'Titre en Anglais (EN) - optionnel' }),
        date: fields.date({ label: 'Date de publication', validation: { isRequired: true } }),
        category: fields.text({ 
          label: 'Thématique (FR, ex: Homelab IA)', 
          description: 'Les articles partageant la même thématique sont automatiquement regroupés et ordonnés dans le parcours de lecture.' 
        }),
        categoryEn: fields.text({ 
          label: 'Thématique en Anglais (EN, ex: AI Homelab) - optionnel' 
        }),
        orderInSeries: fields.integer({
          label: 'Numéro de volet dans la thématique (optionnel, ex: 1, 2, 3...)',
          description: 'Pour numéroter et séquencer chronologiquement les volets de votre thématique.'
        }),
        readTime: fields.text({ label: 'Temps de lecture (ex: 4 min)' }),
        readTimeEn: fields.text({ label: 'Temps de lecture en Anglais (EN, ex: 4 min read) - optionnel' }),
        coverImage: fields.image({
          label: 'Image de couverture (Télécharger depuis votre ordinateur)',
          directory: 'public/images/posts',
          publicPath: '/images/posts',
        }),
        imageUrl: fields.text({ label: 'OU URL d\'image externe (optionnel, ex: Unsplash)' }),
        excerpt: fields.text({ label: 'Extrait en Français (FR)', multiline: true }),
        excerptEn: fields.text({ label: 'Extrait en Anglais (EN) - optionnel', multiline: true }),
        content: fields.document({
          label: 'Contenu en Français (FR)',
          formatting: true,
          dividers: true,
          links: true,
          tables: true,
          images: {
            directory: 'public/images/posts',
            publicPath: '/images/posts',
          },
        }),
        contentEn: fields.document({
          label: 'Contenu en Anglais (EN) - optionnel',
          formatting: true,
          dividers: true,
          links: true,
          tables: true,
          images: {
            directory: 'public/images/posts',
            publicPath: '/images/posts',
          },
        }),
      },
    }),
  },
});
