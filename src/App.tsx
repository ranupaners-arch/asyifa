import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import SiteFooter from './components/SiteFooter';
import ProductCatalog from './components/ProductCatalog';

type PageKind = 'home' | 'pricing' | 'service' | 'products';

interface AppProps {
  page: PageKind;
  markup: string;
}

export default function App({ page, markup }: AppProps) {
  const [footerMount, setFooterMount] = useState<HTMLElement | null>(null);

  if (page === 'products') {
    return <ProductCatalog />;
  }

  useEffect(() => {
    setFooterMount(document.getElementById('site-footer-mount'));
    if (page === 'home') {
      void import('./home-bootstrap.js').then(({ initializeHome }) => initializeHome());
    } else if (page === 'pricing') {
      void import('./pricing.js').then(({ initializePricingPage }) => initializePricingPage());
    } else {
      void import('./service-page.js').then(({ initializeServicePage }) => initializeServicePage());
    }
  }, [page]);

  // Keep the existing semantic markup intact while the UI migrates component by component.
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      {footerMount ? createPortal(<SiteFooter />, footerMount) : null}
    </>
  );
}
