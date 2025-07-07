import { ref, computed } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "boardgame-assistant-api-key";

export const useSettingsStore = defineStore("settings", () => {
  const apiKey = ref("");
  const isModalOpen = ref(false);
  const isLoaded = ref(false);

  // Load API key from localStorage on first access
  const loadApiKey = () => {
    if (!isLoaded.value) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        apiKey.value = stored;
      }
      isLoaded.value = true;
    }
  };

  const hasApiKey = computed(() => {
    loadApiKey();
    return apiKey.value.trim().length > 0;
  });

  const setApiKey = (key: string) => {
    apiKey.value = key;
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const clearApiKey = () => {
    apiKey.value = "";
    localStorage.removeItem(STORAGE_KEY);
  };

  const openModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const getApiKey = computed(() => {
    loadApiKey();
    return apiKey.value;
  });

  return {
    // State
    apiKey: getApiKey,
    isModalOpen,

    // Getters
    hasApiKey,

    // Actions
    setApiKey,
    clearApiKey,
    openModal,
    closeModal,
  };
});
