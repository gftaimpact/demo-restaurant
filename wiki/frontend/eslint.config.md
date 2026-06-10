# Documentação Técnica — Configuração ESLint

## Visão Geral

Este arquivo define a configuração do **ESLint** para um projeto JavaScript/React. Ele utiliza múltiplos plugins e presets recomendados para manter a qualidade, estilo e consistência do código, bem como garantir a integridade da utilização de *Hooks* do React e suporte ao *Hot Reloading* durante o desenvolvimento com Vite.

## Estrutura

A configuração é construída utilizando `defineConfig` proveniente do pacote `eslintconfig`.  
O arquivo exporta uma configuração padrão (`export default`) contendo as seguintes diretivas principais:

### Diretórios Ignorados

| Diretório | Descrição |
|------------|------------|
| `dist`     | Diretório de saída de build, geralmente gerado pelo Vite ou Webpack. |

A propriedade `globalIgnores` garante que arquivos compilados ou de distribuição não sejam analisados pelo ESLint.

### Escopo de Arquivos

| Padrão de Arquivos | Descrição |
|--------------------|------------|
| `*.js`, `*.jsx`    | A configuração aplica-se a arquivos JavaScript e React JSX. |

### Extensões (Extends)

A configuração herda regras de três conjuntos pré-definidos:

| Fonte | Pacote | Função |
|-------|---------|---------|
| `js.configs.recommended` | `eslintjs` | Fornece regras básicas e boas práticas para JavaScript. |
| `reactHooks.configs.flat.recommended` | `eslintpluginreacthooks` | Garante o uso correto de hooks em componentes React. |
| `reactRefresh.configs.vite` | `eslintpluginreactrefresh` | Integração com a ferramenta de refresh em tempo real do Vite. |

### Opções de Linguagem (Language Options)

| Propriedade | Valor | Descrição |
|--------------|--------|-----------|
| `globals` | `globals.browser` | Define variáveis globais padrão de ambiente de navegador (como `window`, `document`, etc.). |
| `parserOptions.ecmaFeatures.jsx` | `true` | Habilita o suporte a JSX no parser do ESLint. |

## Insights

- A configuração tem foco em ambientes **frontend** utilizando **React** e **Vite**.  
- O uso de `defineConfig` promove maior legibilidade e validação estática da configuração.  
- A ativação de `globals.browser` evita falsos positivos relativos a APIs globais do navegador.  
- A inclusão dos conjuntos recomendados de ESLint, React Hooks e React Refresh promove uma base sólida de padronização e segurança de código.

## Tipo de Estrutura

O conteúdo representa **apenas uma estrutura de configuração (dados declarativos)**, não contendo lógica executável ou processo de controle de fluxo. Portanto, **não há diagrama de fluxo de processo** aplicável.
