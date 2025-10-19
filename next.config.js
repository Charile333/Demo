/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 忽略预渲染错误，允许动态页面在运行时渲染
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // 允许部分预渲染失败
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig