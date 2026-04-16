/**
 * Seletores da página de listagem/resultados da Amazon Brasil.
 */
export const SearchElements = {
  resultsInfoBar: "[data-component-type='s-result-info-bar']",
  resultItem: "[data-component-type='s-search-result']",
  itemTitle: "h2 span, h2 a span",
  itemPrice: ".a-price .a-offscreen",
  itemUnavailable: ".a-color-price, .a-color-secondary",
  sortDropdown: "#s-result-sort-select, [data-action='s-sort-select']",
} as const;
