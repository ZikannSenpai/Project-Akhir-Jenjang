import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "png.pngtree.com"
            },
            {
                protocol: "https",
                hostname: "www.pngitem.com"
            },
            {
                protocol: "https",
                hostname: "image.pollinations.ai"
            }
        ]
    }
};

export default nextConfig;
