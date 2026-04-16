import { HomeElements as El } from "./home.elements";
import { isDescendingOrder, parseBRLPrice } from "../../helpers";

export class HomePage {
  /** Navega para a página inicial */
  visit(): this {
    cy.visit("/");
    return this;
  }

  /** Aceita o banner de cookies, se presente */
  dismissCookieBanner(): this {
    cy.dismissCookieBanner();
    return this;
  }

  /** Digita um termo na barra de busca */
  typeSearchTerm(term: string): this {
    cy.get(El.searchInput).should("be.visible").clear().type(term);
    return this;
  }

  /** Confirma a busca pressionando Enter ou clicando no botão */
  submitSearch(): this {
    cy.get(El.searchButton).click();
    return this;
  }

  /** Executa busca completa: digita + submete */
  searchFor(term: string): this {
    cy.searchFor(term);
    return this;
  }

  /** Verifica que o autocomplete exibe sugestões */
  shouldShowAutocompleteSuggestions(): this {
    cy.get(El.autocompleteList).should("be.visible");
    return this;
  }

  /** Retorna o contador de itens no carrinho */
  getCartCount(): Cypress.Chainable<number> {
    return cy
      .get(El.cartCount)
      .invoke("text")
      .then((text) => parseInt(text.trim(), 10) || 0);
  }

  /** Aguarda os resultados de busca carregarem */
  waitForResults(): this {
    cy.waitForSearchResults();
    return this;
  }

  /** Ordena a listagem por uma opção disponível no dropdown */
  sortBy(option: string): this {
    cy.get(`${El.sortSelect}, ${El.sortSelectFallback}`)
      .first()
      .select(option, { force: true });

    this.waitForResults();
    return this;
  }

  /** Retorna os preços válidos visíveis na listagem */
  getVisibleResultPrices(): Cypress.Chainable<number[]> {
    return cy.get(El.searchResults).then(($results) => {
      const prices: number[] = [];

      $results.each((_, card) => {
        const priceText = Cypress.$(card)
          .find(".a-price:not(.a-text-price)")
          .first()
          .text()
          .trim();

        if (!priceText) {
          return;
        }

        const price = parseBRLPrice(priceText);

        if (!Number.isNaN(price) && price > 0) {
          prices.push(price);
        }
      });

      return prices;
    });
  }

  /** Valida que os preços visíveis estão em ordem decrescente */
  shouldShowDescendingPrices(): this {
    this.getVisibleResultPrices().then((prices) => {
      expect(prices.length).to.be.greaterThan(1);
      expect(isDescendingOrder(prices)).to.be.true;
    });

    return this;
  }

  // ── Elementos expostos para steps de responsividade ──────────────────────

  /** Retorna o elemento de logo da Amazon */
  logo(): Cypress.Chainable<JQuery> {
    return cy.get(El.logo);
  }

  /** Retorna o input da barra de pesquisa */
  searchInput(): Cypress.Chainable<JQuery> {
    return cy.get(El.searchInput);
  }

  /** Retorna o ícone/botão do carrinho na navbar */
  cartIcon(): Cypress.Chainable<JQuery> {
    return cy.get(El.cartIcon);
  }

  /** Retorna o botão hamburger (menu lateral, visível em mobile) */
  hamburgerMenu(): Cypress.Chainable<JQuery> {
    return cy.get(El.hamburgerMenu);
  }

  /** Alias de searchFor — digitação + submissão da busca */
  search(term: string): this {
    return this.searchFor(term);
  }

  // ─────────────────────────────────────────────────────────────────────────

  /** Adiciona o primeiro produto disponível ao carrinho e retorna seu título */
  addFirstAvailableProductToCart(): Cypress.Chainable<string> {
    return cy
      .get(El.searchResults)
      .filter((_, result) =>
        Cypress.$(result).find(El.addToCartButtons).length > 0,
      )
      .first()
      .then(($result) => {
        const title = $result.find(El.resultTitleLinks).first().text().trim();

        cy.wrap($result).find(El.addToCartButtons).first().click({ force: true });
        cy.get(El.cartCount, { timeout: 15_000 }).should(($cartCount) => {
          const value = Number.parseInt($cartCount.text().trim(), 10) || 0;
          expect(value).to.be.greaterThan(0);
        });

        return title;
      });
  }
}
