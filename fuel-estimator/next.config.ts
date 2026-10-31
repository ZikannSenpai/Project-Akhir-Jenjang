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
            }
        ]
    }
};

export default nextConfig;
