// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   webpack: (config) => {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ['@svgr/webpack', 'url-loader'],
//     });

//     return config;
//   },
//   reactStrictMode: true,
// };

// export default nextConfig;

const isProd = process.env.NODE_ENV === 'production'

const remotePatterns = [
  {
    protocol: 'https',
    hostname: `**.${process.env.ROOT_DOMAIN}`,
    port: ''
  }
]

if (!isProd) {
  remotePatterns.push({
    hostname: 'localhost',
    port: '',
    protocol: 'http'
  })
}

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },
  images: {
    remotePatterns
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  assetPrefix: isProd ? process.env.PUBLIC_URL : undefined
}
