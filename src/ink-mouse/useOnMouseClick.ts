import { useCallback, useEffect, type RefObject } from 'react';
import { type DOMElement } from 'ink';

import { useMouse } from './useMouse.js';
import type { MouseClickAction, MousePosition } from './MouseContext.js';
import { isIntersecting } from './isIntersecting.js';
import { useElementPosition } from './useElementPosition.js';

function useOnMouseClick(
  ref: RefObject<DOMElement>,
  onChange: (event: boolean) => void,
) {
  const mouse = useMouse();
  const element = useElementPosition(ref);

  const handler = useCallback(
    (position: MousePosition, action: MouseClickAction) => {
      onChange(
        isIntersecting({ element, mouse: position }) && action === 'press',
      );
    },
    [ref.current],
  );

  useEffect(
    function HandleIntersection() {
      const events = mouse.events;

      events.on('click', handler);
      return () => {
        events.off('click', handler);
      };
    },
    [ref.current],
  );
}

export { useOnMouseClick };
