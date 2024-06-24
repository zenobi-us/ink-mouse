import { useEffect, useState } from 'react';

import { useMouse } from './useMouse';

function useMousePosition() {
  const mouse = useMouse();
  const [position, setPosition] = useState({
    x: mouse.position.x,
    y: mouse.position.y,
  });

  useEffect(() => {
    mouse.events.on('position', (position) => {
      setPosition({
        x: position.x,
        y: position.y,
      });
    });
  }, [mouse.position.x, mouse.position.y]);

  return position;
}

export { useMousePosition };
