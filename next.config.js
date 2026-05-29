/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    // jspdf statically imports these optional deps for its HTML/SVG features,
    // which we don't use (we only call addImage with JPEG data URLs). Stub them
    // so the build never needs them — fixes Vercel's `npm install --omit=optional`.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvg: false,
      html2canvas: false,
      dompurify: false,
    };
    return config;
  },
};
module.exports = nextConfig;
