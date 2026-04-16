/**
 * Seletores da página inicial da Amazon Brasil.
 */
export const HomeElements = {
  searchInput: "#twotabsearchtextbox",
  searchButton: "#nav-search-submit-button",
  cartCount: "#nav-cart-count",
  logo: "#nav-logo",
  cartIcon: "#nav-cart",
  hamburgerMenu: "#nav-hamburger-menu",
  autocompleteList: ".autocomplete-results-container",
  autocompleteItems: ".autocomplete-results-container .s-suggestion",
  cookieAcceptButton: "#sp-cc-accept",
  searchResults: "[data-component-type='s-search-result']",
  sortSelect: "#s-result-sort-select",
  sortSelectFallback: "[data-action='s-sort-select']",
  resultTitleLinks: "h2 a.a-link-normal",
  addToCartButtons: '[name="submit.addToCart"]',
} as const;
