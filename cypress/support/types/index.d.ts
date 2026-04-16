/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Descarta o banner de cookies/consentimento da Amazon, se presente.
     */
    dismissCookieBanner(): Chainable<void>;

    /**
     * Aguarda a página de resultados de busca estar pronta.
     */
    waitForSearchResults(): Chainable<void>;

    /**
     * Realiza uma busca a partir da página inicial.
     * @param term — termo a ser pesquisado
     */
    searchFor(term: string): Chainable<void>;

    /**
     * Ajusta a resolução da janela com base em um preset de viewports.json.
     * @example cy.setViewportPreset('mobile')
     */
    setViewportPreset(preset: "desktop" | "tablet" | "mobile"): Chainable<void>;
  }
}
