import { useCallback, useEffect, type RefObject } from 'react';
import { type DOMElement } from 'ink';

import { useMouse } from './useMouse.js';
import type { MousePosition } from './MouseContext.js';
import { isIntersecting } from './isIntersecting.js';
import { getElemenetPosition } from './useElementPosition.js';

function useOnMouseHover(
  ref: RefObject<DOMElement>,
  onChange: (event: boolean) => void,
) {
  const mouse = useMouse();

  const handler = useCallback((position: MousePosition) => {
    const element = getElemenetPosition(ref.current);
    if (!element) {
      return;
    }
    const intersecting = isIntersecting({
      element,
      mouse: position,
    });

    onChange(intersecting);
  }, []);

  useEffect(function HandleIntersection() {
    const events = mouse.events;

    events.on('position', handler);
    return () => {
      events.off('position', handler);
    };
  }, []);
}

export { useOnMouseHover };
