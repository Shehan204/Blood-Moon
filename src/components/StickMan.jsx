import { useRef, useEffect, useState } from 'react';
import useMousePosition from '../hooks/useMousePosition';
import DragonImage from './Dragon.png';

const Dragon = () => {
  const dragonRef = useRef(null);
  const mousePos = useMousePosition();
  const bloodRainRef = useRef(null);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeoutRef = useRef(null);
  const lastMousePosRef = useRef({ x: mousePos.x, y: mousePos.y });

  const IDLE_TIME = 1000; // Time in milliseconds to consider the cursor idle

  useEffect(() => {
    // Check if the mouse has moved
    if (mousePos.x !== lastMousePosRef.current.x || mousePos.y !== lastMousePosRef.current.y) {
      // Reset idle timer
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      setIsIdle(false);
      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, IDLE_TIME);

      // Update last mouse position
      lastMousePosRef.current = { x: mousePos.x, y: mousePos.y };
    }

    if (dragonRef.current) {
      dragonRef.current.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px)`;
    }
  }, [mousePos]);

  useEffect(() => {
    if (isIdle && dragonRef.current && bloodRainRef.current) {
      // Create multiple blood droplets at random positions within a radius from the center of the image
      const createBloodDrop = () => {
        const bloodDrop = document.createElement('div');
        bloodDrop.className = 'blood-drop';

        // Calculate the center of the image
        const centerX = mousePos.x + 40; // Assuming image width is 80px
        const centerY = mousePos.y + 50; // Assuming image height is 100px

        // Random position within 80px radius from the center
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 80;
        const offsetX = centerX + radius * Math.cos(angle);
        const offsetY = centerY + radius * Math.sin(angle);

        bloodDrop.style.left = `${offsetX}px`;
        bloodDrop.style.top = `${offsetY}px`;

        bloodRainRef.current.appendChild(bloodDrop);

        // Remove old blood droplets
        const drops = bloodRainRef.current.children;
        if (drops.length > 50) {
          bloodRainRef.current.removeChild(drops[0]);
        }
      };

      // Create blood drops at intervals
      const interval = setInterval(createBloodDrop, 500);
      return () => clearInterval(interval);
    }
  }, [isIdle, mousePos]);

  return (
    <>
      <div ref={bloodRainRef} className="blood-rain-container">
        {/* Blood droplets will be appended here */}
      </div>
      <div ref={dragonRef} className="dragon-container">
        <img src={DragonImage} alt="Dragon" className="dragon-img" />
      </div>
    </>
  );
};

export default Dragon;
