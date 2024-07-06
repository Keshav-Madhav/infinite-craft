import { useElementeStore } from '@/stores/elementsStore'
import { RefObject, createRef, useEffect } from 'react'
import CreateNewElement from './CreateNewElement'
import { motion } from 'framer-motion'

type Props = {
  element: ElementType
  elementRef?: RefObject<HTMLDivElement>
  x?: number
  y?: number
  uniqueId?: number
  canvasRef?: RefObject<HTMLCanvasElement>
}

const Elements = ({ element, elementRef, x, y, uniqueId, canvasRef }: Props) => {
  const { addCanvasElement, modifyCanvasElementPosition, removeCanvasElement, canvasElements, addElement, elementsList} = useElementeStore();

  const handleClick = () => {
    if (!elementRef) {
      const newRef = createRef<HTMLDivElement>();
      new Audio('/element-insert.wav').play();
      addCanvasElement(element, newRef);
    }
  };  

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(elementRef && uniqueId) {
      removeCanvasElement(uniqueId);
      new Audio('/element-remove.mp3').play();
    }
  };

  
  const handleMerge = async(element1: string, element2: string, newElementX: number, newElementY: number, uqID1: number, uqID2: number) => {
    const element = await CreateNewElement({element1, element2});
    if(element !== '#NAN#') {
      const newElement = { 
        elementId: elementsList.length + 1,
        name: element.split(':')[1], 
        emoji: element.split(':')[0]
      };
      console.log(newElement);
    
      addElement(newElement);
      const newRef = createRef<HTMLDivElement>();

      addCanvasElement(
        newElement, 
        newRef, 
        newElementX, 
        newElementY
      );

      new Audio('/element-merge.mp3').play();
      
      removeCanvasElement(uqID1);
      removeCanvasElement(uqID2);

      return true;
    } else {
      return false;
    }
  }


  useEffect(() => {
    if(elementRef && canvasRef && x && y && uniqueId) {
      const handleMouseDown = (e: MouseEvent) => {
        if(e.button !== 0) return;
        let offsetX = 0;
        let offsetY = 0;

        if(elementRef.current) {
          offsetX = e.clientX - elementRef.current.getBoundingClientRect().left;
          offsetY = e.clientY - elementRef.current.getBoundingClientRect().top;

          elementRef.current.style.zIndex = '1000';
        }

        const handleMouseMove = (e: MouseEvent) => {
          if(e.button !== 0) return;
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
                    const isMerged = handleMerge(element.name, el.name, newElementX, newElementY, uniqueId, el.uniqueId);

                    if(!isMerged && el.ref.current && elementRef.current) {
                      el.ref.current.classList.remove('gradient-effect');
                      el.ref.current.style.transform = 'scale(1)';
                      elementRef.current.classList.remove('gradient-effect');
                      elementRef.current.style.transform = 'scale(1)';
                    }
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
  }, [elementRef, x, y, uniqueId, canvasElements, addElement, modifyCanvasElementPosition, removeCanvasElement, addCanvasElement, canvasRef]);

  return (
    <motion.div 
      className={`
        h-10 px-2 py-1.5 rounded-md border cursor-pointer bg-white hover:border-gray-400 element-effect
        ${elementRef ? 'absolute' : 'relative'}
        whitespace-nowrap
        select-none
      `}
      style={{ left: x, top: y }}
      ref={elementRef}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.05 }}
      exit={{ opacity: 0.5, scale: 0 }}
    >
      {element.emoji} {element.name}
    </motion.div>
  )
};

Elements.displayName = 'Elements';

export default Elements;
