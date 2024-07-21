import { defineConfig } from '@playwright/test';

export default defineConfig({
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
    },
    // Other Playwright configurations
    testDir: './e2e',
    timeout: 60000,
    retries: 0,
    use: {
        headless: true,
        baseURL: 'http://localhost:5173'
    },
});
