import type { DOMElement } from 'ink';
import { useEffect, useState, type RefObject } from 'react';

/**
 * Statefule hook to provide the position of the referenced element.
 *
 * @param ref - The reference to the element.
 * @returns The position of the element.
 */
function useElementPosition(ref: RefObject<DOMElement | null>, deps: unknown[] = []) {
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

function useElementDimensions(ref: RefObject<DOMElement | null>, deps: unknown[] = []) {
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    }>({
        width: 0,
        height: 0
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
    if (!node) {
        return;
    }

    if (!node.yogaNode) {
        return;
    }

    const elementLayout = node.yogaNode.getComputedLayout();

    return {
        width: elementLayout.width,
        height: elementLayout.height
    }
}

/**
 * Get the position of the element.
 *
 */
function getElementPosition(node: DOMElement | null) {
  if (!node) {
    return null;
  }

  if (!node.yogaNode) {
    return null;
  }
  const elementLayout = node.yogaNode.getComputedLayout();

  const parent = walkParentPosition(node);

  const position = {
    left: elementLayout.left + parent.x,
    top: elementLayout.top + parent.y,
  };

  return position;
}

/**
 * Walk the parent ancestory to get the position of the element.
 *
 * Since InkNodes are relative by default and because Ink does not
 * provide precomputed x and y values, we need to walk the parent and
 * accumulate the x and y values.
 *
 * I only discovered this by debugging the getElementPosition before
 * and after wrapping the element in a Box with padding:
 *
 *  - before padding: { left: 0, top: 0, width: 10, height: 1 }
 *  - after padding: { left: 2, top: 0, width: 10, height: 1 }
 *
 * It's still a mystery why padding on a parent results in the child
 * having a different top value. `#todo`
 */
function walkParentPosition(node: DOMElement) {
  let parent = node.parentNode;
  let x = 0;
  let y = 0;

  while (parent) {
    if (!parent.yogaNode) {
      return { x, y };
    }

    const layout = parent.yogaNode.getComputedLayout();
    x += layout.left;
    y += layout.top;

    parent = parent.parentNode;
  }
  return { x, y };
}

export { useElementPosition, getElementPosition, getElementDimensions, useElementDimensions };
