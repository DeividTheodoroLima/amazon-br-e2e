import { CartElements as El } from "./cart.elements";
import { parseBRLPrice } from "../../helpers";

export class CartPage {
  private clearActiveItems(): Cypress.Chainable<null> {
    return cy.get("body").then(($body): Cypress.Chainable<null> => {
      const deleteButtons = $body.find(El.deleteButton);

      if (deleteButtons.length === 0) {
        return cy.wrap(null, { log: false });
      }

      return cy
        .wrap(deleteButtons[0])
        .click({ force: true })
        .then(() => {
          cy.get(El.cartCountHeader, { timeout: 15_000 }).should("be.visible");
        })
        .then(() => this.clearActiveItems());
    });
  }

  /** Navega diretamente para o carrinho */
  visit(): this {
    cy.visit("/cart");
    return this;
  }

  /** Garante que o carrinho inicia vazio para reduzir dependência entre cenários */
  ensureEmpty(): this {
    this.visit();
    this.clearActiveItems();
    cy.get(El.cartCountHeader, { timeout: 15_000 }).should("have.text", "0");
    return this;
  }

  /** Verifica que o carrinho contém ao menos um produto */
  shouldHaveItems(): this {
    cy.get(El.cartItem).should("have.length.greaterThan", 0);
    return this;
  }

  /** Verifica que o carrinho está vazio */
  shouldBeEmpty(): this {
    cy.get(El.cartCountHeader).should("contain.text", "0");
    return this;
  }

  /** Verifica que um produto específico está no carrinho pelo nome */
  shouldContainProduct(partialName: string): this {
    cy.get(El.productTitle).should("contain.text", partialName);
    return this;
  }

  /** Retorna o subtotal atual como número (0 quando o carrinho está vazio) */
  getSubtotal(): Cypress.Chainable<number> {
    return cy.get("body").then(($body) => {
      if ($body.find(El.subtotalAmount).length > 0) {
        return cy
          .get(El.subtotalAmount)
          .invoke("text")
          .then((text) => parseBRLPrice(text));
      }

      if ($body.find(El.subtotalAmountAlt).length > 0) {
        return cy
          .get(El.subtotalAmountAlt)
          .invoke("text")
          .then((text) => parseBRLPrice(text));
      }
      return cy.wrap(0);
    });
  }

  /** Verifica que o subtotal corresponde ao esperado */
  shouldHaveSubtotal(expectedValue: number): this {
    this.getSubtotal().then((subtotal) => {
      expect(subtotal).to.be.closeTo(expectedValue, 0.5);
    });
    return this;
  }

  /** Clica no botão "Excluir" do primeiro produto */
  deleteFirstProduct(): this {
    cy.get(El.deleteButton).first().click({ force: true });
    return this;
  }

  /** Verifica que a mensagem de confirmação de remoção está visível */
  shouldShowRemovalConfirmation(): this {
    cy.get(El.removalConfirmMessage, { timeout: 10_000 }).should(
      "be.visible"
    );
    return this;
  }

  /** Retorna a quantidade de produtos no contador do header */
  getHeaderCartCount(): Cypress.Chainable<number> {
    return cy
      .get(El.cartCountHeader)
      .invoke("text")
      .then((text) => parseInt(text.trim(), 10) || 0);
  }

  /** Incrementa a quantidade do primeiro produto em 1 via stepper */
  increaseFirstProductQty(): this {
    cy.get(El.increaseQtyButton).first().click();
    return this;
  }

  /** Retorna a quantidade atual do primeiro item no carrinho */
  getFirstProductQty(): Cypress.Chainable<number> {
    return cy
      .get(El.qtyValue)
      .first()
      .invoke("text")
      .then((text) => Number.parseInt(text.trim(), 10) || 0);
  }
}
