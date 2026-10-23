import { useCartStore } from '../stores/cartStore';

export function useCartAnimation() {
  const cartStore = useCartStore();

  function triggerFlyToCart(eventOrElement, laptop) {
    if (!laptop) return;

    // 1. Instantly update cart store and show notification
    cartStore.addItem(laptop, 1);
    cartStore.showToast(laptop);

    // 2. Determine start coordinates (button or click position)
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (eventOrElement instanceof HTMLElement) {
      const rect = eventOrElement.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    } else if (eventOrElement && eventOrElement.currentTarget) {
      const rect = eventOrElement.currentTarget.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    } else if (eventOrElement && eventOrElement.target) {
      const rect = eventOrElement.target.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    } else if (eventOrElement && typeof eventOrElement.clientX === 'number') {
      startX = eventOrElement.clientX;
      startY = eventOrElement.clientY;
    }

    // 3. Locate target cart button in navbar
    const cartBtn = document.getElementById('navbar-cart-btn') || document.querySelector('[title="Keranjang Belanja"]');
    let endX = window.innerWidth - 65;
    let endY = 28;

    if (cartBtn) {
      const cartRect = cartBtn.getBoundingClientRect();
      endX = cartRect.left + cartRect.width / 2;
      endY = cartRect.top + cartRect.height / 2;
    }

    // 4. Create floating animated element (orb / product badge)
    const flyer = document.createElement('div');
    flyer.style.position = 'fixed';
    flyer.style.zIndex = '99999';
    flyer.style.pointerEvents = 'none';
    flyer.style.width = '52px';
    flyer.style.height = '52px';
    flyer.style.borderRadius = '9999px';
    flyer.style.backgroundColor = '#ffffff';
    flyer.style.border = '2.5px solid #2563eb';
    flyer.style.boxShadow = '0 12px 28px -4px rgba(37, 99, 235, 0.45), 0 4px 8px -2px rgba(0, 0, 0, 0.1)';
    flyer.style.display = 'flex';
    flyer.style.alignItems = 'center';
    flyer.style.justifyContent = 'center';
    flyer.style.overflow = 'hidden';
    flyer.style.left = '0px';
    flyer.style.top = '0px';
    flyer.style.willChange = 'transform, opacity';

    if (laptop.image_url) {
      const img = document.createElement('img');
      img.src = laptop.image_url;
      img.alt = laptop.model || 'Node Infrastruktur';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.padding = '4px';
      flyer.appendChild(img);
    } else {
      const icon = document.createElement('span');
      icon.className = 'material-symbols-outlined';
      icon.style.fontSize = '26px';
      icon.style.color = '#2563eb';
      icon.textContent = 'shopping_bag';
      flyer.appendChild(icon);
    }

    document.body.appendChild(flyer);

    // 5. Quadratic Bézier Curve Animation (Parabolic upward arc)
    const duration = 720; // ms
    const startTime = performance.now();

    // Arc apex rises upward creating a dynamic toss into the cart
    const controlX = (startX + endX) / 2;
    const controlY = Math.min(startY, endY) - 120;

    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      // Quadratic Bézier curve: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const currentX = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * endX;
      const currentY = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * endY;

      // Scale: start at 1.0 -> expands slightly to 1.15 -> gracefully shrinks to 0.2
      const scale = t < 0.25 ? 1 + t * 0.6 : Math.max(0.18, 1.15 - (t - 0.25) * 1.3);
      const opacity = t > 0.82 ? Math.max(0, (1 - t) / 0.18) : 1;
      const rotate = t * 360;

      flyer.style.transform = `translate(${currentX - 26}px, ${currentY - 26}px) scale(${scale}) rotate(${rotate}deg)`;
      flyer.style.opacity = opacity;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        flyer.remove();
        // Trigger landing pulse on navbar cart button
        cartStore.triggerBounce();
      }
    }

    requestAnimationFrame(animate);
  }

  return {
    triggerFlyToCart
  };
}
