/**
 * Inventory Store (Backpack)
 * Manages player's items and loot
 * Single Responsibility: Inventory management only
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rarity } from '../models';

export type ItemType = 'loot' | 'consumable' | 'equipment' | 'material';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: ItemType;
  rarity: Rarity;
  description?: string;
  icon?: string;
}

interface InventoryStore {
  // State
  items: Map<string, InventoryItem>;
  capacity: number;
  usedSlots: number;
  
  // Actions
  addItem: (itemName: string, quantity?: number, type?: ItemType, rarity?: Rarity) => void;
  addMultipleItems: (itemNames: string[]) => void;
  removeItem: (itemId: string, quantity?: number) => boolean;
  useItem: (itemId: string) => boolean;
  
  // Queries
  getItem: (itemId: string) => InventoryItem | undefined;
  getAllItems: () => InventoryItem[];
  filterByType: (type: ItemType) => InventoryItem[];
  filterByRarity: (rarity: Rarity) => InventoryItem[];
  hasItem: (itemId: string, minQuantity?: number) => boolean;
  hasSpace: (slotsNeeded?: number) => boolean;
  
  // Management
  increaseCapacity: (amount: number) => void;
  
  // Persistence
  saveInventory: () => Promise<void>;
  loadInventory: () => Promise<void>;
  resetInventory: () => Promise<void>;
}

const INITIAL_CAPACITY = 50;

function generateItemId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: new Map(),
  capacity: INITIAL_CAPACITY,
  usedSlots: 0,

  addItem: (
    itemName: string,
    quantity = 1,
    type: ItemType = 'loot',
    rarity: Rarity = 'Common'
  ) => {
    const itemId = generateItemId(itemName);
    const state = get();
    const existingItem = state.items.get(itemId);

    if (existingItem) {
      // Increase quantity of existing item
      const updatedItems = new Map(state.items);
      updatedItems.set(itemId, {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
      });
      set({ items: updatedItems });
    } else {
      // Add new item
      if (!state.hasSpace()) {
        console.warn('Inventory is full! Cannot add new item.');
        return;
      }

      const newItem: InventoryItem = {
        id: itemId,
        name: itemName,
        quantity,
        type,
        rarity,
        description: `A ${rarity.toLowerCase()} ${type} item.`,
      };

      const updatedItems = new Map(state.items);
      updatedItems.set(itemId, newItem);
      
      set({
        items: updatedItems,
        usedSlots: state.usedSlots + 1,
      });
    }

    // Auto-save
    get().saveInventory();
  },

  addMultipleItems: (itemNames: string[]) => {
    itemNames.forEach((name) => {
      get().addItem(name);
    });
  },

  removeItem: (itemId: string, quantity = 1): boolean => {
    const state = get();
    const item = state.items.get(itemId);

    if (!item) {
      return false;
    }

    const updatedItems = new Map(state.items);

    if (item.quantity <= quantity) {
      // Remove item entirely
      updatedItems.delete(itemId);
      set({
        items: updatedItems,
        usedSlots: state.usedSlots - 1,
      });
    } else {
      // Decrease quantity
      updatedItems.set(itemId, {
        ...item,
        quantity: item.quantity - quantity,
      });
      set({ items: updatedItems });
    }

    // Auto-save
    get().saveInventory();
    return true;
  },

  useItem: (itemId: string): boolean => {
    const state = get();
    const item = state.items.get(itemId);

    if (!item || item.type !== 'consumable') {
      return false;
    }

    // Use the item (implement specific effects elsewhere)
    return get().removeItem(itemId, 1);
  },

  getItem: (itemId: string): InventoryItem | undefined => {
    return get().items.get(itemId);
  },

  getAllItems: (): InventoryItem[] => {
    return Array.from(get().items.values());
  },

  filterByType: (type: ItemType): InventoryItem[] => {
    return Array.from(get().items.values()).filter((item) => item.type === type);
  },

  filterByRarity: (rarity: Rarity): InventoryItem[] => {
    return Array.from(get().items.values()).filter((item) => item.rarity === rarity);
  },

  hasItem: (itemId: string, minQuantity = 1): boolean => {
    const item = get().items.get(itemId);
    return item ? item.quantity >= minQuantity : false;
  },

  hasSpace: (slotsNeeded = 1): boolean => {
    const state = get();
    return state.usedSlots + slotsNeeded <= state.capacity;
  },

  increaseCapacity: (amount: number) => {
    set((state) => ({
      capacity: state.capacity + amount,
    }));
    get().saveInventory();
  },

  saveInventory: async () => {
    try {
      const state = get();
      const data = {
        items: Array.from(state.items.entries()),
        capacity: state.capacity,
        usedSlots: state.usedSlots,
      };
      await AsyncStorage.setItem('inventory', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save inventory:', error);
    }
  },

  loadInventory: async () => {
    try {
      const saved = await AsyncStorage.getItem('inventory');
      if (saved) {
        const data = JSON.parse(saved);
        set({
          items: new Map(data.items),
          capacity: data.capacity,
          usedSlots: data.usedSlots,
        });
        console.log(`🎒 Loaded ${data.usedSlots} inventory items`);
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  },

  resetInventory: async () => {
    set({
      items: new Map(),
      capacity: INITIAL_CAPACITY,
      usedSlots: 0,
    });
    await AsyncStorage.removeItem('inventory');
    console.log('🧹 Inventory reset');
  },
}));
