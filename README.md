# ink-mouse

Provides mouse support for [Ink](http://github.com/vadimdemedes/ink) components.

https://github.com/zenobi-us/ink-mouse/assets/61225/658ad469-6438-4bff-8695-e2fe9325f816

## Features

- Mouse position tracking
- Mouse hover tracking
- Mouse click tracking
- Mouse drag tracking
- Element position tracking

[Todo](#todo)

## Usage

> [!NOTE]
> Without `useInput`, escape sequence characters will being printed to the terminal during mouse movements.

```tsx
import React, { useMemo, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { Box, DOMElement, Text, render, useInput } from 'ink';
import {
  MouseProvider,
  useOnMouseHover,
  useMousePosition,
  useOnMouseClick,
  useMouse,
} from '@zenobius/ink-mouse';
import { useMap } from '@react-hookz/web';

function App() {
  return (
    <MouseProvider>
      <MyComponent />
    </MouseProvider>
  );
}

function MyComponent() {
  const mouse = useMouse();
  const mousePosition = useMousePosition();
  const map = useMap<'button1', number>() // Example of a simple state map

  /**
   * Without this, your terminal will fill up with escape codes when you move the mouse.
   */
  useInput((input, key) => {
      if (key.return) {
          mouse.toggle()
      }
  });

  return (
    <Box gap={1} flexDirection='column' width={40} height={10} borderStyle="round" padding={1}>
      <Box gap={1}>
        <Button label="Button 1" onClick={() => map.set('button1', (map.get('button1') || 0) + 1)} />
      </Box>
      <Box flexDirection="column" gap={1}>
        <Text>{JSON.stringify(mousePosition)}</Text>
        <Text>Button 1 clicked: {map.get('button1') || 0} times</Text>
      </Box>
    </Box>
  );
}

function Button({ label, onClick }: { label: string; onClick?: () => void }) {
  const ref = useRef<DOMElement | null>(null);

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

This project uses [Mise](https://mise.jdx.dev/) and Yarn.

1. Clone the repository
2. Create a branch: `git checkout -b [fix|feat|docs|chore]/your-change` (see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))
3. Run `mise setup` to bootstrap the project (tooling, deps, etc)
4. Run `mise dev` to run the demo in watch mode
5. Make your changes
6. Run `mise lint` to check your code
7. Run `mise unittest` to check your code

All project tasks are managed via Mise in `.mise/tasks/`, you can list them via `mise tasks`.

> [!Note]
> This project does not use `package.json` scripts. All tasks are defined in `.mise/tasks/` to maintain consistency and prevent configuration drift.

## Todo

- [ ] Support absolute elements
  - Elements positioned absolutely that occupy same space as other elements will mean they both recieve click and hover events.
  - Ink supports absolute positioning. I think z order is based on order rendered.
  - This means to simluate knowing the z order, we might need to register the order in which elements subscribe to events?
- [ ] Support elements not rendered from 0,0
  - Currently the mouse position is tracked from the top left of the terminal (0,0).
  - If an element is rendered starting at (10,10) for example, the mouse position will not be accurate.
  - We need to track the offset of the element and adjust the mouse position accordingly.
- [ ] Add tests.
  - testing a device may be difficult; but the implementation is sufficiently abstracted from the device that it should be possible to mock the device input stream.
    - [x] stdin event stream parsing
    - [ ] position tracking
    - [ ] click tracking
    - [ ] drag tracking
    - [ ] z order priority
- [ ] Add Drag examples
- [ ] Research Windows support
  - Apparently old CMD.exe only supports [rudimentary ansii escape codes for colours](https://ss64.com/nt/syntax-ansi.html).
  - New Windows Terminal does support ansi escape codes, so we'd have to explore what works and what doesn't.
  - We might have to fall back to GPM or some other library. Seems a bit complex. want to avoid it if possible.
- [ ] Add support for right and middle click.
  - I think these are supported by the terminal, but I'm not sure how to detect them. Is it lowercase M and R?
