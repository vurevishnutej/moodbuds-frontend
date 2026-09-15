import type { ReactNode } from 'react';
import { HomeNavbar } from '../../../components/layout/HomeNavbar';
import { MobileNavbar } from '../../../components/layout/MobileNavbar';
import { Footer } from '../../../components/layout/Footer';
import { MobileFooter } from '../../../components/layout/MobileFooter';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import { useIsMobile } from '../../../hooks/useIsMobile';

export function PublicContentLayout({ children }: { children: ReactNode }) {
  useBodyViewClass('home');
  const isMobile = useIsMobile();
  if (isMobile) return <div id="view-home" className="mb-page-fade"><MobileNavbar />{children}<MobileFooter /></div>;
  return <div id="view-home" className="mb-page-fade"><div id="page"><HomeNavbar />{children}</div><Footer /></div>;
}
