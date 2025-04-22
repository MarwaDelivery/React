import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'

  // Add your dynamic routes here
  const dynamicPaths = [
    {
      loc: `${baseUrl}/`, // Homepage
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1,
    },
    {
      loc: `${baseUrl}/store/popular`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.8,
    },
    // Add more static routes
    {
      loc: `${baseUrl}/about`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.5,
    },
    // Add store routes
    {
      loc: `${baseUrl}/store`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.8,
    },
  ]

  // If you have dynamic store pages, you can fetch them from your API
  // and add them to the sitemap
  // const stores = await fetch('your-api-endpoint/stores')
  // const storeData = await stores.json()
  // const storePaths = storeData.map(store => ({
  //   loc: `${baseUrl}/store/${store.slug}`,
  //   lastmod: new Date().toISOString(),
  //   changefreq: 'daily',
  //   priority: 0.7,
  // }))

  // dynamicPaths.push(...storePaths)

  return getServerSideSitemap(ctx, dynamicPaths)
}

// Default export to prevent next.js errors
export default function Sitemap() {} 