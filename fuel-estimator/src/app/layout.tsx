import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WEBSITE_NAME } from "@/data/vehicles";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: `${WEBSITE_NAME} | Estimasi Bensin Kendaraan`,
    description:
        "Web responsif untuk estimasi jarak tempuh bensin kendaraan motor dan mobil, lengkap dengan GEBDT berbasis lokasi dan tujuan perjalanan."
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="id"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
