import { create } from 'zustand';
import { RefObject } from 'react';

type Store = {
  elementsList: ElementType[];
  setElementsList: (elementsList: ElementType[]) => void;
  selectedElement: ElementType | null;
  setSelectedElement: (element: ElementType) => void;
  addElement: (element: ElementType) => void;
  removeElement: (element: ElementType) => void;
  removeAllElements: () => void;
  canvasElements: canvasElementType[];
  addCanvasElement: (element: ElementType, ref: RefObject<HTMLDivElement>, x?: number, y?: number) => void;
  removeCanvasElement: (uniqueId: number) => void;
  clearCanvasElements: () => void;
  modifyCanvasElementPosition: (x: number, y: number, elementId: number) => void;
};

const generateUniqueNumberId = () => {
  const dateTime = Date.now().toString();
  const uniqueNumber = Math.random().toString().slice(2);
  return parseInt(dateTime + uniqueNumber);
}

export const useElementeStore = create<Store>((set) => ({
  elementsList: 
    typeof window !== 'undefined' && localStorage ? JSON.parse(localStorage.getItem('elementsList') || '[{"elementId": 1, "name": "Earth", "emoji": "🌎"},{"elementId": 2, "name": "Water", "emoji": "💧"},{"elementId": 3, "name": "Fire", "emoji": "🔥"},{"elementId": 4, "name": "Wind", "emoji": "🌬️"}]') : [],

  setElementsList: (elementsList) => {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('elementsList', JSON.stringify(elementsList));
    }
    set({ elementsList });
  },      

  selectedElement: null,

  setSelectedElement: (selectedElement) => set({ selectedElement }),

  addElement: (element) => {
    set((state) => {
      // Check if an element with the same name or id already exists
      const existingElement = state.elementsList.find((el) => el.name === element.name || el.elementId === element.elementId);
      if (existingElement) {
        return state;
      }
      const newElementsList = [...state.elementsList, element];
      localStorage.setItem('elementsList', JSON.stringify(newElementsList));
      return { elementsList: newElementsList };
    });
  },  

  removeElement: (element) => {
    set((state) => {
      const newElementsList = state.elementsList.filter((el) => el.elementId !== element.elementId);
      localStorage.setItem('elementsList', JSON.stringify(newElementsList));
      return { elementsList: newElementsList };
    });
  },

  removeAllElements: () => {
    set({ elementsList: [{"elementId": 1, "name": "Earth", "emoji": "🌎"},{"elementId": 2, "name": "Water", "emoji": "💧"},{"elementId": 3, "name": "Fire", "emoji": "🔥"},{"elementId": 4, "name": "Wind", "emoji": "🌬️"}] });
    localStorage.removeItem('elementsList');
  },

  canvasElements: [],

  addCanvasElement: (element, ref, x, y) => {
    set((state) => {
      const newCanvasElement = { 
        ...element, 
        x: x || Math.random() * 700, 
        y: y || Math.random() * 700, 
        ref, 
        uniqueId: generateUniqueNumberId() 
      };
      return { canvasElements: [...state.canvasElements, newCanvasElement] };
    });
  },

  removeCanvasElement: (uniqueId) => {
    set((state) => {
      const newCanvasElements = state.canvasElements.filter((el) => el.uniqueId !== uniqueId);
      return { canvasElements: newCanvasElements };
    });
  },

  clearCanvasElements: () => {
    set({ canvasElements: [] });
  },
  
  modifyCanvasElementPosition: (x, y, uniqueId) => {
    set((state) => {
      const newCanvasElements = state.canvasElements.map((el) => {
        if (el.uniqueId === uniqueId) {
          return { ...el, x, y };
        }
        return el;
      });
      return { canvasElements: newCanvasElements };
    });
  },
}));

