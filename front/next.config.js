/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['cursos-api-cursos.dpbdp1.easypanel.host'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://cursos-api-cursos.dpbdp1.easypanel.host/:path*',
      },
    ]
  }
}

module.exports = nextConfig 