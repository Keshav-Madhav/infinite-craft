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

const Elements = ({ element, elementRef, x, y, uniqueId, canvasRef }: Props) => {
  const { addCanvasElement, modifyCanvasElementPosition, removeCanvasElement, canvasElements, addElement} = useElementeStore();

  const handleClick = () => {
    if (!elementRef) {
      const newRef = createRef<HTMLDivElement>();
      addCanvasElement(element, newRef);
    }
  };  

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(elementRef && uniqueId) {
      removeCanvasElement(uniqueId);
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

        elementRef.current.style.zIndex = '1000';
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

        canvasElements.forEach((el) => {
          if(elementRef.current && el.ref.current){
            if(el.uniqueId !== uniqueId) {
              const otherElementX = el.ref.current.getBoundingClientRect().left;
              const otherElementY = el.ref.current.getBoundingClientRect().top;
              const otherElementHeight = el.ref.current.offsetHeight;
              const otherElementWidth = el.ref.current.offsetWidth;
              
              if(newX < otherElementX! + otherElementWidth! &&
              newX + elementRef.current.offsetWidth > otherElementX! &&
              newY < otherElementY! + otherElementHeight! &&
              newY + elementRef.current.offsetHeight > otherElementY!) 
              {
                el.ref.current.classList.add('gradient-effect');
                el.ref.current.style.transform = 'scale(1.15)';
              } else {
                el.ref.current.classList.remove('gradient-effect');
                el.ref.current.style.transform = 'scale(1)';
              }              
            }
          }
        });
      };
      

      const handleMouseUp = () => {
        if(elementRef.current && canvasElements.length > 1 && uniqueId) {
          elementRef.current.style.zIndex = '1';
          const currElementX = elementRef.current.getBoundingClientRect().left;
          const currElementY = elementRef.current.getBoundingClientRect().top;
          const currElementHeight = elementRef.current.offsetHeight;
          const currElementWidth = elementRef.current.offsetWidth;
          
          canvasElements.forEach((el) => {
            if(el.uniqueId !== uniqueId) {
              const otherElementX = el.ref.current?.getBoundingClientRect().left;
              const otherElementY = el.ref.current?.getBoundingClientRect().top;
              const otherElementHeight = el.ref.current?.offsetHeight;
              const otherElementWidth = el.ref.current?.offsetWidth;
              
              if(currElementX < otherElementX! + otherElementWidth! &&
                currElementX + currElementWidth > otherElementX! &&
                currElementY < otherElementY! + otherElementHeight! &&
                currElementY + currElementHeight > otherElementY!) {
                  const newElementX = (currElementX + otherElementX) / 2;
                  const newElementY = (currElementY + otherElementY) / 2;
                  const newElement = { elementId: 5, name: 'newEl', emoji: '🪨' };
                  
                  addElement(newElement);

                  removeCanvasElement(uniqueId);
                  removeCanvasElement(el.uniqueId);
                  const newRef = createRef<HTMLDivElement>();
                  

                  addCanvasElement(
                    {
                      elementId: 5,
                      name: 'newEl',
                      emoji: '🪨'
                    }, 
                    newRef, 
                    newElementX, 
                    newElementY
                  );
                }
            }
          });
        };

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
        px-2 py-1.5 rounded-md border cursor-pointer bg-white hover:border-gray-400 element-effect
        ${elementRef ? 'absolute' : 'relative'}
        whitespace-nowrap
        select-none
      `}
      style={{ left: x, top: y }}
      ref={elementRef}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {element.emoji} {element.name}
    </div>
  )
};

Elements.displayName = 'Elements';

export default Elements;
