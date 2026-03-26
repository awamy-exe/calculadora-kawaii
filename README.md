# Calculadora da Hello Kitty 🎀

Uma calculadora web responsiva com estética ultra kawaii, desenvolvida com HTML, CSS e JavaScript puro. Este projeto é focado em uma imersão visual fofa e divertida com cursores personalizados, animações e muito design! 

## 🌟 Características e Novidades do Design

- **Novo Visual e Temática**: Fundo texturizado super fofo e substituição dos ícones FontAwesome por stickers/assets desenhados no cabeçalho e na calculadora.
- **Rádio de K-Pop Embutida**: Um player de música (SoundCloud API) incorporado direto no canto da interface com botões HTML5 nativos que comandam a rádio via Javascript! 
- **Chuva de Emojis Flutuantes**: Animação em JavaScript inflando dezenas de emojis fofos (🎀, 🍓, ☁️, 🌸, 🍒 etc) pela tela flutuando rumo ao topo.
- **Cursor Tátil Customizado**: O ponteiro padrão do sistema foi removido e substituído por uma engine reescrita em JS que faz um lacinho perfeitamente dimensionado seguir seus cliques na tela (com correções de over-tracking para elementos isolados).
- **Layout Modo Celular (iPhone)**: O design da Calculadora agora tem as proporções exatas de um display retrátil de iPhone (400px), perfeitamente centralizado — mantendo as descrições extras reordenadas nas laterais (para Telas Grandes) ou abaixo da tela principal (Smartphones).
- **Funcionalidades Matemáticas (+ - * / %)**: A base clássica matemática com armazenamento de resultado anterior (ANS), tratamento contra duplo-operador e divisão flutuante tratada.

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3** (Custom Properties, Flexbox, Grid, pseudo-elementos, background-masking, keyframes para os balões)
- **JavaScript Vanilla** (Máquina de estados da calculadora, loop flutuante na chuva de ícones, cursor overlay DOM rendering)
- **SoundCloud API Widget SDK** (Ponte iframe assíncrona baseada em eventos para botões cross-origin).

## 🚀 Como Usar Localmente (Teste)

O projeto não requer rodar scripts de servidor, sendo apenas uma aplicação estática Front-End limpa!

1. Faça o clone esse repositório em sua máquina local:
```bash
git clone https://github.com/awamy-exe/Calculadora.git
```

2. Após baixar os arquivos, navegue até a pasta pelo seu gerenciador de arquivos e **abra o arquivo `index.html` duplo-clique** ou o solte na tela do seu navegador. 

A calculadora estará funcional, a arte começará a voar e você pode manipular a rádio do SoundCloud direto no botão Play customizado do canto da tela.

## 🎨 Personalização de Cores Adotadas

A paleta fundamental usa nuances pastéis fofas e harmoniosas:
- Fundo Rosa Algodão Doce (`#fce4ec`)
- Detalhes Rosa Pétala (`#f8bbd0`)
- Roxo Lavanda (`#ce93d8`)
- Textos em Marrom Rosado (`#5c4552`)

## 📝 Licença
Projeto Open Source para propósitos educacionais visuais. Veja o arquivo **LICENSE** da sub-pasta caso originado do Github. Sinta-se a vontade para ajudar ou melhorar nosso player e animações! 💞
