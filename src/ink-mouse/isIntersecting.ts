import type { MousePosition } from './MouseContext';

/**
 * Determines if the event is intersecting with the elements layout.
 *
 */
function isIntersecting({
  mouse: { x, y },
  element,
}: {
  mouse: MousePosition;
  element: { left: number; top: number; width: number; height: number };
}) {
  const left = element.left;
  const top = element.top;
  const width = element.width;
  const height = element.height;
  const isOutsideHorizontally = x < left || x >= left + width;
  const isOutsideVertically = y < top || y >= top + height;

  return !isOutsideHorizontally && !isOutsideVertically;
}

export { isIntersecting };
