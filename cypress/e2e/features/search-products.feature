# language: pt

@search @e2e
Funcionalidade: Busca de Produtos e Gerenciamento do Carrinho — Amazon Brasil
  Como usuário da Amazon Brasil
  Quero buscar produtos, ordenar resultados e gerenciar meu carrinho
  Para garantir que os fluxos principais funcionem corretamente

  Contexto:
    Dado que estou na página inicial da Amazon Brasil

  @ct-001
  Cenário: Busca por produto com termo válido
    Quando eu buscar por "Smartphone Motorola"
    Então a página de resultados deve ser exibida
    E a URL deve conter o parâmetro de busca "Smartphone+Motorola"
    E deve haver pelo menos 1 resultado na listagem
    E o campo de busca deve exibir o termo "Smartphone Motorola"

  @ct-001 @autocomplete
  Cenário: Autocomplete exibe sugestões ao digitar o termo de busca
    Quando eu digitar "Smartphone Motorola" na barra de busca sem confirmar
    Então o autocomplete deve exibir sugestões relacionadas ao termo

  @ct-002
  Cenário: Ordenação dos resultados por preço do maior para o menor
    Dado que já realizei uma busca por "Smartphone Motorola"
    Quando eu selecionar a ordenação "Preço: Do maior para o menor"
    Então os resultados devem ser exibidos em ordem decrescente de preço
    E a URL deve conter o parâmetro de ordenação "price-desc-rank"
    E ao recarregar a página a ordenação deve ser mantida

  @ct-003
  Cenário: Adição de produto ao carrinho a partir da listagem
    Dado que já realizei uma busca por "Smartphone Motorola"
    E os resultados estão ordenados por "Preço: Do maior para o menor"
    Quando eu adicionar o primeiro produto disponível ao carrinho
    Então o contador do carrinho deve ser incrementado
    E o carrinho deve conter o produto adicionado

  @ct-004
  Cenário: Alteração de quantidade de produto no carrinho
    Dado que o carrinho possui um produto com quantidade 1
    Quando eu alterar a quantidade para 2
    Então o subtotal do carrinho deve ser recalculado corretamente

  @ct-005
  Cenário: Remoção de produto do carrinho
    Dado que o carrinho possui pelo menos um produto
    Quando eu remover o produto do carrinho
    Então o produto deve ser removido da listagem
    E o contador do carrinho deve ser zero
    E o subtotal do carrinho deve ser zero