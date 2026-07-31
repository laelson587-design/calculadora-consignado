# Calculadora de Antecipação — Consignado

Ferramenta de uso pessoal para responder, com o cliente na frente, quanto ele
paga ao antecipar parcelas de um contrato de consignado.

É um **único arquivo HTML** sem dependências: abre direto no navegador, funciona
offline e não precisa de servidor nem de instalação.

## Como usar

Abra o `index.html` no navegador. No celular, use "Adicionar à tela de início"
para ele virar um ícone e abrir como aplicativo.

Versão publicada (privada):
https://claude.ai/code/artifact/8597a69b-584e-4cfc-8763-325e9f04ca52

## O que calcula

Entra pelo **valor da parcela** (ou pelo valor emprestado), com taxa mensal,
prazo e quantas parcelas já foram pagas. A partir disso:

- **Valor presente de cada parcela paga hoje** — o desconto dos juros que ainda
  não correram, conforme o art. 52 §2º do Código de Defesa do Consumidor
- **Saldo para quitação total** hoje, e a economia frente ao valor de face
- Tabela de amortização **Price** ou **SAC**, parcela a parcela
- **IOF**, tarifas e **CET** ao mês e ao ano

## Limites conhecidos

Isto é a matemática do contrato, não o sistema oficial da operação. Antes de
usar com cliente, confira contra um contrato real — e saiba que:

- As **alíquotas de IOF são campos editáveis** de propósito: mudam por decreto e
  os valores preenchidos (0,0082% a.d. e 0,38% adicional) precisam ser
  confirmados com a área de produtos.
- O cálculo assume **parcelas mensais de 30 dias** e não modela carência.
- Regras próprias da instituição — se aceita antecipar parcela avulsa ou só
  quitação total — não estão contempladas.

Se os números divergirem do sistema, as suspeitas nessa ordem: carência,
contagem de dias corridos em vez de 30, encargo não modelado.
