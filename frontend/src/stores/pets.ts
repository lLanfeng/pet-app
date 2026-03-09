import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { petAPI } from '@/services/api';

interface Pet {
  id: number;
  user_id: number;
  name: string;
  type: string;
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  created_at: string;
  updated_at: string;
}

export const usePetsStore = defineStore('pets', () => {
  const pets = ref<Pet[]>([]);
  const currentPet = ref<Pet | null>(null);

  const petCount = computed(() => pets.value.length);

  const getPets = async (userId: number) => {
    try {
      const data = await petAPI.listPetsByUser(userId);
      pets.value = data || [];
      return data;
    } catch (err) {
      console.error('Failed to load pets', err);
      throw err;
    }
  };

  const getPetById = async (id: number) => {
    try {
      const data = await petAPI.getPetById(id);
      currentPet.value = data;
      return data;
    } catch (err) {
      console.error('Failed to load pet', err);
      throw err;
    }
  };

  const createPet = async (userId: number, name: string, type: string) => {
    try {
      const data = await petAPI.createPet({ userId, name, type });
      pets.value.push(data);
      return data;
    } catch (err) {
      console.error('Failed to create pet', err);
      throw err;
    }
  };

  const updatePet = async (id: number, update: any) => {
    try {
      await petAPI.updatePet(id, update);
      const index = pets.value.findIndex(p => p.id === id);
      if (index >= 0) {
        Object.assign(pets.value[index], update);
      }
      if (currentPet.value?.id === id) {
        Object.assign(currentPet.value, update);
      }
    } catch (err) {
      console.error('Failed to update pet', err);
      throw err;
    }
  };

  const deletePet = async (id: number) => {
    try {
      await petAPI.deletePet(id);
      pets.value = pets.value.filter(p => p.id !== id);
      if (currentPet.value?.id === id) {
        currentPet.value = null;
      }
    } catch (err) {
      console.error('Failed to delete pet', err);
      throw err;
    }
  };

  return {
    pets,
    currentPet,
    petCount,
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
  };
});
