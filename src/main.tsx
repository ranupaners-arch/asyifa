import { createRoot } from 'react-dom/client';
import App from './App';

const mount = document.getElementById('root');

if (!mount) {
  throw new Error('React mount #root is missing.');
}

const page = mount.dataset.page;
if (page !== 'home' && page !== 'pricing' && page !== 'service' && page !== 'products' && page !== 'admin') {
  throw new Error(`Unsupported page type: ${page ?? '(missing)'}`);
}

const markup = mount.innerHTML;
createRoot(mount).render(<App page={page} markup={markup} />);
