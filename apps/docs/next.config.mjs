import nextra from 'nextra'
const withNextra = nextra({ theme: 'nextra-theme-docs', themeConfig: './theme.config.js' })


const repo = 'i-hooks'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || `/${repo}`

export default withNextra({
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  assetPrefix: basePath || undefined,
  basePath: basePath || undefined,
})

