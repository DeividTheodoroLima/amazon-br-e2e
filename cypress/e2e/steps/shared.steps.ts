import { Given, Before } from "@badeball/cypress-cucumber-preprocessor";
import { CartPage, HomePage } from "@pages";

const homePage = new HomePage();
const cartPage = new CartPage();

Before({ tags: "@ct-003 or @ct-004 or @ct-005" }, () => {
  cartPage.ensureEmpty();
});

Given("que estou na página inicial da Amazon Brasil", () => {
  homePage.visit();
  homePage.dismissCookieBanner();
  cy.get("#nav-logo, #navbar\\:header", { timeout: 15_000 }).should("be.visible");
});
