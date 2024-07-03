type ElementType = {
  id: number;
  name: string;
  emoji: string;
};

type canvasElementType ={
  id: number;
  name: string;
  emoji: string;
  x: number;
  y: number;
  ref: RefObject<HTMLDivElement>;
}