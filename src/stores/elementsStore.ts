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
  modifyCanvasElementPosition: (x: number, y: number, elementId: number) => void;
};

const generateUniqueNumberId = () => {
  const dateTime = Date.now().toString();
  const uniqueNumber = Math.random().toString().slice(2);
  return parseInt(dateTime + uniqueNumber);
}

export const useElementeStore = create<Store>((set) => ({
  elementsList: 
    JSON.parse(localStorage.getItem('elementsList') || '[{"elementId": 1, "name": "Earth", "emoji": "🌎"},{"elementId": 2, "name": "Water", "emoji": "💧"},{"elementId": 3, "name": "Fire", "emoji": "🔥"},{"elementId": 4, "name": "Wind", "emoji": "💨"}]'),
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
      const newElementsList = state.elementsList.filter((el) => el.elementId !== element.elementId);
      localStorage.setItem('elementsList', JSON.stringify(newElementsList));
      return { elementsList: newElementsList };
    });
  },
  canvasElements: [],
  addCanvasElement: (element, ref) => {
    set((state) => {
      const newCanvasElement = { ...element, x: Math.random() * 700, y: Math.random() * 700, ref, uniqueId: generateUniqueNumberId() };
      return { canvasElements: [...state.canvasElements, newCanvasElement] };
    });
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

