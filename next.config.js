/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "s.gravatar.com"], // Add the domain here
  },
};

module.exports = nextConfig;
