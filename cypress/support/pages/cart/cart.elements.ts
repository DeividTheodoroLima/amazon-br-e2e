/**
 * Seletores da página do carrinho da Amazon Brasil.
 * Baseados no HTML real do carrinho (stepper customizado, sem <select>).
 */
export const CartElements = {
  /** Container principal de cada produto no carrinho */
  cartItem: "[data-name='Active Items'] .sc-list-item",

  /** Nome do produto no carrinho */
  productTitle: "[data-name='Active Items'] .sc-item-product-title-cont",

  /** Preço unitário no carrinho */
  productPrice: "[data-name='Active Items'] .sc-product-price",

  /** Subtotal exibido no resumo */
  subtotalAmount: "#sc-subtotal-amount-activecart",

  /** Label do subtotal (ex: "Subtotal (2 produtos)") */
  subtotalLabel: "#sc-subtotal-label-activecart",

  /** Botão de incrementar quantidade (+) no stepper */
  increaseQtyButton: "[data-name='Active Items'] button[data-action='a-stepper-increment']",

  /** Botão de decrementar quantidade (-) no stepper */
  decreaseQtyButton: "[data-name='Active Items'] button[data-action='a-stepper-decrement']",

  /** Valor numérico atual exibido no stepper */
  qtyValue: "[data-name='Active Items'] [data-a-selector='inner-value']",

  /** Link "Excluir" para remoção do produto */
  deleteButton: "[data-name='Active Items'] input[data-action='delete-active']",

  /** Mensagem de confirmação após remoção */
  removalConfirmMessage: ".sc-deleted-msg",

  /** Mensagem de carrinho vazio */
  emptyCartMessage: "#sc-active-cart .sc-your-amazon-cart-is-empty",

  /** Contador do carrinho no header */
  cartCountHeader: "#nav-cart-count",

  /** Subtotal — seletor alternativo */
  subtotalAmountAlt: "#sc-subtotal-amount-buybox",
} as const;
