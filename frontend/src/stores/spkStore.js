import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useSpkStore = defineStore('spk', () => {
  const profiles = ref([]);
  const selectedProfileId = ref(1);
  const filters = ref({
    category: 'all',
    max_price: 500000000,
    brand: 'all',
    min_ram: null
  });

  const recommendations = ref([]);
  const brands = ref([]);
  const minMaxReference = ref(null);
  const rawMatrix = ref([]);
  const normalizedMatrix = ref([]);
  const criteria = ref([]);
  const currentWeights = ref({});
  const loading = ref(false);
  const error = ref(null);

  const isCustomProfile = ref(false);
  const customWeights = ref({
    1: 0.20,
    2: 0.15,
    3: 0.15,
    4: 0.10,
    5: 0.05,
    6: 0.15,
    7: 0.15,
    8: 0.025,
    9: 0.025
  });

  // Load custom weights from localStorage if present
  try {
    const savedCustom = localStorage.getItem('smartinfra_custom_weights');
    if (savedCustom) {
      customWeights.value = JSON.parse(savedCustom);
    }
  } catch (e) {
    console.warn('Failed to parse cached custom weights', e);
  }

  async function fetchProfiles() {
    try {
      const res = await axios.get('/api/profiles');
      if (res.data.success) {
        profiles.value = res.data.data;
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  }

  async function fetchBrands() {
    try {
      const res = await axios.get('/api/brands');
      if (res.data.success && Array.isArray(res.data.data)) {
        brands.value = res.data.data;
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  }

  async function calculateRecommendations(customWeightsOverride = null) {
    loading.value = true;
    error.value = null;
    try {
      const payload = {
        profile_id: selectedProfileId.value,
        filters: {
          category: filters.value.category,
          max_price: filters.value.max_price,
          brand: filters.value.brand,
          min_ram: filters.value.min_ram
        }
      };

      const activeCustomWeights = customWeightsOverride || (isCustomProfile.value ? customWeights.value : null);
      if (activeCustomWeights) {
        payload.custom_weights = activeCustomWeights;
      }

      const res = await axios.post('/api/spk/recommend', payload);
      if (res.data.success) {
        recommendations.value = res.data.results || [];
        if (res.data.brands && Array.isArray(res.data.brands)) {
          brands.value = res.data.brands;
        }
        minMaxReference.value = res.data.minMaxReference;
        rawMatrix.value = res.data.rawMatrix || [];
        normalizedMatrix.value = res.data.normalizedMatrix || [];
        criteria.value = res.data.criteria || [];
        currentWeights.value = res.data.weights || {};
      } else {
        error.value = res.data.message;
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      console.error('Error running SPK calculation:', err);
    } finally {
      loading.value = false;
    }
  }

  function setProfile(id) {
    isCustomProfile.value = false;
    selectedProfileId.value = id;
    // Clone weights to customWeights as initial baseline for tweaking
    const targetProfile = profiles.value.find(p => p.id === id);
    if (targetProfile && targetProfile.weights) {
      customWeights.value = { ...targetProfile.weights };
    }
    calculateRecommendations();
  }

  function enableCustomProfile() {
    isCustomProfile.value = true;
    // If customWeights is empty or missing, populate from current active profile
    if (!customWeights.value || Object.keys(customWeights.value).length === 0) {
      const targetProfile = profiles.value.find(p => p.id === selectedProfileId.value);
      if (targetProfile && targetProfile.weights) {
        customWeights.value = { ...targetProfile.weights };
      }
    }
    calculateRecommendations(customWeights.value);
  }

  function updateCustomWeight(criterionId, value) {
    customWeights.value[criterionId] = parseFloat(value) || 0;
    try {
      localStorage.setItem('smartinfra_custom_weights', JSON.stringify(customWeights.value));
    } catch (e) {}
  }

  function normalizeCustomWeights() {
    const keys = Object.keys(customWeights.value);
    if (keys.length === 0) return;
    const sum = keys.reduce((acc, k) => acc + (parseFloat(customWeights.value[k]) || 0), 0);
    if (sum > 0) {
      keys.forEach(k => {
        customWeights.value[k] = parseFloat(((parseFloat(customWeights.value[k]) || 0) / sum).toFixed(4));
      });
      try {
        localStorage.setItem('smartinfra_custom_weights', JSON.stringify(customWeights.value));
      } catch (e) {}
    }
    calculateRecommendations(customWeights.value);
  }

  function resetCustomWeights() {
    const targetProfile = profiles.value.find(p => p.id === selectedProfileId.value);
    if (targetProfile && targetProfile.weights) {
      customWeights.value = { ...targetProfile.weights };
      try {
        localStorage.setItem('smartinfra_custom_weights', JSON.stringify(customWeights.value));
      } catch (e) {}
      calculateRecommendations(customWeights.value);
    }
  }

  return {
    profiles,
    selectedProfileId,
    filters,
    brands,
    recommendations,
    minMaxReference,
    rawMatrix,
    normalizedMatrix,
    criteria,
    currentWeights,
    isCustomProfile,
    customWeights,
    loading,
    error,
    fetchProfiles,
    fetchBrands,
    calculateRecommendations,
    setProfile,
    enableCustomProfile,
    updateCustomWeight,
    normalizeCustomWeights,
    resetCustomWeights
  };
});
