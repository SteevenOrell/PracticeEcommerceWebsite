import { defineConfig } from "vitest/config";

// Separate config for Firestore rules tests: Node environment, emulator required.
export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/**/*.test.js"],
        testTimeout: 20000,
        hookTimeout: 30000,
        fileParallelism: false,
    },
});
