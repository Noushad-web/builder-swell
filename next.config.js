const bundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: !!process.env.BUNDLE_ANALYZE,
})

module.exports = bundleAnalyzer({
  target: 'serverless',
  images: {
    domains: ['cdn.builder.io', 'cdn.schema.io', 'via.placeholder.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              'frame-ancestors https://*.builder.io https://builder.io http://localhost:1234',
          },
        ],
      },
    ]
  },
  env: {
    // expose env to the browser
    BUILDER_PUBLIC_KEY: process.env.BUILDER_PUBLIC_KEY,
    SWELL_STORE_ID: process.env.SWELL_STORE_ID,
    SWELL_PUBLIC_KEY: process.env.SWELL_PUBLIC_KEY,
    IS_DEMO: process.env.IS_DEMO,
  }
})
