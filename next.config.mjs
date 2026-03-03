/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    // In Next.js 15, this MUST stay inside experimental
    optimizePackageImports: [
      "react-icons",
      "lucide-react",
      "@mui/material",
      "@radix-ui/react-icons",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     reactCompiler: true,
//     // This helps Next.js 15 handle large icon libraries
//     optimizePackageImports: [
//       'react-icons',
//       'lucide-react',
//       '@mui/material',
//       '@radix-ui/react-icons'
//     ],
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         port: "",
//         pathname: "/**",
//         search: "",
//       },
//     ],
//   },
// };

// export default nextConfig;
