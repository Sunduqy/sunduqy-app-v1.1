import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import './fonts.css';
import 'remixicon/fonts/remixicon.css';
import ClientLayout from "./ClientLayout"; // Import the client-side layout
import { AuthProvider } from "@/components/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "100"
});

export const metadata: Metadata = {
  title: "صندوقي | بيع و شراء المستعمل",
  description: "بيع و شراء المستعمل",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ar" dir="rtl">
        <body className={poppins.className}>
          {children}
        </body>
      </html>
  );
}
