import { useCallback, useEffect, type RefObject } from 'react';
import { type DOMElement } from 'ink';

import { useMouse } from './useMouse';
import type { MousePosition } from './MouseContext';
import { isIntersecting } from './isIntersecting';
import { getElementPosition, getElementDimensions } from './useElementPosition';

function useOnMouseHover(
  ref: RefObject<DOMElement>,
  onChange: (event: boolean) => void,
) {
  const mouse = useMouse();

  const handler = useCallback((position: MousePosition) => {
    const elementPosition = getElementPosition(ref.current);
    const elementDimensions = getElementDimensions(ref.current);
    if (!elementPosition || !elementDimensions) {
      return;
    }
    const element = {
      ...elementPosition,
      ...elementDimensions,
    };

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
