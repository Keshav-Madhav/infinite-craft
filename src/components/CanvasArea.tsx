import { useElementeStore } from '@/stores/elementsStore';
import React, { RefObject, useEffect, useRef } from 'react';
import Elements from './Elements';

type Dot = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  targetDx: number;
  targetDy: number;
};

const createDot = (canvas: HTMLCanvasElement): Dot => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const dx = (Math.random() - 0.5) * 0.2;
  const dy = (Math.random() - 0.5) * 0.2;
  const targetDx = dx;
  const targetDy = dy;
  return { x, y, dx, dy, targetDx, targetDy };
};

const CanvasArea = () => {
  const { canvasElements } = useElementeStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<Dot[]>([]).current;
  const animationFrameId = useRef<number | null>(null);

  // Function to draw a dot
  const drawDot = (ctx: CanvasRenderingContext2D, dot: Dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 1.3, 0, Math.PI * 2, false);
    ctx.fillStyle = '#555555';
    ctx.fill();
  };

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    animationFrameId.current = requestAnimationFrame(updateCanvas);
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      dot.x += dot.dx;
      dot.y += dot.dy;
  
      // Gradually change direction
      const directionChangeSpeed = 0.01; // Adjust this to change how quickly the dot changes direction
      dot.dx += (dot.targetDx - dot.dx) * directionChangeSpeed;
      dot.dy += (dot.targetDy - dot.dy) * directionChangeSpeed;
  
      if (dot.x < 0) {
        dot.x = canvas.width;
      } else if (dot.x > canvas.width) {
        dot.x = 0;
      }
      if (dot.y < 0) {
        dot.y = canvas.height;
      } else if (dot.y > canvas.height) {
        dot.y = 0;
      }
  
      // Change target direction randomly
      if (Math.random() < 0.01) { // 1% chance per frame
        dot.targetDx = (Math.random() - 0.5) * 0.2;
        dot.targetDy = (Math.random() - 0.5) * 0.2;
      }
  
      drawDot(ctx, dot);
    }
  
    // For each div, find its 5 closest dots and draw a line to them
    for (let i = 0; i < canvasElements.length; i++) {
      const div = canvasElements[i].ref.current;
      if (!div) continue;
      const rect = div.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect(); // get canvas position
      const centerX = rect.left - canvasRect.left + rect.width / 2; // adjust x coordinate
      const centerY = rect.top - canvasRect.top + rect.height / 2; // adjust y coordinate
  
      const closestDots = [...dots].sort((a, b) => Math.hypot(a.x - centerX, a.y - centerY) - Math.hypot(b.x - centerX, b.y - centerY)).slice(0, 5);
  
      for (let j = 0; j < closestDots.length; j++) {
        const dot = closestDots[j];
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(centerX, centerY);
        ctx.strokeStyle = '#bbbbbb';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  
    const radius = 300;
    for (let i = 0; i < canvasElements.length; i++) {
      const div1 = canvasElements[i].ref.current;
      if (!div1) continue;
      const rect1 = div1.getBoundingClientRect();
      const canvasRect1 = canvas.getBoundingClientRect(); // get canvas position
      const centerX1 = rect1.left - canvasRect1.left + rect1.width / 2; // adjust x coordinate
      const centerY1 = rect1.top - canvasRect1.top + rect1.height / 2; // adjust y coordinate
  
      for (let j = i + 1; j < canvasElements.length; j++) {
        const div2 = canvasElements[j].ref.current;
        if (!div2) continue;
        const rect2 = div2.getBoundingClientRect();
        const canvasRect2 = canvas.getBoundingClientRect(); // get canvas position
        const centerX2 = rect2.left - canvasRect2.left + rect2.width / 2; // adjust x coordinate
        const centerY2 = rect2.top - canvasRect2.top + rect2.height / 2; // adjust y coordinate
  
        const distance = Math.hypot(centerX2 - centerX1, centerY2 - centerY1);
        if (distance <= radius) {
          ctx.beginPath();
          ctx.moveTo(centerX1, centerY1);
          ctx.lineTo(centerX2, centerY2);
          ctx.strokeStyle = '#bbbbbb';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    if (dots.length === 0) {
      for (let i = 0; i < 50; i++) {
        dots.push(createDot(canvas));
      }
    }
    if (animationFrameId.current === null) {
      updateCanvas();
    }

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [canvasElements]);

  return (
    <div className='relative w-full h-full border-r-[1px] flex items-center justify-center'>
      <canvas ref={canvasRef} className='absolute w-full h-full -z-50'/>
      {canvasElements.map((element) => (
        <Elements 
          key={element.uniqueId} 
          element={element} 
          elementRef={element.ref}
          x={element.x}
          y={element.y}
          uniqueId={element.uniqueId}
          canvasRef={canvasRef}
        />
      ))}
    </div>
  );
};

export default CanvasArea;
