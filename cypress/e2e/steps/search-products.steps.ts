import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { HomePage, CartPage } from "@pages";
import { parseBRLPrice } from "@helpers/index";
import searchData from "../../fixtures/search.json";

const homePage = new HomePage();
const cartPage = new CartPage();
const defaultSearchTerm = searchData.searchTerm;
const highToLowSort = searchData.sortOptions.highToLow;
const sortDescParam = searchData.urlParams.sortDescParam;

// ─── CT-001 ───────────────────────────────────────────────────────────────────

When("eu buscar por {string}", (term: string) => {
  homePage.searchFor(term);
});

Then("a página de resultados deve ser exibida", () => {
  cy.url().should("include", "/s?k=");

  homePage.waitForResults();
});

Then("a URL deve conter o parâmetro de busca {string}", (param: string) => {
  cy.url().should("include", param);
});

Then("deve haver pelo menos {int} resultado na listagem", (minCount: number) => {
  cy.get("[data-component-type='s-search-result']").should(
    "have.length.greaterThan",
    minCount - 1,
  );
});

Then("o campo de busca deve exibir o termo {string}", (term: string) => {
  cy.get("#twotabsearchtextbox").should("have.value", term);
});

// ─── CT-001 — Autocomplete ────────────────────────────────────────────────────

When("eu digitar {string} na barra de busca sem confirmar", (term: string) => {
  cy.get("#twotabsearchtextbox").should("be.visible").clear().type(term);
});

Then("o autocomplete deve exibir sugestões relacionadas ao termo", () => {
  cy.get(".autocomplete-results-container, [role='listbox'], #suggestions", { timeout: 8_000 }).should("be.visible");
});

// ─── CT-002 ───────────────────────────────────────────────────────────────────

Given("que já realizei uma busca por {string}", (term: string) => {
  homePage.searchFor(term).waitForResults();
});

Given("os resultados estão ordenados por {string}", (sortOption: string) => {
  homePage.sortBy(sortOption);
});

When("eu selecionar a ordenação {string}", (sortOption: string) => {
  homePage.sortBy(sortOption);
});

Then("os resultados devem ser exibidos em ordem decrescente de preço", () => {
  homePage.shouldShowDescendingPrices();
});

Then("a URL deve conter o parâmetro de ordenação {string}", (param: string) => {
  cy.url().should("include", param);
});

Then("ao recarregar a página a ordenação deve ser mantida", () => {
  cy.reload();

  homePage.waitForResults();

  cy.url().should("include", sortDescParam);

  cy.get("#s-result-sort-select")
    .should("have.value", sortDescParam);
});

// ─── CT-003 ───────────────────────────────────────────────────────────────────

When("eu adicionar o primeiro produto disponível ao carrinho", () => {
  homePage.getCartCount().as("initialCartCount");
  homePage.addFirstAvailableProductToCart().then((productTitle) => {
    cy.wrap(productTitle).as("addedProductTitle");
  });
});

Then("o contador do carrinho deve ser incrementado", () => {
  cy.get<number>("@initialCartCount").then((initialCount) => {
    cy.get("#nav-cart-count")
      .invoke("text")
      .then((text) => {
        const newCount = parseInt(text.trim(), 10) || 0;
        expect(newCount).to.be.greaterThan(initialCount);
      });
  });
});

Then("o carrinho deve conter o produto adicionado", () => {
  cy.visit("/cart");

  cartPage.shouldHaveItems();
  cy.get<string>("@addedProductTitle").then((productTitle) => {
    cartPage.shouldContainProduct(productTitle);
  });
});

// ─── CT-004 ───────────────────────────────────────────────────────────────────

Given("que o carrinho possui um produto com quantidade 1", () => {
  homePage.searchFor(defaultSearchTerm).sortBy(highToLowSort);
  homePage.addFirstAvailableProductToCart();
  cartPage.visit().shouldHaveItems();
  cartPage.getFirstProductQty().should("equal", 1);
});

When("eu alterar a quantidade para {int}", (newQty: number) => {
  const timesToClick = newQty - 1;

  for (let i = 0; i < timesToClick; i++) {
    cartPage.increaseFirstProductQty();
  }

  cartPage.getFirstProductQty().should("equal", newQty);
  cy.get("#sc-subtotal-amount-activecart", { timeout: 10_000 })
    .should("be.visible");
});

Then("o subtotal do carrinho deve ser recalculado corretamente", () => {
  // Obtém preço unitário via span acessível dentro de .sc-product-price
  cy.get("[data-name='Active Items'] .a-price")
    .first()
    .invoke("text")
    .then((priceText) => {
      const unitPrice = parseBRLPrice(priceText);

      // Obtém quantidade atual do stepper
      cy.get("[data-name='Active Items'] [data-a-selector='inner-value']")
        .first()
        .invoke("text")
        .then((qtyText) => {
          const qty = parseInt(qtyText.trim(), 10);
          const expectedSubtotal = unitPrice * qty;

          // Obtém subtotal exibido
          cy.get("#sc-subtotal-amount-activecart .sc-price")
            .invoke("text")
            .then((subtotalText) => {
              const displayedSubtotal = parseBRLPrice(subtotalText);
              expect(displayedSubtotal).to.be.closeTo(expectedSubtotal, 1.0);
            });
        });
    });
});

// ─── CT-005 ───────────────────────────────────────────────────────────────────

Given("que o carrinho possui pelo menos um produto", () => {
  homePage.searchFor(defaultSearchTerm).waitForResults();
  homePage.addFirstAvailableProductToCart();
  cartPage.visit().shouldHaveItems();
});

When("eu remover o produto do carrinho", () => {
  cartPage.deleteFirstProduct();
});

Then("o produto deve ser removido da listagem", () => {
  cy.get('.sc-list-item-removed-msg-delete')
    .contains("foi removido de Carrinho de compras.")
    .should("be.visible");
});

Then("o contador do carrinho deve ser zero", () => {
  cartPage.getHeaderCartCount().should("equal", 0);
});

Then('o subtotal do carrinho deve ser zero', () => {
  cartPage.shouldHaveSubtotal(0);
});
