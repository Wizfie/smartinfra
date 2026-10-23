import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const savedCart = localStorage.getItem('smartinfra_cart') || localStorage.getItem('smartlap_cart');
  let initialItems = [];
  try {
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      if (Array.isArray(parsed)) {
        // Sanitize existing items: eliminate any item without valid numerical ID
        initialItems = parsed
          .filter(i => {
            const rawId = i.id ?? i.laptop_id;
            return rawId && !isNaN(parseInt(rawId, 10));
          })
          .map(i => ({
            ...i,
            id: parseInt(i.id ?? i.laptop_id, 10),
            laptop_id: parseInt(i.id ?? i.laptop_id, 10)
          }));
      }
    }
  } catch (e) {
    console.error('Failed to parse saved cart:', e);
    initialItems = [];
  }

  const items = ref(initialItems);

  function saveToStorage() {
    localStorage.setItem('smartinfra_cart', JSON.stringify(items.value));
    localStorage.setItem('smartlap_cart', JSON.stringify(items.value));
  }

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  });

  function addItem(laptop, quantity = 1) {
    if (!laptop) return;
    const targetId = parseInt(laptop.id ?? laptop.laptop_id, 10);
    if (!targetId || isNaN(targetId)) {
      console.warn('Cannot add item with invalid id to cart:', laptop);
      return;
    }

    const existing = items.value.find(i => (i.id === targetId || i.laptop_id === targetId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({
        id: targetId,
        laptop_id: targetId,
        brand: laptop.brand,
        model: laptop.model,
        price: parseFloat(laptop.price || 0),
        image_url: laptop.image_url,
        screen_desc: laptop.screen_desc,
        stock: laptop.stock || 10,
        quantity: Math.max(1, quantity)
      });
    }
    saveToStorage();
  }

  function updateQuantity(laptopId, qty) {
    const targetId = parseInt(laptopId, 10);
    const item = items.value.find(i => i.id === targetId || i.laptop_id === targetId);
    if (item) {
      if (qty <= 0) {
        removeItem(targetId);
      } else {
        item.quantity = Math.min(qty, item.stock || 99);
        saveToStorage();
      }
    }
  }

  function removeItem(laptopId) {
    const targetId = parseInt(laptopId, 10);
    items.value = items.value.filter(i => i.id !== targetId && i.laptop_id !== targetId);
    saveToStorage();
  }

  function clearCart() {
    items.value = [];
    localStorage.removeItem('smartinfra_cart');
    localStorage.removeItem('smartlap_cart');
  }

  const isBouncing = ref(false);
  let bounceTimeout = null;

  function triggerBounce() {
    isBouncing.value = true;
    if (bounceTimeout) clearTimeout(bounceTimeout);
    bounceTimeout = setTimeout(() => {
      isBouncing.value = false;
    }, 600);
  }

  const toast = ref(null);
  let toastTimeout = null;

  function showToast(laptop) {
    if (!laptop) return;
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.value = {
      brand: laptop.brand,
      model: laptop.model,
      price: laptop.price,
      image_url: laptop.image_url
    };
    toastTimeout = setTimeout(() => {
      toast.value = null;
    }, 3500);
  }

  function dismissToast() {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.value = null;
  }

  return {
    items,
    totalCount,
    totalPrice,
    isBouncing,
    triggerBounce,
    toast,
    showToast,
    dismissToast,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  };
});
