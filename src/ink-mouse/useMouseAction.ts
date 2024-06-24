import { useEffect, useState } from 'react';

import { useMouse } from './useMouse';
import type {
  MouseClickAction,
  MouseDragAction,
  MouseScrollAction,
} from './MouseContext';

function useMouseAction() {
  const mouse = useMouse();
  const [action, setAction] = useState<
    MouseClickAction | MouseScrollAction | MouseDragAction | null
  >();

  useEffect(() => {
    mouse.events.on('click', (position, action) => {
      setAction(action);
    });
    mouse.events.on('scroll', (position, action) => {
      setAction(action);
    });
    mouse.events.on('drag', (position, action) => {
      setAction(action);
    });
  }, [mouse.position.x, mouse.position.y]);

  return action;
}

export { useMouseAction };
