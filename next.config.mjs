/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['f.nooncdn.com', 'media-ix.onshobbak.net', 'i.ibb.co', 'mrsanduq.s3.me-south-1.amazonaws.com', 'ik.imagekit.io', 'res.cloudinary.com', 'asset.cloudinary.com'],
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
};

export default nextConfig;
