import type { DOMElement } from 'ink';
import { type RefObject, useEffect, useState } from 'react';

/**
 * Statefule hook to provide the position of the referenced element.
 *
 * @param ref - The reference to the element.
 * @param deps - Dependencies to recompute the position.
 * @returns The position of the element.
 */
function useElementPosition(
  ref: RefObject<DOMElement | null>,
  deps: unknown[] = [],
) {
  const [position, setPosition] = useState<{
    left: number;
    top: number;
  }>({
    top: 0,
    left: 0,
  });

  useEffect(function UpdatePosition() {
    const position = getElementPosition(ref.current);
    if (!position) {
      return;
    }
    setPosition(position);
  }, deps);

  return position;
}

function useElementDimensions(
  ref: RefObject<DOMElement | null>,
  deps: unknown[] = [],
) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(function UpdateDimensions() {
    const dimensions = getElementDimensions(ref.current);
    if (!dimensions) {
      return;
    }
    setDimensions(dimensions);
  }, deps);

  return dimensions;
}

function getElementDimensions(node: DOMElement | null) {
  const elementLayout = node?.yogaNode?.getComputedLayout();

  if (!elementLayout) {
    return;
  }

  return {
    width: elementLayout.width,
    height: elementLayout.height,
  };
}

/**
 * Get the position of the element.
 *
 */
function getElementPosition(node: DOMElement | null) {
  if (!node) {
    return;
  }
  const { left, top } = walkNodePosition(node);

  return {
    left,
    top,
  };
}

/**
 * Walks the node's ancestry to calculate its absolute position.
 *
 * This function traverses up the parent chain of a DOMElement, accumulating
 * the `left` and `top` layout values to determine the element's final
 * absolute position within the Ink rendering context.
 *
 * Note: The initial `left` and `top` values are set to 1 because terminal
 * coordinates are 1-indexed. Relative coordinates of each element, however,
 * start from 0.
 *
 * Since InkNodes are relative by default and because Ink does not
 * provide precomputed x and y values, we need to walk the parent and
 * accumulate the x and y values.
 *
 * @param node - The DOMElement for which to calculate the position.
 * @returns An object containing the calculated `left` and `top` absolute coordinates.
 */
function walkNodePosition(node: DOMElement) {
  let current: DOMElement | undefined = node;
  let left = 1;
  let top = 1;

  while (current) {
    if (!current.yogaNode) {
      return { left, top };
    }

    const layout = current.yogaNode.getComputedLayout();
    left += layout.left;
    top += layout.top;

    current = current.parentNode;
  }
  return { left, top };
}

export {
  useElementPosition,
  getElementPosition,
  getElementDimensions,
  useElementDimensions,
};
