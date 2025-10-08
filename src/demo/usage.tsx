
import React, { useMemo, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { Box, DOMElement, Text, render, useInput } from 'ink';
import {
    MouseProvider,
    useOnMouseHover,
    useMousePosition,
    useOnMouseClick,
    useMouse,
} from '../ink-mouse';
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
        <Box gap={1} flexDirection='column' width="100%">
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