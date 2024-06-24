import type { MousePosition } from './MouseContext.js';

// const LEFT_ADJUSTMENT = 13;
// const TOP_ADJUSTMENT = 2;

/**
 * Determines if the event is intersecting with the elements layout.
 *
 * TODO: This currently seems to have an off by 13 and 2 issue.
 */
function isIntersecting({
  mouse: { x, y },
  element,
}: {
  mouse: MousePosition;
  element: { left: number; top: number; width: number; height: number };
}) {
  /**
   * for some reason the position is off by 13 and 2
   */
  const left = element.left;
  const top = element.top;
  const width = element.width;
  const height = element.height;
  const isOutsideHorizontally = x < left || x > left + width;
  const isOutsideVertically = y < top || y > top + height;

  return !isOutsideHorizontally && !isOutsideVertically;
}
export { isIntersecting };
