import { SearchElements as El } from "./search.elements";

export class SearchPage {
  resultsInfoBar(): Cypress.Chainable<JQuery> {
    return cy.get(El.resultsInfoBar);
  }

  resultItems(): Cypress.Chainable<JQuery> {
    return cy.get(El.resultItem);
  }

  itemTitle(): Cypress.Chainable<JQuery> {
    return cy.get(El.itemTitle).first();
  }

  /**
   * Retorna o elemento de preço se presente, senão o aviso de indisponibilidade.
   * Seletor defensivo para não falhar em cards patrocinados sem preço.
   */
  itemPriceOrUnavailable(): Cypress.Chainable<JQuery> {
    return cy.get(`${El.itemPrice}, ${El.itemUnavailable}`).first();
  }

  sortDropdown(): Cypress.Chainable<JQuery> {
    return cy.get(El.sortDropdown).first();
  }
}
