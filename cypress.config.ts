import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { allureCypress } from "allure-cypress/reporter";
import cypressOnFix from "cypress-on-fix";
import * as os from "node:os";
import { resolveEnvironmentConfig } from "./config";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
  const selectedEnvironment = String(config.env.env ?? "prod");
  const environment = resolveEnvironmentConfig(selectedEnvironment);

  on = cypressOnFix(on);
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  allureCypress(on, config, {
    resultsDir: "allure-results",
    environmentInfo: {
      test_environment: environment.name,
      base_url: environment.baseUrl,
      os_platform: os.platform(),
      os_version: os.version(),
      node_version: process.version,
    },
  });

  config.baseUrl = environment.baseUrl;
  config.env.activeEnvironment = environment.name;
  config.env.baseUrl = environment.baseUrl;

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  e2e: {
    specPattern: "**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    fixturesFolder: "cypress/fixtures",
    pageLoadTimeout: 120_000,
    defaultCommandTimeout: 8_000,
    viewportHeight: 900,
    viewportWidth: 1440,
    includeShadowDom: true,
    chromeWebSecurity: false,
    numTestsKeptInMemory: 0,
    experimentalMemoryManagement: true,
    watchForFileChanges: false,
    testIsolation: false,
    setupNodeEvents,
  },
});
