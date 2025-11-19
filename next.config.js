/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    localeDetection: true,
  },
}

module.exports = nextConfig
