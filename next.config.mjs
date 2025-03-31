import withPWA from 'next-pwa';
const nextConfig = {
  i18n: {
    defaultLocale: 'fa',
    locales: ['en', 'fa'],
    localeDetection: false,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withPWA({
  dest: 'public', // destination directory for the PWA files
  disable: false, // disable PWA in the development environment
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
})(nextConfig);

// const withPWA = withPWAInit({
//   dest: 'public',
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   swcMinify: true,
//   disable: false,
//   workboxOptions: {
//     disableDevLogs: true,
//   },
// })

// module.exports = withPWA(nextConfig)
// export default withPWA(nextConfig)
