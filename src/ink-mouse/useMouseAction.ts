import { useEffect, useState } from 'react';

import { useMouse } from './useMouse';
import type {
  MouseClickAction,
  MouseDragAction,
  MouseScrollAction,
  MouseButton,
} from './MouseContext';

function useMouseAction() {
  const mouse = useMouse();
  const [action, setAction] = useState<{
    action: MouseClickAction | MouseScrollAction | MouseDragAction | null;
    button: MouseButton | null;
  }>({ action: null, button: null });

  useEffect(() => {
    mouse.events.on('click', (position, action, button) => {
      setAction({ action, button });
    });
    mouse.events.on('scroll', (position, action) => {
      setAction({ action, button: null });
    });
    mouse.events.on('drag', (position, action, button) => {
      setAction({ action, button });
    });
  }, [mouse.position.x, mouse.position.y]);

  return action;
}

export { useMouseAction };
