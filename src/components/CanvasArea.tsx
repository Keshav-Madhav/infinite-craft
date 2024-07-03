import React, { useEffect, useRef } from 'react';

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
  const dx = (Math.random() - 0.5) * 0.2; // Slower speed
  const dy = (Math.random() - 0.5) * 0.2; // Slower speed
  const targetDx = dx;
  const targetDy = dy;
  return { x, y, dx, dy, targetDx, targetDy };
};

const CanvasArea = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const dots: Dot[] = [];

  // Function to draw a dot
  const drawDot = (ctx: CanvasRenderingContext2D, dot: Dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2, false);
    ctx.fillStyle = '#888888';
    ctx.fill();
  };

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    const div = divRef.current;
    if (!canvas || !div) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    requestAnimationFrame(updateCanvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get the center of the div
    const rect = div.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Sort dots by distance to the div center and select the 5 closest
    const dotsToConnect = [...dots].sort((a, b) => Math.hypot(a.x - centerX, a.y - centerY) - Math.hypot(b.x - centerX, b.y - centerY)).slice(0, 5);

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      dot.x += dot.dx;
      dot.y += dot.dy;

      // Gradually change direction
      const directionChangeSpeed = 0.01; // Adjust this to change how quickly the dot changes direction
      dot.dx += (dot.targetDx - dot.dx) * directionChangeSpeed;
      dot.dy += (dot.targetDy - dot.dy) * directionChangeSpeed;

      // If the dot goes past an edge, it comes out the opposite edge
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

      // If the dot is one of the selected, draw a line to the div center
      if (dotsToConnect.includes(dot)) {
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(centerX, centerY);
        ctx.strokeStyle = '#bbbbbb';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    for (let i = 0; i < 30; i++) {
      dots.push(createDot(canvas));
    }
    updateCanvas();
  });

  return (
    <div className='relative w-full h-full border-r-[1px] flex items-center justify-center'>
      <canvas ref={canvasRef} className='absolute w-full h-full'/>
      <div className='absolute w-40 h-10 bg-white border rounded-md' ref={divRef}/>
    </div>
  );
};

export default CanvasArea;
