import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouter } from '@react-router/dev/vite';
import { sentryReactRouter, type SentryReactRouterBuildOptions } from '@sentry/react-router';
import { defineConfig } from 'vite';
const sentryConfig: SentryReactRouterBuildOptions = {
  org: "jade-pam",
  project: "node-express",
  // An auth token is required for uploading source maps.
  authToken: "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"
  // ...
};

export default defineConfig(config => {
  return {
  plugins: [reactRouter(),sentryReactRouter(sentryConfig, config), tailwindcss(), tsconfigPaths()],
  sentryConfig, // Also pass the config here!
  ssr: {
    noExternal: [/@syncfusion/]
  }
  };
});