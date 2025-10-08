import { useStdout } from "ink";
import { useEffect, useState } from "react";

function useTerminalSize() {
    const out = useStdout();
    const [size, setSize] = useState(() => {
        return {
            width: out.stdout.columns,
            height: out.stdout.rows,
        };
    });

    useEffect(() => {
        const handleTerminalResize = () => {
            setSize(() => ({
                width: out.stdout.columns,
                height: out.stdout.rows,
            }));
        };

        process.stdout.on('resize', handleTerminalResize);
        process.stdout.on('SIGWINCH', handleTerminalResize);
        return () => {
            process.stdout.off('SIGWINCH', handleTerminalResize);
            process.stdout.off('resize', handleTerminalResize);
        };
    }, []);

    return size;
}

export { useTerminalSize };