/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['cursos-api-cursos.dpbdp1.easypanel.host'],
  }
}

module.exports = nextConfig 