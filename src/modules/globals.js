// Make functions global for inline onclick handlers
import { openModal, closeModal } from './modal.js';
import { openMenu, closeMenu } from './menu.js';
import { nextTrustSlide, prevTrustSlide, setTrustSlide, setCollectionSlide } from './carousels.js';

window.openModal = openModal;
window.closeModal = closeModal;
window.openMenu = openMenu;
window.closeMenu = closeMenu;
window.nextTrustSlide = nextTrustSlide;
window.prevTrustSlide = prevTrustSlide;
window.setTrustSlide = setTrustSlide;
window.setCollectionSlide = setCollectionSlide;