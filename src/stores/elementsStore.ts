import { create } from 'zustand';
import { RefObject } from 'react';

type Store = {
  elementsList: ElementType[];
  setElementsList: (elementsList: ElementType[]) => void;
  selectedElement: ElementType | null;
  setSelectedElement: (element: ElementType) => void;
  addElement: (element: ElementType) => void;
  removeElement: (element: ElementType) => void;
  canvasElements: canvasElementType[];
  addCanvasElement: (element: ElementType, ref: RefObject<HTMLDivElement>) => void;
};

export const useElementeStore = create<Store>((set) => ({
  elementsList: 
    JSON.parse(localStorage.getItem('elementsList') || '[{"id": 1, "name": "Earth", "emoji": "🌎"},{"id": 2, "name": "Water", "emoji": "💧"},{"id": 3, "name": "Fire", "emoji": "🔥"},{"id": 4, "name": "Wind", "emoji": "💨"}]'),
  setElementsList: (elementsList) => {
    localStorage.setItem('elementsList', JSON.stringify(elementsList));
    set({ elementsList });
  },    
  selectedElement: null,
  setSelectedElement: (selectedElement) => set({ selectedElement }),
  addElement: (element) => {
    set((state) => {
      const newElementsList = [...state.elementsList, element];
      localStorage.setItem('elementsList', JSON.stringify(newElementsList));
      return { elementsList: newElementsList };
    });
  },
  removeElement: (element) => {
    set((state) => {
      const newElementsList = state.elementsList.filter((el) => el.id !== element.id);
      localStorage.setItem('elementsList', JSON.stringify(newElementsList));
      return { elementsList: newElementsList };
    });
  },
  canvasElements: [],
  addCanvasElement: (element, ref) => {
    set((state) => {
      const newCanvasElement = { ...element, x: Math.random() * 500, y: Math.random() * 500, ref };
      return { canvasElements: [...state.canvasElements, newCanvasElement] };
    });
  },
}));

