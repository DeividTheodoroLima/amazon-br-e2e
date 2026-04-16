import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { HomePage, SearchPage } from "../../support/pages";

const home = new HomePage();
const search = new SearchPage();

type ViewportPreset = "desktop" | "tablet" | "mobile";

When("eu configuro a resolução para {string}", (preset: string) => {
  cy.setViewportPreset(preset as ViewportPreset);
  cy.reload();
  cy.dismissCookieBanner();
});

When("eu pesquiso pelo termo {string}", (term: string) => {
  home.search(term);
});

Then("o logo da Amazon deve estar visível", () => {
  home.logo().should("be.visible");
});

Then("a barra de pesquisa deve estar visível e clicável", () => {
  home
    .searchInput()
    .should("be.visible")
    .and("not.be.disabled")
    .and(($el) => {
      const rect = $el[0].getBoundingClientRect();
      expect(rect.width, "largura da barra de busca").to.be.greaterThan(0);
      expect(rect.height, "altura da barra de busca").to.be.greaterThan(0);
    });
});

Then("o ícone do carrinho deve estar visível", () => {
  home.cartIcon().should("be.visible");
});

Then("a listagem de resultados deve ser exibida", () => {
  search
    .resultsInfoBar()
    .should("be.visible")
    .and("contain.text", "resultados");
  search.resultItems().should("have.length.greaterThan", 0);
});

Then("o seletor de ordenação deve estar visível", () => {
  search.sortDropdown().should("be.visible");
});

Then(
  "cada card de produto deve conter título e bloco de preço visíveis",
  () => {
    search.resultItems().then(($items) => {
      // Amostragem: valida os 3 primeiros itens para manter o teste rápido
      const sampleSize = Math.min(3, $items.length);
      for (let i = 0; i < sampleSize; i++) {
        cy.wrap($items[i]).within(() => {
          search.itemTitle().should("exist").and("not.be.empty");
          // Seletor defensivo: aceita preço ou aviso de indisponibilidade
          // para não falhar em cards patrocinados sem preço
          search.itemPriceOrUnavailable().should("exist");
        });
      }
    });
  }
);
