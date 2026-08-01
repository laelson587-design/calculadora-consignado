# Calculadora de Antecipação — Consignado

Ferramenta de uso pessoal para responder, com o cliente na frente, quanto ele
paga ao antecipar parcelas ou quitar um contrato de empréstimo pessoal.

É um **único arquivo HTML** sem dependências: abre direto no navegador, funciona
offline e não precisa de servidor nem de instalação.

Publicada em <https://laelson587-design.github.io/calculadora-consignado/>. No
celular, "Adicionar à tela de início" a transforma em ícone — ela abre como
aplicativo e continua funcionando sem sinal.

## O que calcula

Entra pelo **valor solicitado** ou pelo **valor da parcela**, com taxa mensal,
prazo, dias até a 1ª parcela, IOF, TCC e quantas parcelas já foram pagas. A
partir disso:

- **Valor presente de cada parcela paga hoje** — o desconto dos juros que ainda
  não correram, conforme o art. 52 §2º do Código de Defesa do Consumidor
- **Saldo para quitação total** hoje, e a economia frente ao valor de face
- Tabela de amortização parcela a parcela, com juros, amortização e saldo
- **CET** ao mês e ao ano

## O modelo

Três detalhes decidem se a conta bate com o contrato ou não:

**A carência.** O primeiro período quase nunca tem 30 dias, e o juro corre nele.
A convenção é `t_k = dias/30 + (k−1)`: o primeiro trecho entra proporcional, e
das seguintes em diante soma-se um mês exato. Ignorar isso errava a parcela em
vários por cento — para menos numa carência longa, para mais numa curta.

**IOF e TCC somados por cima.** O cliente recebe o valor solicitado; os encargos
formam uma dívida maior, e é sobre ela que as parcelas são calculadas. O TCC é
valor fixo; o IOF é percentual do próprio financiado, que já inclui os dois:
`financiado = (solicitado + TCC) / (1 − IOF%)`.

**Os dois encargos se preenchem sozinhos**, que é o que permite simular antes de
o contrato existir. O IOF sai do prazo: a estrutura é a da lei — parte fixa mais
parte diária — mas o prazo que a instituição usa não é o da amortização, então
os dias efetivos vêm de uma reta ajustada aos contratos reais. Aplicar a regra
padrão sobre a tabela Price daria quase o dobro. O TCC sai do botão de cadastro,
não de uma conta: ele não depende do valor nem do prazo, e sim de ser ou não o
primeiro contrato do cliente (cláusula II.6). Os dois campos aceitam o valor do
demonstrativo por cima, nas linhas `d1)` e `d2)`.

A folga entre os dois é grande: em toda a faixa plausível o IOF move menos de
R$ 2 na parcela, e o TCC move R$ 30. Por isso o IOF pode ser estimado e a tarifa
não — na dúvida, cote como cliente novo, que erra para cima e a parcela real
chega menor do que a prometida.

**Liquidação não é antecipação de parcela.** Antecipar uma parcela avulsa é
valor presente puro pela taxa pactuada (cláusula VII.5). Já na quitação do
contrato, o IOF ainda diluído nas parcelas a vencer é cobrado inteiro, sem
desconto (cláusula VII.7) — por isso ele entra somado no valor de quitação.

## Validação

Conferida contra dois demonstrativos de CET reais, de perfis opostos:

| | Contrato A | Contrato B |
| --- | --- | --- |
| Solicitado | R$ 3.000,00 | R$ 1.004,90 |
| Prazo × parcela | 15 × R$ 633,49 | 9 × R$ 260,00 |
| Taxa | 18% a.m. | 18% a.m. |
| Carência | 40 dias | 25 dias |
| IOF | 1,714% | 1,32% |
| TCC | — | R$ 130,00 |

Informando IOF e TCC, o modelo reproduz **ao centavo** a parcela, o valor
financiado e o total a pagar. Simulando — sem nada do demonstrativo, só valor,
prazo, dias e o botão de cadastro — as parcelas saem a **um centavo** das reais:
R$ 260,01 e R$ 633,48.

O prazo vai até 18, que é o teto do produto. Fora dessa faixa a estimativa do
IOF não foi observada.

## Limites conhecidos

- O **CET sai de 0,05 a 0,1 ponto abaixo do oficial**. A fórmula do Banco
  Central tem convenções próprias de contagem de dias. Serve como conferência,
  não como número de contrato.
- Isto é a matemática do contrato, não o sistema oficial da operação. Regras
  próprias da instituição — se aceita antecipar parcela avulsa ou só quitação
  total — não estão contempladas.

- A regra da tarifa — cobrada no cadastro novo — está **apoiada em dois
  contratos**, um com e outro sem. Explica os dois e é o que a cláusula II.6
  descreve, mas ainda não foi confirmada em um terceiro.

Se os números divergirem do sistema, as suspeitas nessa ordem: **tarifa** (é o
único encargo que move mais de R$ 1 na parcela), dias até a 1ª parcela,
percentual de IOF.

## Publicando uma alteração

`git push` — o GitHub Pages publica em cerca de um minuto. Ao mexer em qualquer
arquivo, **suba a constante `VERSAO` no `sw.js`**; sem isso o cache antigo
persiste nos aparelhos que já abriram a página.
