'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/global/Header';
import Drawer from '@/components/global/Drawer';
import HeaderNavigationMenu from './global/HeaderNavigationMenu';

const TopNavBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isDrawerOpen]);

  return (
    <header className="flex flex-col w-full z-30">
      <Header onOpenDrawer={openDrawer} />
      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}/>
      <HeaderNavigationMenu />
    </header>
  );
};

export default TopNavBar;
