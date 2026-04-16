/// <reference types="cypress" />

type ViewportPreset = "desktop" | "tablet" | "mobile";

/**
 * Ajusta o viewport com base em um preset de cypress/fixtures/viewports.json.
 */
Cypress.Commands.add("setViewportPreset", (preset: ViewportPreset) => {
  cy.fixture("viewports.json").then(
    (presets: Record<string, { width: number; height: number }>) => {
      const config = presets[preset];
      if (!config) {
        throw new Error(
          `Viewport preset "${preset}" não encontrado. Disponíveis: ${Object.keys(presets).join(", ")}`
        );
      }
      cy.viewport(config.width, config.height);
      cy.log(`Viewport: ${preset} (${config.width}x${config.height})`);
    }
  );
});

/**
 * Descarta banners de cookies/consentimento, se presentes.
 */
Cypress.Commands.add("dismissCookieBanner", () => {
  cy.get("body").then(($body) => {
    const acceptBtn = $body.find(
      "#sp-cc-accept, [data-action='sp-cc-accept'], button[data-cel-widget='sp-cc-accept']"
    );
    if (acceptBtn.length > 0) {
      cy.wrap(acceptBtn.first()).click({ force: true });
    }
  });
});

/**
 * Aguarda que os resultados de busca estejam visíveis no DOM.
 * Funciona após busca, após ordenação e após reload — sem intercept,
 * pois o endpoint de suggestions só dispara durante a digitação.
 */
Cypress.Commands.add("waitForSearchResults", () => {
  cy.get("[data-component-type='s-search-result']", {
    timeout: 20_000,
  }).should("have.length.greaterThan", 0);
});

/**
 * Realiza uma busca pela barra de pesquisa da Amazon.
 * O intercept de suggestions é registrado ANTES do type para garantir
 * que a requisição de autocomplete seja capturada corretamente.
 */
Cypress.Commands.add("searchFor", (term: string) => {
  cy.intercept("GET", "**/suggestions?**").as("suggestions");
  cy.get("#twotabsearchtextbox").should("be.visible").clear().type(term);
  cy.wait("@suggestions")
    .its("response.statusCode")
    .should("be.oneOf", [200, 304]);
  cy.get("#nav-search-submit-button").click();
  cy.waitForSearchResults();
});
