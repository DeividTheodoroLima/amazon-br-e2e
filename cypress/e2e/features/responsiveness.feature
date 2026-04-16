# language: pt
Funcionalidade: Responsividade da Amazon Brasil
  Como usuário que acessa a Amazon em diferentes dispositivos
  Quero que os elementos críticos permaneçam visíveis e clicáveis
  Para conseguir buscar produtos independente da resolução

  Contexto:
    Dado que estou na página inicial da Amazon Brasil

  @responsiveness @home @smoke
  Esquema do Cenário: Validar elementos críticos da home em diferentes viewports
    Quando eu configuro a resolução para "<preset>"
    Então o logo da Amazon deve estar visível
    E a barra de pesquisa deve estar visível e clicável
    E o ícone do carrinho deve estar visível

    Exemplos:
      | preset  |
      | desktop |
      | tablet  |
      | mobile  |

  @responsiveness @search
  Esquema do Cenário: Validar elementos críticos da listagem em diferentes viewports
    Quando eu configuro a resolução para "<preset>"
    E eu pesquiso pelo termo "Smartphone Motorola"
    Então a listagem de resultados deve ser exibida
    E o seletor de ordenação deve estar visível
    E cada card de produto deve conter título e bloco de preço visíveis

    Exemplos:
      | preset  |
      | desktop |
      | tablet  |
      | mobile  |
