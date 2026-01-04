/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chat-app-media-udayan.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
