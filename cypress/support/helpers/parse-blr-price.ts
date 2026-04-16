/**
 * Extrai o valor numérico de uma string de preço BRL.
 * Ex: "R$ 9.499,00" → 9499.00
 */
export function parseBRLPrice(priceText: string): number {
  const cleaned = priceText
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  return Number.parseFloat(cleaned);
}
