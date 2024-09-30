"use client";

import TopNavBar from "@/components/TopNavBar";
import Footer from "@/components/global/Footer";
import RouteLimitation from "@/components/global/RouteLimitation";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname() || "";
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Define the path pattern where the header and footer should be hidden
  const shouldHideHeaderFooter = /^\/chat\/[^/]+$/.test(pathname);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1023);
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {!(shouldHideHeaderFooter && isSmallScreen) && <TopNavBar />}
      <RouteLimitation>
        {children}
      </RouteLimitation>
      {!(shouldHideHeaderFooter && isSmallScreen) && <Footer />}
    </>
  );
}
