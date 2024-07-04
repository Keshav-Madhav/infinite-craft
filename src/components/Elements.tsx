import { useElementeStore } from '@/stores/elementsStore'
import { RefObject, createRef, forwardRef, useEffect } from 'react'

type Props = {
  element: ElementType
  elementRef?: RefObject<HTMLDivElement>
  x?: number
  y?: number
  uniqueId?: number
  canvasRef?: RefObject<HTMLCanvasElement>
}

const Elements = forwardRef<HTMLDivElement, Props>(({ element, elementRef, x, y, uniqueId, canvasRef }) => {
  const { addCanvasElement, modifyCanvasElementPosition } = useElementeStore();

  const handleClick = () => {
    if (!elementRef) {
      const newRef = createRef<HTMLDivElement>();
      addCanvasElement(element, newRef);
    }
  };  

  useEffect(() => {
  if(elementRef && canvasRef && x && y && uniqueId) {
    const handleMouseDown = (e: MouseEvent) => {
      let offsetX = 0;
      let offsetY = 0;

      if(elementRef.current) {
        offsetX = e.clientX - elementRef.current.getBoundingClientRect().left;
        offsetY = e.clientY - elementRef.current.getBoundingClientRect().top;
      }

      const handleMouseMove = (e: MouseEvent) => {
        if(!elementRef.current || !canvasRef.current) return;
        const canvasBounds = canvasRef.current.getBoundingClientRect();
      
        // Calculate the new position
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
      
        // Check if the new position is within the canvas boundaries
        if (newX < canvasBounds.left) newX = canvasBounds.left;
        if (newY < canvasBounds.top) newY = canvasBounds.top;
        if (newX + elementRef.current.offsetWidth > canvasBounds.right) newX = canvasBounds.right - elementRef.current.offsetWidth;
        if (newY + elementRef.current.offsetHeight > canvasBounds.bottom) newY = canvasBounds.bottom - elementRef.current.offsetHeight;
      
        // Update the position
        modifyCanvasElementPosition(newX, newY, uniqueId);
      };
      

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    elementRef.current?.addEventListener('mousedown', handleMouseDown);
    return () => {
      elementRef.current?.removeEventListener('mousedown', handleMouseDown);
    };
  }
}, [elementRef, x, y]);


  return (
    <div 
      className={`
        px-2 py-1.5 rounded-md border cursor-pointer bg-white hover:border-gray-400 hover:bg-gradient-to-t hover:from-blue-500/20 hover:via-white hover:to-white
        ${elementRef ? 'absolute' : 'relative'}
        whitespace-nowrap
        select-none
      `}
      style={{ left: x, top: y }}
      ref={elementRef}
      onClick={handleClick}
    >
      {element.emoji} {element.name}
    </div>
  )
});

Elements.displayName = 'Elements';

export default Elements;
