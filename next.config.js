/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'cleyverse-digital-files-staging-73qrkdf1.s3.us-east-1.amazonaws.com',
      'api.dicebear.com'
    ],
  },
}

module.exports = nextConfig

