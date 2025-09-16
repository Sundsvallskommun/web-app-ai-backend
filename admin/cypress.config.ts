import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? '3003'}${process.env.NEXT_PUBLIC_BASEPATH || ''}`,
    video: false,
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);

      return {
        ...config,
        e2e: {
          ...config.e2e,
          env: {
            // baseUrl: `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? '3003'}${process.env.NEXT_PUBLIC_BASEPATH || ''}`,

            apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
            // IMPORTANT
            // The value below is a test email
            mockEmail: 'mail@example.com',
            // The value below is a test phone number from Post- och telestyrelsen, it is not a real phone number
            mockPhoneNumber: '0701740635',
          },
        },
      };
    },
  },
});
