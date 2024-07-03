import { useElementeStore } from '@/stores/elementsStore'
import { RefObject, createRef, forwardRef } from 'react'

type Props = {
  element: ElementType
  elementRef?: RefObject<HTMLDivElement>
  x?: number
  y?: number
}

const Elements = forwardRef<HTMLDivElement, Props>(({ element, elementRef, x, y }, ref) => {
  const { addCanvasElement } = useElementeStore();

  const handleClick = () => {
    if (!elementRef) {
      const newRef = createRef<HTMLDivElement>();
      addCanvasElement(element, newRef);
    }
  };  

  return (
    <div 
      className={`
        px-2 py-1.5 rounded-md border cursor-pointer bg-white hover:border-gray-400 hover:bg-gradient-to-t hover:from-blue-500/20 hover:via-white hover:to-white
        ${ref ? 'absolute' : 'relative'}
      `}
      style={{ left: x, top: y }}
      ref={ref || elementRef}
      onClick={handleClick}
    >
      {element.emoji} {element.name}
    </div>
  )
});

Elements.displayName = 'Elements';

export default Elements;
