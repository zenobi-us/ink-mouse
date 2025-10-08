
import React, { useMemo, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { Box, DOMElement, Text, render, useInput } from 'ink';
import {
    MouseProvider,
    useOnMouseHover,
    useMousePosition,
    useOnMouseClick,
    useMouse,
    Fullscreen,
} from '../ink-mouse';
import { useMap } from '@react-hookz/web';

function App() {
    return (
        <MouseProvider>
            <Fullscreen>
                <MyComponent />
            </Fullscreen>
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
        <Box gap={1} flexDirection='column' width={30} height={20} padding={5}>
            <Box>
                <Button label="Button 1" onClick={() => map.set('button1', (map.get('button1') || 0) + 1)} getProps={(state) => {
                    if (state === 'clicking') {
                        return { backgroundColor: 'blue', color: 'white' };
                    }

                    if (state === 'hovering') {
                        return { backgroundColor: 'yellow', };
                    }

                    return {};
                }} />
            </Box>
            <Box flexDirection="column" gap={1}>
                <Text>{JSON.stringify(mousePosition)}</Text>
                <Text>Button 1 clicked: {map.get('button1') || 0} times</Text>
            </Box>
        </Box>
    );
}

function Button(props: ComponentProps<typeof Box> & { label: string; onClick?: () => void, getProps?: (state: 'clicking' | 'hovering' | 'idle') => ComponentProps<typeof Box> }) {
    const ref = useRef<DOMElement | null>(null);

    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);

    useOnMouseClick(ref, (event) => {
        setClicking(event);
        if (event && typeof props.onClick === 'function') {
            props.onClick();
        }
    });
    useOnMouseHover(ref, setHovering);

    const state = useMemo((): 'clicking' | 'hovering' | 'idle' => {
        if (clicking) {
            return 'clicking';
        }

        if (hovering) {
            return 'hovering';
        }

        return 'idle';
    }, [clicking, hovering]);

    return (
        <Box
            gap={1}
            paddingX={1}
            ref={ref}
            {...props.getProps?.(state)}
        >
            <Text>{props.label}</Text>
        </Box>
    );
}

render(<App />, {
    stdin: process.stdin,
    stdout: process.stdout,
});
