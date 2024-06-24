# ink-mouse

Provides mouse support for [Ink](http://github.com/vadimdemedes/ink) components.

## Features

- Mouse position tracking
- Mouse hover tracking
- Mouse click tracking
- Mouse drag tracking
- Element position tracking

[Todo](#todo)

## Usage

```tsx
import React, { useMemo, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { Box, DOMElement, Text, render } from 'ink';
import {
  MouseProvider,
  useOnMouseHover,
  useMousePosition,
  useElementPosition,
  useOnMouseClick,
} from '@zenobius/ink-mouse';

function App() {
  return (
    <MouseProvider>
      <MyComponent />
    </MouseProvider>
  );
}

function MyComponent() {
  const mouse = useMousePosition();

  return (
    <Box>
      <Button label="Button 1" />
      <Text>
        {mouse.x}, {mouse.y}
      </Text>
    </Box>
  );
}

function Button({ label, onClick }: { label: string; onClick?: () => void }) {
  const ref = useRef<DOMElement>(null);

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useOnMouseClick(ref, (event) => {
    setClicking(event);
    if (event && typeof onClick === 'function') {
      onClick();
    }
  });
  useOnMouseHover(ref, setHovering);

  const border = useMemo((): ComponentProps<typeof Box>['borderStyle'] => {
    if (clicking) {
      return 'double';
    }

    if (hovering) {
      return 'singleDouble';
    }

    return 'single';
  }, [clicking, hovering]);

  return (
    <Box
      gap={1}
      paddingX={1}
      ref={ref}
      borderStyle={border}
    >
      <Text>{label}</Text>
    </Box>
  );
}

render(<App />);
```

<!--- @@inject: dist/docs/modules.md#Functions --->

<!--- @@inject-end: dist/docs/modules.md#Functions --->

## Contributing

This project uses ASDF and Yarn.

1. clone repo
2. make branch: `git checkout [fix|feat|docs|chore]/blah-blah` (see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
3. run `./tools.sh`
4. run `just setup`
5. run `just demo`
6. run `just unittest`
7. run `just lint`

## Todo

- [ ] Add tests.
  - testing a device may be difficult; but the implementation is sufficiently abstracted from the device that it should be possible to mock the device input stream.
- [ ] Add Drag examples
  - Not sure if Ink supports z layers, but it would be nice to have a draggable element that can be dragged over other elements.
- [ ] Research Windows support
  - Apparently old CMD.exe only supports [rudimentary ansii escape codes for colours](https://ss64.com/nt/syntax-ansi.html).
  - New Windows Terminal does support ansi escape codes, so we'd have to explore what works and what doesn't.
  - We might have to fall back to GPM or some other library. Seems a bit complex. want to avoid it if possible.
- [ ] Add support for right and middle click.
  - I think these are supported by the terminal, but I'm not sure how to detect them. Is it lowercase M and R?
