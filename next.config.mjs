/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactCompiler: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**",
//       },
//     ],
//   },
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: [
//               "default-src 'self';",
//               // Allow scripts from all flutterwave domains
//               "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.flutterwave.com https://inline.flutterwave.com https://*.flutterwave.com;",
//               // Crucial: Allow frames from both the main checkout and the f4b subdomain
//               "frame-src 'self' https://checkout.flutterwave.com https://checkout-v3-ui-prod.f4b-flutterwave.com https://*.flutterwave.com;",
//               // Added ravepay and wildcard flutterwave for event tracking
//               "connect-src 'self' https://api.flutterwave.com https://flw-events-ge.myflutterwave.com https://api.ravepay.co https://*.flutterwave.com;",
//               "img-src 'self' data: blob: https://res.cloudinary.com https://*.flutterwave.com;",
//               "style-src 'self' 'unsafe-inline';",
//             ].join(' '),
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;