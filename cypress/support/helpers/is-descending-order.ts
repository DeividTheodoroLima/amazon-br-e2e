/**
 * Verifica se um array de preços está em ordem decrescente.
 */
export function isDescendingOrder(prices: number[]): boolean {
  return prices.every(
    (price, idx) => idx === 0 || prices[idx - 1] >= price
  );
}