type ElementType = {
  elementId: number;
  name: string;
  emoji: string;
};

type canvasElementType ={
  elementId: number;
  uniqueId: number;
  name: string;
  emoji: string;
  x: number;
  y: number;
  ref: RefObject<HTMLDivElement>;
}