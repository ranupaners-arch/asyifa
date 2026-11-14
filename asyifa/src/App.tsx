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

  useEffect(() => {
    if (page !== 'home') {
      void Promise.all([
        import('./modules/smooth-scroll.js'),
        import('./modules/page-effects.js'),
        import('./modules/hover-effects.js')
      ]).then(([{ initLenis }, { initializePageEffects }]) => {
        initLenis();
        initializePageEffects();
      });
    }
    if (page === 'products') return;
    setFooterMount(document.getElementById('site-footer-mount'));
    if (page === 'home') {
      void import('./home-bootstrap.js').then(({ initializeHome }) => initializeHome());
    } else if (page === 'pricing') {
      void import('./pricing.js').then(({ initializePricingPage }) => initializePricingPage());
    } else {
      void import('./service-page.js').then(({ initializeServicePage }) => initializeServicePage());
    }
  }, [page]);

  if (page === 'products') {
    return <ProductCatalog />;
  }

  // Keep the existing semantic markup intact while the UI migrates component by component.
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      {footerMount ? createPortal(<SiteFooter />, footerMount) : null}
    </>
  );
}
