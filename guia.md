# 📘 Guia Completo: Construindo uma API de Estacionamento com NestJS + Prisma 7 + MariaDB

**Do zero absoluto ao CRUD completo funcionando**

---

## 📖 Sobre este guia

Este é um tutorial **exaustivo** que assume **zero conhecimento prévio** de NestJS, Prisma 7 ou desenvolvimento backend. Vou explicar cada comando, cada arquivo, cada linha de código e **por que** cada coisa existe.

Ao final, você terá uma API REST funcional de gerenciamento de estacionamento, com:

- Cadastro de clientes, veículos, vagas e bilhetes
- Check-in/check-out automático com cálculo de tarifa
- Validações de integridade
- Banco de dados MariaDB rodando no XAMPP

**Tempo estimado:** 2 a 4 horas para quem está começando do zero.

**Pré-requisitos:** computador com Windows, Linux ou Mac e vontade de aprender.

---

## 📚 Sumário

1. [Entendendo o que vamos construir](#parte-1)
2. [Fundamentos: o que é cada tecnologia](#parte-2)
3. [Instalando as ferramentas base](#parte-3)
4. [Configurando o XAMPP e o banco de dados](#parte-4)
5. [Criando o projeto NestJS](#parte-5)
6. [Instalando e configurando o Prisma 7](#parte-6)
7. [Entendendo as mudanças do Prisma 7](#parte-7)
8. [Conectando o NestJS ao banco](#parte-8)
9. [Criando o CRUD de Cliente](#parte-9)
10. [Criando o CRUD de Veículo](#parte-10)
11. [Criando o CRUD de Vaga](#parte-11)
12. [Criando o CRUD de Bilhete com lógica de negócio](#parte-12)
13. [Testando com Insomnia](#parte-13)
14. [Compilando e rodando em produção](#parte-14)
15. [Solução de problemas comuns](#parte-15)
16. [Próximos passos](#parte-16)

---

<a id="parte-1"></a>
## 1. Entendendo o que vamos construir

### O cenário

Um estacionamento precisa de um sistema para controlar:

- **Quem** são os clientes (nome, CPF, telefone, endereço)
- **Quais** veículos cada cliente possui (placa, marca, cor)
- **Onde** os veículos estacionam (número da vaga, tipo: PCD ou comum)
- **Quando** entram e saem, e **quanto** pagam

### O sistema em funcionamento

Imagine o dia a dia de um estacionamento:

1. **Chegada**: cliente chega com o carro. O operador cadastra o cliente (se for novo) e o veículo. Depois faz o **check-in** — escolhe uma vaga livre e o sistema cria um "bilhete" (registro do estacionamento).

2. **Permanência**: enquanto o carro está lá, o bilhete fica com status **"Ocupado"**. Se outro cliente tentar usar a mesma vaga, o sistema bloqueia.

3. **Saída**: quando o cliente vai embora, o operador faz o **check-out**. O sistema calcula o valor baseado no tempo (R$ 8 por hora) e marca o bilhete como **"Finalizado"**. A vaga fica livre.

4. **Histórico**: todos os bilhetes finalizados ficam salvos para consulta e faturamento.

### A estrutura técnica

```
┌─────────────────────────────────────────────────────────┐
│  Insomnia (testes)                                       │
│  ──▶ HTTP requests                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  API REST (NestJS)                                       │
│  ──▶ Controllers → Services → PrismaService             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Prisma 7 (ORM)                                          │
│  ──▶ Traduz TypeScript em SQL                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  MariaDB (XAMPP)                                         │
│  ──▶ Armazena os dados                                   │
└─────────────────────────────────────────────────────────┘
```

---

<a id="parte-2"></a>
## 2. Fundamentos: o que é cada tecnologia

Antes de escrever qualquer código, entenda o papel de cada peça.

### 🟢 Node.js

**O que é:** um ambiente que permite executar JavaScript **fora do navegador** (no servidor).

**Por que usar:** JavaScript foi criado originalmente para rodar no browser. O Node.js pegou o motor V8 (do Chrome) e o adaptou para rodar no computador, permitindo criar backends, scripts e CLIs.

**Analogia:** se JavaScript é uma linguagem, Node.js é o "motor" que faz ela funcionar fora do Chrome.

### 🔵 TypeScript

**O que é:** uma extensão do JavaScript que adiciona **tipagem estática**.

**Por que usar:** em JavaScript, você pode escrever `let x = 10; x = "texto";` e não dá erro. Em TypeScript, o compilador avisa: "x deveria ser número, não string". Isso evita muitos bugs.

**Como funciona:** você escreve `.ts`, o compilador transforma em `.js` antes de rodar.

```typescript
// TypeScript
function soma(a: number, b: number): number {
  return a + b;
}

// vira JavaScript (o Node não entende os tipos)
function soma(a, b) {
  return a + b;
}
```

### 🟣 NestJS

**O que é:** um framework para construir backends com Node.js.

**Por que usar:** o Node puro é muito "solto" — você organiza como quiser. O NestJS impõe uma **arquitetura** baseada em módulos, controllers e services (inspirada no Angular). Isso torna projetos grandes **organizados e testáveis**.

**Conceitos-chave:**

- **Module**: agrupa código relacionado (ex: `ClienteModule`)
- **Controller**: recebe requisições HTTP e retorna respostas
- **Service**: contém a lógica de negócio (o que realmente acontece)
- **DTO**: define o formato dos dados que entram e saem da API

### 🟠 Prisma

**O que é:** um ORM (Object-Relational Mapper) — uma ferramenta que traduz código TypeScript em SQL.

**Por que usar:** sem ORM, você escreveria SQL direto no código:

```typescript
const result = await connection.query('SELECT * FROM cliente WHERE id = ?', [id]);
```

Com Prisma, você escreve:

```typescript
const cliente = await prisma.cliente.findUnique({ where: { id_cliente: id } });
```

Fica mais seguro, tipado e legível.

### 🟡 MariaDB

**O que é:** um banco de dados relacional, fork do MySQL (criado pelo próprio fundador do MySQL).

**Por que usar:** é gratuito, confiável, compatível com MySQL e vem junto com o XAMPP. Perfeito para aprender.

### 🔴 XAMPP

**O que é:** um pacote que instala automaticamente Apache + MySQL/MariaDB + PHP + Perl.

**Por que usar:** normalmente instalar um banco exige configuração. O XAMPP dá tudo pronto com 2 cliques.

### ⚫ Insomnia

**O que é:** um cliente HTTP com interface gráfica.

**Por que usar:** para testar sua API. Você não quer abrir o navegador ou escrever comandos `curl` para cada teste.

---

<a id="parte-3"></a>
## 3. Instalando as ferramentas base

### 3.1. Instalar o Node.js

1. Acesse [https://nodejs.org](https://nodejs.org)
2. Baixe a versão **LTS** (Long Term Support) — recomendada para produção
3. **Atenção:** o Prisma 7 exige **Node.js 20.19.0 ou superior**. Ideal: versão 22.x
4. Execute o instalador e siga o padrão (Next → Next → Install)

**Verificar a instalação:**

Abra o terminal (Prompt de Comando no Windows, ou Terminal no Linux/Mac):

```bash
node --version
npm --version
```

Você deve ver algo como:

```
v22.11.0
10.9.0
```

Se aparecer "command not found", feche o terminal e abra novamente (o PATH só é atualizado em novos terminais).

### 3.2. Instalar o Git (opcional, mas recomendado)

O Git ajuda a versionar o código. Baixe em [https://git-scm.com](https://git-scm.com).

Para verificar:

```bash
git --version
```

### 3.3. Instalar o Insomnia

Baixe em [https://insomnia.rest/download](https://insomnia.rest/download).

### 3.4. Instalar o XAMPP

Baixe em [https://www.apachefriends.org](https://www.apachefriends.org).

**Instalação no Windows:**

1. Baixe o instalador (versão com PHP 8.2)
2. Instale em `C:\xampp` (padrão)
3. **Importante:** durante a instalação, desmarque a opção de instalar como serviço — assim você controla manualmente quando ligar/desligar

**Instalação no Linux:**

```bash
chmod +x xampp-linux-x64-*.run
sudo ./xampp-linux-x64-*.run
```

**Instalação no Mac:**

Baixe o `.dmg` e arraste para Aplicativos.

### 3.5. Instalar o NestJS CLI globalmente

O NestJS tem uma ferramenta de linha de comando que facilita criar projetos:

```bash
npm install -g @nestjs/cli
```

O `-g` significa "global" — instala em um local do sistema, disponível em qualquer pasta.

Verifique:

```bash
nest --version
```

---

<a id="parte-4"></a>
## 4. Configurando o XAMPP e o banco de dados

### 4.1. Iniciar o XAMPP

**Windows:** abra o "XAMPP Control Panel" no menu Iniciar.

**Linux:**

```bash
sudo /opt/lampp/lampp start
```

**Mac:** abra o "XAMPP" nos Aplicativos.

Você verá uma janela com vários módulos. Clique em **Start** nos seguintes:

- **Apache** (opcional, mas útil para acessar o phpMyAdmin)
- **MySQL** (obrigatório — é o nosso banco)

Quando estiver verde, está rodando:

```
Apache  [Running]  Port(s): 80, 443
MySQL   [Running]  Port(s): 3306
```

### 4.2. Acessar o phpMyAdmin

Com o Apache e MySQL ligados, abra no navegador:

```
http://localhost/phpmyadmin
```

Você verá a interface do phpMyAdmin — uma ferramenta web para gerenciar bancos MySQL/MariaDB.

### 4.3. Criar o banco de dados `estacionamento`

**Opção A — Pela interface do phpMyAdmin:**

1. Clique em **"Novo"** no menu lateral esquerdo
2. Nome do banco: `estacionamento`
3. Collation: `utf8_general_ci`
4. Clique em **Criar**

**Opção B — Pela aba SQL:**

1. Clique na aba **SQL** no topo
2. Cole:

```sql
CREATE DATABASE estacionamento
CHARACTER SET utf8
COLLATE utf8_general_ci;
```

3. Clique em **Executar**

### 4.4. Criar as tabelas

Agora precisamos das tabelas. Vou usar o script SQL que você já tem (o `estacionamento.sql`).

**Pela interface do phpMyAdmin:**

1. Selecione o banco `estacionamento` no menu esquerdo
2. Clique na aba **SQL**
3. Cole **todo** o conteúdo do arquivo SQL
4. Clique em **Executar**

Você verá as tabelas criadas:

- `bilhete`
- `cliente`
- `vaga`
- `veiculo`
- `vw_carro_do_cliente` (view)

### 4.5. Entendendo o schema das tabelas

Vamos analisar cada tabela para entender a estrutura.

#### Tabela `cliente`

```sql
CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `nome_cliente` varchar(45) NOT NULL,
  `cpf_cliente` varchar(45) NOT NULL,
  `telefone_cliente` varchar(45) NOT NULL,
  `endereco_cliente` varchar(100) NOT NULL
);
```

**O que cada coluna significa:**

- `id_cliente`: identificador único, gerado automaticamente
- `nome_cliente`: nome completo do cliente
- `cpf_cliente`: CPF único (não pode repetir)
- `telefone_cliente`: telefone para contato
- `endereco_cliente`: endereço completo

#### Tabela `veiculo`

```sql
CREATE TABLE `veiculo` (
  `id_veiculo` int(11) NOT NULL,
  `placa_veiculo` varchar(7) NOT NULL,
  `marca_modelo_veiculo` varchar(45) DEFAULT NULL,
  `cor_veiculo` varchar(45) DEFAULT NULL,
  `Cliente_id_cliente` int(11) NOT NULL
);
```

**O que cada coluna significa:**

- `id_veiculo`: identificador único
- `placa_veiculo`: placa única no sistema
- `marca_modelo_veiculo`: marca e modelo (opcional)
- `cor_veiculo`: cor do veículo (opcional)
- `Cliente_id_cliente`: **chave estrangeira** — aponta para o cliente dono

**O que é chave estrangeira (FK):** uma coluna que referencia o ID de outra tabela. Isso garante **integridade referencial**: não é possível cadastrar um veículo para um cliente que não existe.

#### Tabela `vaga`

```sql
CREATE TABLE `vaga` (
  `id_vaga` int(11) NOT NULL,
  `numero_vaga` int(7) NOT NULL,
  `tipo_vaga` varchar(45) NOT NULL
);
```

**O que cada coluna significa:**

- `id_vaga`: identificador único
- `numero_vaga`: número visível da vaga (1, 2, 3...)
- `tipo_vaga`: `"PCD"` (Pessoa com Deficiência) ou `"Vaga Comum"`

#### Tabela `bilhete`

```sql
CREATE TABLE `bilhete` (
  `id_bilhete` int(11) NOT NULL,
  `hora_entrada_bilhete` datetime NOT NULL,
  `hora_saida_bilhete` datetime DEFAULT NULL,
  `valor_bilhete` decimal(4,2) DEFAULT NULL,
  `status_bilhete` varchar(45) NOT NULL,
  `Veiculo_id_veiculo` int(11) NOT NULL,
  `Vaga_id_vaga` int(11) NOT NULL
);
```

**O que cada coluna significa:**

- `id_bilhete`: identificador único
- `hora_entrada_bilhete`: quando o veículo entrou
- `hora_saida_bilhete`: quando saiu (NULL se ainda estiver estacionado)
- `valor_bilhete`: valor a pagar (NULL até o check-out)
- `status_bilhete`: `"Ocupado"` ou `"Finalizado"`
- `Veiculo_id_veiculo`: FK para veículo
- `Vaga_id_vaga`: FK para vaga

### 4.6. Verificar se as tabelas foram criadas

Execute no phpMyAdmin (aba SQL):

```sql
USE estacionamento;
SHOW TABLES;
SELECT COUNT(*) FROM cliente;
SELECT COUNT(*) FROM veiculo;
SELECT COUNT(*) FROM vaga;
SELECT COUNT(*) FROM bilhete;
```

Você deve ver os dados do seu SQL (34 clientes, 33 veículos, 30 vagas, 33 bilhetes).

**Correção de inconsistência opcional:** se quiser corrigir o bilhete #1 que tem `hora_saida` mas `status = "Ocupado"`:

```sql
UPDATE bilhete
SET status_bilhete = 'Finalizado'
WHERE id_bilhete = 1 AND hora_saida_bilhete IS NOT NULL;
```

---

<a id="parte-5"></a>
## 5. Criando o projeto NestJS

### 5.1. Escolher onde criar o projeto

Crie uma pasta para seus projetos. Exemplos:

- Windows: `C:\projetos\`
- Linux/Mac: `~/projetos/`

Abra o terminal e navegue até lá:

```bash
cd C:\projetos       # Windows
cd ~/projetos        # Linux/Mac
```

### 5.2. Criar o projeto

```bash
nest new estacionamento-api
```

**O que esse comando faz:**

- Baixa um template padrão do NestJS
- Cria a pasta `estacionamento-api`
- Instala todas as dependências base
- Configura TypeScript, ESLint e Prettier

**Você verá a pergunta:**

```
? Which package manager would you ❤️ to use?
  > npm
    yarn
    pnpm
```

Escolha **npm** (setas + Enter). Aguarde a instalação (pode levar 1-2 minutos).

### 5.3. Entrar na pasta

```bash
cd estacionamento-api
```

### 5.4. Verificar a estrutura inicial

```bash
# Windows
dir

# Linux/Mac
ls -la
```

Você verá:

```
estacionamento-api/
├── src/
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.json
└── ...
```

### 5.5. Entender os arquivos principais

**`src/main.ts`** — ponto de entrada da aplicação:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

Esse é o "start" da aplicação. Ele cria a aplicação NestJS com o `AppModule` e a coloca para escutar na porta 3000.

**`src/app.module.ts`** — módulo principal:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Aqui você registra módulos, controllers e services. Vamos modificar bastante esse arquivo.

**`package.json`** — manifesto do projeto. Contém:

- Dependências (`dependencies`)
- Dependências de desenvolvimento (`devDependencies`)
- Scripts (`start`, `build`, etc.)

**`tsconfig.json`** — configurações do TypeScript. Diz onde está o código fonte (`src/`), onde colocar a saída compilada (`dist/`), qual versão de JavaScript gerar, etc.

### 5.6. Testar se está funcionando

```bash
npm run start:dev
```

Aguarde alguns segundos. Você verá:

```
[Nest] 12345  - 09/16/2026, 2:00:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 09/16/2026, 2:00:00 PM     LOG [InstanceLoader] AppModule dependencies initialized +10ms
[Nest] 12345  - 09/16/2026, 2:00:00 PM     LOG [RoutesResolver] AppController {/}: +2ms
[Nest] 12345  - 09/16/2026, 2:00:00 PM     LOG [NestApplication] Nest application successfully started +1ms
```

Abra o navegador em `http://localhost:3000`. Você verá:

```
Hello World!
```

**Isso significa que o NestJS está funcionando.** Para parar, pressione `Ctrl+C`.

---

<a id="parte-6"></a>
## 6. Instalando e configurando o Prisma 7

### 6.1. Instalar as dependências do Prisma

Com o terminal na raiz do projeto:

```bash
npm install @prisma/client@7
npm install -D prisma@7
npm install @prisma/adapter-mariadb
npm install dotenv
```

**O que cada comando faz:**

- `npm install @prisma/client@7` — instala o cliente Prisma (usado em runtime)
- `npm install -D prisma@7` — instala o CLI do Prisma (`-D` = devDependency, só usado em desenvolvimento)
- `npm install @prisma/adapter-mariadb` — instala o driver adapter específico para MariaDB (**obrigatório no Prisma 7**)
- `npm install dotenv` — permite carregar variáveis de um arquivo `.env`

### 6.2. Instalar dependências auxiliares do NestJS

```bash
npm install @nestjs/config
npm install @nestjs/mapped-types
```

- `@nestjs/config` — gerencia variáveis de ambiente de forma integrada ao Nest
- `@nestjs/mapped-types` — fornece `PartialType` para os DTOs de update

### 6.3. Inicializar o Prisma

```bash
npx prisma init --datasource-provider mysql --output ../src/generated/prisma
```

**O que esse comando faz:**

- Cria a pasta `prisma/` com o arquivo `schema.prisma`
- Cria um arquivo `.env` na raiz
- Cria o arquivo `prisma.config.ts` (novo no Prisma 7)
- Define o provider como MySQL
- Define o `output` do cliente gerado em `src/generated/prisma`

### 6.4. Entender o `schema.prisma`

Abra `prisma/schema.prisma`. Você verá algo como:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
}
```

**O que é cada bloco:**

- **`generator client`**: define como o Prisma Client será gerado
  - `provider`: qual gerador usar (no Prisma 7 é `prisma-client`, não mais `prisma-client-js`)
  - `output`: onde colocar o código gerado

- **`datasource db`**: define o banco de dados
  - `provider`: tipo do banco (`mysql`, `postgresql`, `sqlite`, etc.)
  - **No Prisma 7, a URL não fica mais aqui!** Ela vai no `prisma.config.ts`

### 6.5. Configurar o `.env`

O arquivo `.env` foi criado automaticamente. Abra e substitua por:

```env
DATABASE_URL="mysql://root:@localhost:3306/estacionamento"
DATABASE_USER="root"
DATABASE_PASSWORD=""
DATABASE_NAME="estacionamento"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

**Entendendo a `DATABASE_URL`:**

```
mysql://root:@localhost:3306/estacionamento
       │    │ │         │    │
       │    │ │         │    └─ nome do banco
       │    │ │         └────── porta (3306 é padrão do MySQL)
       │    │ └──────────────── host
       │    └────────────────── senha (vazia, pois XAMPP não tem)
       └─────────────────────── usuário
```

Se você tivesse senha no MySQL do XAMPP, seria `mysql://root:suasenha@localhost:3306/estacionamento`.

### 6.6. Configurar o `prisma.config.ts`

Abra `prisma.config.ts` e substitua por:

```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

**Por que essa mudança?**

No Prisma 6, a `DATABASE_URL` ficava dentro do `schema.prisma`. No Prisma 7, o schema **não pode mais ter `url`** — ela precisa ser passada para o CLI via `prisma.config.ts`.

O `import 'dotenv/config'` carrega o `.env` manualmente, porque o Prisma 7 **não carrega mais automaticamente**.

### 6.7. Adicionar `moduleFormat = "cjs"` ao schema

Edite `prisma/schema.prisma`:

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../src/generated/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "mysql"
}
```

**⚠️ Isso é CRÍTICO.**

O Prisma 7 gera código em **ES Modules (ESM)** por padrão, mas o NestJS usa **CommonJS**. Sem o `moduleFormat = "cjs"`, você verá o erro `ReferenceError: exports is not defined in ES module scope`.

### 6.8. Fazer o `db pull` (introspecção)

Como as tabelas já existem no banco, use o Prisma para **ler** a estrutura e gerar os models automaticamente:

```bash
npx prisma db pull
```

**O que isso faz:**

- Conecta ao banco usando `DATABASE_URL`
- Lê todas as tabelas
- Gera os models `Cliente`, `Veiculo`, `Vaga` e `Bilhete` no `schema.prisma`

Depois disso, seu `schema.prisma` terá os models preenchidos. Não precisa escrevê-los manualmente.

### 6.9. Gerar o Prisma Client

```bash
npx prisma generate
```

**O que isso faz:**

- Lê o `schema.prisma`
- Gera o código TypeScript em `src/generated/prisma`
- Cria tipos para todos os models

Você verá uma mensagem:

```
✔ Generated Prisma Client (v7.x.x) to ./src/generated/prisma in 200ms
```

**⚠️ Importante:** o `generate` **não roda automaticamente** no Prisma 7 como antes. Você precisa rodá-lo sempre que alterar o `schema.prisma`.

---

<a id="parte-7"></a>
## 7. Entendendo as mudanças do Prisma 7

Se você já usou Prisma antes, atenção — muita coisa mudou. Se é sua primeira vez, também leia para entender **por que** fazemos do jeito que fazemos.

### 📋 Tabela comparativa

| Aspecto | Prisma 6 | Prisma 7 |
|---------|----------|----------|
| Generator | `prisma-client-js` | `prisma-client` |
| Local do cliente | `node_modules/@prisma/client` | Pasta definida em `output` |
| Import | `from '@prisma/client'` | `from '../generated/prisma/client'` |
| Driver adapter | Opcional | **Obrigatório** para SQL |
| URL no schema | `url = env("DATABASE_URL")` | **Removido** (vai em `prisma.config.ts`) |
| Carregamento do `.env` | Automático | Manual (`import 'dotenv/config'`) |
| `prisma generate` pós-migrate | Automático | **Manual** |
| Formato do módulo | CommonJS | ESM (por padrão) |

### 🧠 Por que essas mudanças?

**1. Generator separado do `node_modules`**

Antes, o Prisma colocava código em `node_modules/@prisma/client`, o que causava problemas com ferramentas de build. Agora, você coloca onde quiser e versiona se quiser.

**2. Driver adapters obrigatórios**

O Prisma 7 abraçou os **drivers nativos** do Node.js. Em vez do Prisma gerenciar a conexão, ele delega para `mysql2`, `pg`, `mariadb` etc. Isso deixa mais leve e compatível.

**3. URL no `prisma.config.ts`**

Separar configuração do schema deixa o `schema.prisma` mais limpo e evita vazamento de credenciais no versionamento.

**4. `moduleFormat = "cjs"`**

Como o NestJS ainda é CommonJS, forçar o Prisma a gerar CommonJS evita ter que migrar todo o projeto para ESM.

---

<a id="parte-8"></a>
## 8. Conectando o NestJS ao banco

### 8.1. Gerar o módulo e o service do Prisma

```bash
nest g module prisma
nest g service prisma
```

**O que esses comandos fazem:**

- `nest g module prisma` — cria `src/prisma/prisma.module.ts`
- `nest g service prisma` — cria `src/prisma/prisma.service.ts`

O `g` é abreviação de `generate`. O Nest cria arquivos automaticamente com o boilerplate.

### 8.2. Editar o `PrismaService`

Abra `src/prisma/prisma.service.ts` e substitua **todo** o conteúdo por:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 3306,
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'estacionamento',
      connectionLimit: 5,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 🔍 Explicação linha a linha

**Imports:**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
```

- `Injectable`: decorator que marca a classe como injetável (o Nest pode fornecê-la a outros lugares)
- `OnModuleInit`: interface que obriga a ter o método `onModuleInit` (executado quando o módulo sobe)
- `OnModuleDestroy`: mesma ideia, mas quando o módulo é destruído

```typescript
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
```

Driver adapter específico para MariaDB. É ele que faz a conexão real com o banco.

```typescript
import { PrismaClient } from '../generated/prisma/client';
```

⚠️ **Aqui está a grande mudança do Prisma 7.** O `PrismaClient` vem do caminho que **você** gerou, não de `@prisma/client`.

**A classe:**

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
```

- `extends PrismaClient`: herda todos os métodos (`$connect`, `$disconnect`) e os models (`cliente`, `veiculo`, etc.)
- `implements OnModuleInit, OnModuleDestroy`: promete implementar os métodos de ciclo de vida

**O construtor:**

```typescript
constructor() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'estacionamento',
    connectionLimit: 5,
  });
  super({ adapter });
}
```

- `process.env.X || 'padrão'`: usa a variável de ambiente, ou um valor padrão se não existir
- `Number(...)`: converte a porta (que vem como string) para número
- `super({ adapter })`: passa o adapter para o construtor do `PrismaClient`

⚠️ **Diferença crucial do Prisma 6:** antes se passava `{ datasources: { db: { url } } }`, agora se passa `{ adapter }`.

**Ciclo de vida:**

```typescript
async onModuleInit() {
  await this.$connect();
}

async onModuleDestroy() {
  await this.$disconnect();
}
```

- `onModuleInit`: chamado quando o módulo é carregado — conecta ao banco
- `onModuleDestroy`: chamado quando a aplicação é desligada — desconecta (evita conexões penduradas)

### 8.3. Editar o `PrismaModule`

Abra `src/prisma/prisma.module.ts` e substitua por:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**O que mudou:**

- `@Global()`: torna o módulo **global**. Isso significa que qualquer outro módulo pode injetar o `PrismaService` **sem precisar importar o `PrismaModule`**. Sem isso, todo módulo teria que fazer `imports: [PrismaModule]`.

- `providers`: registra o `PrismaService` como um provider disponível
- `exports`: torna o `PrismaService` visível para fora do módulo

### 8.4. Configurar o `AppModule`

Abra `src/app.module.ts` e substitua por:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
})
export class AppModule {}
```

**Explicação:**

- `ConfigModule.forRoot({ isGlobal: true })`: carrega o `.env` e torna as variáveis disponíveis em toda a aplicação
- `isGlobal: true`: evita ter que importar `ConfigModule` em cada módulo
- `PrismaModule`: registra o módulo do Prisma

### 8.5. Testar se a conexão funciona

Rode:

```bash
npm run start:dev
```

Se estiver tudo certo, você verá o Nest subir sem erros. Se houver erro de conexão, será algo como:

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

→ Solução: verifique se o MySQL está ligado no XAMPP.

---

<a id="parte-9"></a>
## 9. Criando o CRUD de Cliente

Agora vamos ao primeiro CRUD. O padrão vai se repetir para os outros.

### 9.1. Gerar o resource

```bash
nest g resource cliente
```

**Você verá duas perguntas:**

```
? What transport layer do you use? (Use arrow keys)
❯ REST API
  GraphQL (code first)
  GraphQL (schema first)
  Microservice (non-HTTP)
  WebSockets
```

Escolha **REST API** (Enter).

```
? Would you like to generate CRUD entry points? (Y/n)
```

Digite **Y** e Enter.

**O que o Nest criou:**

```
src/cliente/
├── dto/
│   ├── create-cliente.dto.ts
│   └── update-cliente.dto.ts
├── cliente.controller.ts
├── cliente.controller.spec.ts
├── cliente.module.ts
├── cliente.service.ts
└── cliente.service.spec.ts
```

### 9.2. Editar o `CreateClienteDto`

Abra `src/cliente/dto/create-cliente.dto.ts` e substitua por:

```typescript
export class CreateClienteDto {
  nome_cliente: string;
  cpf_cliente: string;
  telefone_cliente: string;
  endereco_cliente: string;
}
```

**O que é um DTO?**

DTO = **Data Transfer Object**. É uma classe que define o **formato dos dados** que trafegam entre o cliente e o servidor. O NestJS usa DTOs para:

1. Documentar (fica claro o que a API espera)
2. Validar (com `class-validator`, futuramente)
3. Tipar (TypeScript verifica os campos)

Esse DTO diz: "para criar um cliente, preciso de quatro strings: nome, cpf, telefone e endereço".

### 9.3. Editar o `UpdateClienteDto`

Abra `src/cliente/dto/update-cliente.dto.ts` e substitua por:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
```

**Explicação:**

- `PartialType(CreateClienteDto)`: transforma **todos os campos** do `CreateClienteDto` em **opcionais**. Isso faz sentido no update: você pode querer atualizar só o telefone, sem passar nome, cpf e endereço.

É equivalente a escrever:

```typescript
export class UpdateClienteDto {
  nome_cliente?: string;
  cpf_cliente?: string;
  telefone_cliente?: string;
  endereco_cliente?: string;
}
```

### 9.4. Editar o `ClienteService`

Abra `src/cliente/cliente.service.ts` e substitua por:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  create(createClienteDto: CreateClienteDto) {
    return this.prisma.cliente.create({ data: createClienteDto });
  }

  findAll() {
    return this.prisma.cliente.findMany();
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id_cliente: id },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    await this.findOne(id);
    return this.prisma.cliente.update({
      where: { id_cliente: id },
      data: updateClienteDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cliente.delete({ where: { id_cliente: id } });
  }
}
```

**Explicação detalhada:**

**A injeção de dependência:**

```typescript
constructor(private prisma: PrismaService) {}
```

O NestJS vê que o `ClienteService` precisa de `PrismaService` e o **injeta automaticamente**. Como o `PrismaModule` é `@Global()`, funciona sem precisar importar.

**O método `create`:**

```typescript
return this.prisma.cliente.create({ data: createClienteDto });
```

- `this.prisma.cliente`: acessa o model `Cliente` (gerado pelo Prisma a partir da tabela `cliente`)
- `.create()`: método do Prisma para inserir
- `{ data: createClienteDto }`: os dados que serão inseridos

**O método `findAll`:**

```typescript
return this.prisma.cliente.findMany();
```

Retorna todos os clientes. O Prisma traduz isso para `SELECT * FROM cliente`.

**O método `findOne`:**

```typescript
const cliente = await this.prisma.cliente.findUnique({
  where: { id_cliente: id },
});
if (!cliente) {
  throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
}
return cliente;
```

- `findUnique`: busca por chave única (o `id_cliente` é PK)
- Se não encontrar, lança `NotFoundException` — o Nest transforma isso em HTTP 404 automaticamente

**O método `update`:**

```typescript
await this.findOne(id);  // valida se existe
return this.prisma.cliente.update({
  where: { id_cliente: id },
  data: updateClienteDto,
});
```

O `await this.findOne(id)` antes é uma **validação** — se o cliente não existir, retorna 404 antes de tentar atualizar.

**O método `remove`:**

```typescript
await this.findOne(id);
return this.prisma.cliente.delete({ where: { id_cliente: id } });
```

Mesma ideia: valida existência antes de deletar.

### 9.5. Editar o `ClienteController`

Abra `src/cliente/cliente.controller.ts` e substitua por:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.remove(id);
  }
}
```

**Explicação detalhada:**

**O decorator `@Controller('cliente')`:**

```typescript
@Controller('cliente')
```

Define a **rota base** para esse controller. Todos os endpoints terão o prefixo `/cliente`.

**Os decorators de método:**

- `@Post()`: mapeia `POST /cliente`
- `@Get()`: mapeia `GET /cliente`
- `@Get(':id')`: mapeia `GET /cliente/:id` (onde `:id` é parâmetro)
- `@Patch(':id')`: `PATCH /cliente/:id`
- `@Delete(':id')`: `DELETE /cliente/:id`

**Os decorators de parâmetro:**

- `@Body()`: pega o **corpo** da requisição (JSON enviado pelo cliente)
- `@Param('id')`: pega o parâmetro `id` da URL
- `ParseIntPipe`: converte automaticamente o `id` de string para número (URLs são sempre strings)

**Sem o `ParseIntPipe`:**

```typescript
findOne(@Param('id') id: string) {
  return this.clienteService.findOne(+id);  // o "+" converte
}
```

**Com o `ParseIntPipe`:**

```typescript
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.clienteService.findOne(id);  // já vem number
}
```

O pipe também valida: se passar `abc`, retorna `400 Bad Request` automaticamente.

### 9.6. Verificar o `ClienteModule`

Abra `src/cliente/cliente.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {}
```

Como o `PrismaModule` é global, não precisa importar nada. Se não fosse global, seria:

```typescript
@Module({
  imports: [PrismaModule],
  controllers: [ClienteController],
  providers: [ClienteService],
})
```

### 9.7. Registrar no `AppModule`

Abra `src/app.module.ts` e adicione o `ClienteModule`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClienteModule } from './cliente/cliente.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClienteModule,
  ],
})
export class AppModule {}
```

**Por que registrar:** o NestJS só carrega os módulos que estão listados em `imports`. Se esquecer, os endpoints do cliente não existirão.

### 9.8. Testar o CRUD de Cliente

Com o `npm run start:dev` rodando, abra o Insomnia e crie uma nova request:

**POST para criar cliente:**

- **URL:** `http://localhost:3000/cliente`
- **Método:** POST
- **Body (JSON):**

```json
{
  "nome_cliente": "Teste Silva",
  "cpf_cliente": "999.888.777-66",
  "telefone_cliente": "(47) 99999-9999",
  "endereco_cliente": "Rua Teste, 123"
}
```

Se der tudo certo, você receberá algo como:

```json
{
  "id_cliente": 35,
  "nome_cliente": "Teste Silva",
  "cpf_cliente": "999.888.777-66",
  "telefone_cliente": "(47) 99999-9999",
  "endereco_cliente": "Rua Teste, 123"
}
```

**GET para listar todos:**

- **URL:** `http://localhost:3000/cliente`

**GET para buscar um:**

- **URL:** `http://localhost:3000/cliente/35`

**PATCH para atualizar:**

- **URL:** `http://localhost:3000/cliente/35`
- **Body:**

```json
{
  "telefone_cliente": "(47) 98888-7777"
}
```

**DELETE para remover:**

- **URL:** `http://localhost:3000/cliente/35`

Se tudo funcionar, você tem o primeiro CRUD. 🎉

---

<a id="parte-10"></a>
## 10. Criando o CRUD de Veículo

### 10.1. Gerar o resource

```bash
nest g resource veiculo
```

Escolha **REST API** + **Yes** para CRUD.

### 10.2. Editar o `CreateVeiculoDto`

`src/veiculo/dto/create-veiculo.dto.ts`:

```typescript
export class CreateVeiculoDto {
  placa_veiculo: string;
  marca_modelo_veiculo?: string;
  cor_veiculo?: string;
  Cliente_id_cliente: number;
}
```

**Por que `?`:**

No banco, `marca_modelo_veiculo` e `cor_veiculo` aceitam `NULL`. O `?` indica que são opcionais.

`Cliente_id_cliente` é obrigatório — todo veículo precisa ter um dono.

### 10.3. Editar o `UpdateVeiculoDto`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateVeiculoDto } from './create-veiculo.dto';

export class UpdateVeiculoDto extends PartialType(CreateVeiculoDto) {}
```

### 10.4. Editar o `VeiculoService`

`src/veiculo/veiculo.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';

@Injectable()
export class VeiculoService {
  constructor(private prisma: PrismaService) {}

  create(createVeiculoDto: CreateVeiculoDto) {
    return this.prisma.veiculo.create({
      data: createVeiculoDto,
      include: { cliente: true },
    });
  }

  findAll() {
    return this.prisma.veiculo.findMany({
      include: { cliente: true },
      orderBy: { id_veiculo: 'asc' },
    });
  }

  async findOne(id: number) {
    const veiculo = await this.prisma.veiculo.findUnique({
      where: { id_veiculo: id },
      include: {
        cliente: true,
        bilhete: true,
      },
    });
    if (!veiculo) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
    return veiculo;
  }

  async update(id: number, updateVeiculoDto: UpdateVeiculoDto) {
    await this.findOne(id);
    return this.prisma.veiculo.update({
      where: { id_veiculo: id },
      data: updateVeiculoDto,
      include: { cliente: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.veiculo.delete({ where: { id_veiculo: id } });
  }
}
```

**Explicação das novidades:**

**`include: { cliente: true }`:**

Traz os dados do cliente aninhados na resposta. Sem isso, você só veria o `Cliente_id_cliente`. Com isso:

```json
{
  "id_veiculo": 1,
  "placa_veiculo": "ABC-1234",
  "Cliente_id_cliente": 1,
  "cliente": {
    "id_cliente": 1,
    "nome_cliente": "João Silva",
    ...
  }
}
```

**`orderBy: { id_veiculo: 'asc' }`:**

Ordena os resultados. Sem isso, a ordem é indefinida.

**`bilhete: true` no `findOne`:**

Como o `Veiculo` tem relação com `Bilhete` (mas no singular, pois o Prisma nomeia assim), você pode trazer os bilhetes do veículo. Isso é útil para ver o histórico.

⚠️ **Atenção:** se seu Prisma gerou `bilhetes` (plural) em vez de `bilhete` (singular), ajuste conforme seu `schema.prisma`.

### 10.5. Editar o `VeiculoController`

`src/veiculo/veiculo.controller.ts`:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VeiculoService } from './veiculo.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';

@Controller('veiculo')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  create(@Body() createVeiculoDto: CreateVeiculoDto) {
    return this.veiculoService.create(createVeiculoDto);
  }

  @Get()
  findAll() {
    return this.veiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.veiculoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVeiculoDto: UpdateVeiculoDto,
  ) {
    return this.veiculoService.update(id, updateVeiculoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.veiculoService.remove(id);
  }
}
```

### 10.6. Registrar no `AppModule`

```typescript
import { VeiculoModule } from './veiculo/veiculo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClienteModule,
    VeiculoModule,
  ],
})
export class AppModule {}
```

### 10.7. Testar

**POST para criar:**

```json
{
  "placa_veiculo": "TST-1234",
  "marca_modelo_veiculo": "Fiat Uno 1.0",
  "cor_veiculo": "Azul",
  "Cliente_id_cliente": 1
}
```

⚠️ **Use um `Cliente_id_cliente` que existe.** Se passar um cliente inexistente, receberá erro de FK.

**GET para listar** — note o objeto `cliente` aninhado.

**DELETE** — se o veículo tiver bilhetes associados, a operação falhará com erro de FK.

---

<a id="parte-11"></a>
## 11. Criando o CRUD de Vaga

### 11.1. Gerar o resource

```bash
nest g resource vaga
```

### 11.2. Editar o `CreateVagaDto`

`src/vaga/dto/create-vaga.dto.ts`:

```typescript
export enum TipoVaga {
  PCD = 'PCD',
  COMUM = 'Vaga Comum',
}

export class CreateVagaDto {
  numero_vaga: number;
  tipo_vaga: TipoVaga;
}
```

**O que é `enum`:**

Um enum é um conjunto de valores fixos. Aqui, `TipoVaga` só pode ser `PCD` ou `COMUM`. Isso evita erros de digitação como `"vaga comum"` ou `"comum"`.

No Insomnia, você passaria:

```json
{
  "numero_vaga": 31,
  "tipo_vaga": "Vaga Comum"
}
```

### 11.3. Editar o `UpdateVagaDto`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateVagaDto } from './create-vaga.dto';

export class UpdateVagaDto extends PartialType(CreateVagaDto) {}
```

### 11.4. Editar o `VagaService`

`src/vaga/vaga.service.ts`:

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';

@Injectable()
export class VagaService {
  constructor(private prisma: PrismaService) {}

  async create(createVagaDto: CreateVagaDto) {
    const existente = await this.prisma.vaga.findFirst({
      where: { numero_vaga: createVagaDto.numero_vaga },
    });
    if (existente) {
      throw new ConflictException(
        `Já existe uma vaga com o número ${createVagaDto.numero_vaga}`,
      );
    }
    return this.prisma.vaga.create({ data: createVagaDto });
  }

  findAll() {
    return this.prisma.vaga.findMany({
      orderBy: { numero_vaga: 'asc' },
    });
  }

  async findOne(id: number) {
    const vaga = await this.prisma.vaga.findUnique({
      where: { id_vaga: id },
      include: {
        bilhete: {
          where: { status_bilhete: 'Ocupado' },
        },
      },
    });
    if (!vaga) {
      throw new NotFoundException(`Vaga com ID ${id} não encontrada`);
    }
    return vaga;
  }

  async update(id: number, updateVagaDto: UpdateVagaDto) {
    await this.findOne(id);
    if (updateVagaDto.numero_vaga) {
      const existente = await this.prisma.vaga.findFirst({
        where: {
          numero_vaga: updateVagaDto.numero_vaga,
          NOT: { id_vaga: id },
        },
      });
      if (existente) {
        throw new ConflictException(
          `Já existe outra vaga com o número ${updateVagaDto.numero_vaga}`,
        );
      }
    }
    return this.prisma.vaga.update({
      where: { id_vaga: id },
      data: updateVagaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const ocupada = await this.prisma.bilhete.findFirst({
      where: { Vaga_id_vaga: id, status_bilhete: 'Ocupado' },
    });
    if (ocupada) {
      throw new ConflictException(
        `Vaga está ocupada pelo bilhete #${ocupada.id_bilhete}. Finalize antes de deletar.`,
      );
    }
    return this.prisma.vaga.delete({ where: { id_vaga: id } });
  }

  findDisponiveis() {
    return this.prisma.vaga.findMany({
      where: {
        bilhete: {
          none: { status_bilhete: 'Ocupado' },
        },
      },
      orderBy: { numero_vaga: 'asc' },
    });
  }
}
```

**Explicação das novidades:**

**Validação de duplicidade no `create`:**

```typescript
const existente = await this.prisma.vaga.findFirst({
  where: { numero_vaga: createVagaDto.numero_vaga },
});
if (existente) {
  throw new ConflictException(...);
}
```

Antes de criar, verifica se já existe vaga com aquele número. Se sim, retorna HTTP 409 (Conflict).

**Filtro de bilhetes ativos no `findOne`:**

```typescript
bilhete: {
  where: { status_bilhete: 'Ocupado' },
}
```

Só traz bilhetes com status `Ocupado`. Sem isso, retornaria também os finalizados (histórico).

**Validação de vaga ocupada no `remove`:**

```typescript
const ocupada = await this.prisma.bilhete.findFirst({
  where: { Vaga_id_vaga: id, status_bilhete: 'Ocupado' },
});
if (ocupada) {
  throw new ConflictException(...);
}
```

Não permite deletar vaga com bilhete aberto. É uma regra de negócio importante.

**`findDisponiveis` — o operador `none`:**

```typescript
where: {
  bilhete: {
    none: { status_bilhete: 'Ocupado' },
  },
}
```

O `none` significa "não tem **nenhum** bilhete com status Ocupado". Ou seja: vagas livres.

### 11.5. Editar o `VagaController`

`src/vaga/vaga.controller.ts`:

```typescript
import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe,
} from '@nestjs/common';
import { VagaService } from './vaga.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';

@Controller('vaga')
export class VagaController {
  constructor(private readonly vagaService: VagaService) {}

  @Post()
  create(@Body() createVagaDto: CreateVagaDto) {
    return this.vagaService.create(createVagaDto);
  }

  @Get()
  findAll() {
    return this.vagaService.findAll();
  }

  // ⚠️ Rota estática ANTES de :id
  @Get('disponiveis')
  findDisponiveis() {
    return this.vagaService.findDisponiveis();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vagaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVagaDto: UpdateVagaDto,
  ) {
    return this.vagaService.update(id, updateVagaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vagaService.remove(id);
  }
}
```

**⚠️ Regra de ouro:** rotas **estáticas** (`/disponiveis`) devem vir **antes** de rotas com **parâmetro** (`/:id`). Se inverter, o Nest interpreta `"disponiveis"` como `id` e o `ParseIntPipe` retorna 400.

### 11.6. Registrar no `AppModule`

```typescript
import { VagaModule } from './vaga/vaga.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClienteModule,
    VeiculoModule,
    VagaModule,
  ],
})
export class AppModule {}
```

### 11.7. Testar

**Criar vaga:**

```json
{ "numero_vaga": 31, "tipo_vaga": "Vaga Comum" }
```

**Listar vagas disponíveis:**

```
GET http://localhost:3000/vaga/disponiveis
```

---

<a id="parte-12"></a>
## 12. Criando o CRUD de Bilhete com lógica de negócio

O bilhete é o mais complexo: ele **conecta** veículo e vaga, controla o **status** e calcula o **valor**.

### 12.1. Gerar o resource

```bash
nest g resource bilhete
```

### 12.2. Editar os DTOs

**`src/bilhete/dto/create-bilhete.dto.ts`:**

```typescript
export class CreateBilheteDto {
  Veiculo_id_veiculo: number;
  Vaga_id_vaga: number;
}
```

Na entrada, o operador só informa o veículo e a vaga. A hora de entrada, status e valor são calculados pelo backend.

**`src/bilhete/dto/update-bilhete.dto.ts`:**

```typescript
export class UpdateBilheteDto {
  Vaga_id_vaga?: number;
}
```

Só permite trocar de vaga (útil se o cliente precisar mudar).

**`src/bilhete/dto/finalizar-bilhete.dto.ts` (criar):**

```typescript
export class FinalizarBilheteDto {
  valor_bilhete?: number;
}
```

Opcional: permite sobrescrever o valor calculado.

### 12.3. Editar o `BilheteService`

`src/bilhete/bilhete.service.ts`:

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBilheteDto } from './dto/create-bilhete.dto';
import { UpdateBilheteDto } from './dto/update-bilhete.dto';
import { FinalizarBilheteDto } from './dto/finalizar-bilhete.dto';

const VALOR_PRIMEIRA_HORA = 8.0;
const VALOR_HORA_ADICIONAL = 8.0;
const STATUS_OCUPADO = 'Ocupado';
const STATUS_FINALIZADO = 'Finalizado';

@Injectable()
export class BilheteService {
  constructor(private prisma: PrismaService) {}

  async create(createBilheteDto: CreateBilheteDto) {
    const { Veiculo_id_veiculo, Vaga_id_vaga } = createBilheteDto;

    // 1. Valida se veículo existe
    const veiculo = await this.prisma.veiculo.findUnique({
      where: { id_veiculo: Veiculo_id_veiculo },
    });
    if (!veiculo) {
      throw new NotFoundException(
        `Veículo com ID ${Veiculo_id_veiculo} não encontrado`,
      );
    }

    // 2. Valida se vaga existe
    const vaga = await this.prisma.vaga.findUnique({
      where: { id_vaga: Vaga_id_vaga },
    });
    if (!vaga) {
      throw new NotFoundException(
        `Vaga com ID ${Vaga_id_vaga} não encontrada`,
      );
    }

    // 3. Impede vaga já ocupada
    const vagaOcupada = await this.prisma.bilhete.findFirst({
      where: { Vaga_id_vaga, status_bilhete: STATUS_OCUPADO },
    });
    if (vagaOcupada) {
      throw new ConflictException(
        `Vaga ${vaga.numero_vaga} já está ocupada pelo bilhete #${vagaOcupada.id_bilhete}`,
      );
    }

    // 4. Impede veículo já com bilhete aberto
    const veiculoOcupado = await this.prisma.bilhete.findFirst({
      where: {
        Veiculo_id_veiculo,
        status_bilhete: STATUS_OCUPADO,
      },
    });
    if (veiculoOcupado) {
      throw new ConflictException(
        `Veículo já possui bilhete aberto (#${veiculoOcupado.id_bilhete})`,
      );
    }

    // 5. Cria o bilhete
    return this.prisma.bilhete.create({
      data: {
        hora_entrada_bilhete: new Date(),
        status_bilhete: STATUS_OCUPADO,
        Veiculo_id_veiculo,
        Vaga_id_vaga,
      },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
    });
  }

  findAll() {
    return this.prisma.bilhete.findMany({
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
      orderBy: { id_bilhete: 'desc' },
    });
  }

  async findOne(id: number) {
    const bilhete = await this.prisma.bilhete.findUnique({
      where: { id_bilhete: id },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
    });
    if (!bilhete) {
      throw new NotFoundException(`Bilhete #${id} não encontrado`);
    }
    return bilhete;
  }

  findAbertos() {
    return this.prisma.bilhete.findMany({
      where: { status_bilhete: STATUS_OCUPADO },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
      orderBy: { hora_entrada_bilhete: 'asc' },
    });
  }

  findFinalizados() {
    return this.prisma.bilhete.findMany({
      where: { status_bilhete: STATUS_FINALIZADO },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
      orderBy: { hora_saida_bilhete: 'desc' },
    });
  }

  async update(id: number, updateBilheteDto: UpdateBilheteDto) {
    const bilhete = await this.findOne(id);
    if (bilhete.status_bilhete !== STATUS_OCUPADO) {
      throw new BadRequestException(
        'Só é possível alterar bilhetes com status "Ocupado"',
      );
    }
    if (updateBilheteDto.Vaga_id_vaga) {
      const vagaOcupada = await this.prisma.bilhete.findFirst({
        where: {
          Vaga_id_vaga: updateBilheteDto.Vaga_id_vaga,
          status_bilhete: STATUS_OCUPADO,
        },
      });
      if (vagaOcupada && vagaOcupada.id_bilhete !== id) {
        throw new ConflictException('Vaga destino já está ocupada');
      }
    }
    return this.prisma.bilhete.update({
      where: { id_bilhete: id },
      data: updateBilheteDto,
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
    });
  }

  async finalizar(id: number, dto: FinalizarBilheteDto = {}) {
    const bilhete = await this.findOne(id);
    if (bilhete.status_bilhete !== STATUS_OCUPADO) {
      throw new BadRequestException('Bilhete já foi finalizado');
    }
    const horaSaida = new Date();
    const valorCalculado = this.calcularValor(
      bilhete.hora_entrada_bilhete,
      horaSaida,
    );
    return this.prisma.bilhete.update({
      where: { id_bilhete: id },
      data: {
        hora_saida_bilhete: horaSaida,
        valor_bilhete: dto.valor_bilhete ?? valorCalculado,
        status_bilhete: STATUS_FINALIZADO,
      },
      include: {
        veiculo: { include: { cliente: true } },
        vaga: true,
      },
    });
  }

  async remove(id: number) {
    const bilhete = await this.findOne(id);
    if (bilhete.status_bilhete === STATUS_OCUPADO) {
      throw new BadRequestException(
        'Não é possível deletar bilhete em aberto. Finalize primeiro.',
      );
    }
    return this.prisma.bilhete.delete({ where: { id_bilhete: id } });
  }

  private calcularValor(entrada: Date, saida: Date): number {
    const ms = saida.getTime() - entrada.getTime();
    const horas = Math.ceil(ms / (1000 * 60 * 60));
    if (horas <= 1) return VALOR_PRIMEIRA_HORA;
    return VALOR_PRIMEIRA_HORA + (horas - 1) * VALOR_HORA_ADICIONAL;
  }
}
```

**Explicação do `create` (check-in):**

Cinco validações antes de criar:

1. **Veículo existe?** Se não, `NotFoundException` (HTTP 404).
2. **Vaga existe?** Se não, `NotFoundException`.
3. **Vaga já está ocupada?** Se sim, `ConflictException` (HTTP 409).
4. **Veículo já tem bilhete aberto?** Se sim, `ConflictException`.
5. **Tudo OK?** Cria com `hora_entrada = new Date()` e `status = "Ocupado"`.

**Explicação do `finalizar` (check-out):**

```typescript
const horaSaida = new Date();
const valorCalculado = this.calcularValor(
  bilhete.hora_entrada_bilhete,
  horaSaida,
);
```

Calcula o valor com base nas horas decorridas.

```typescript
valor_bilhete: dto.valor_bilhete ?? valorCalculado,
```

O operador `??` significa: "use `dto.valor_bilhete` **se não for null/undefined**, senão use `valorCalculado`". Isso permite sobrescrever o valor manualmente.

**Explicação do `calcularValor`:**

```typescript
const ms = saida.getTime() - entrada.getTime();
const horas = Math.ceil(ms / (1000 * 60 * 60));
```

- `getTime()`: retorna o timestamp em milissegundos
- A diferença dá os milissegundos totais
- `(1000 * 60 * 60)` = 1 hora em milissegundos
- `Math.ceil(...)`: arredonda **para cima** — 1h01 vira 2 horas

```typescript
if (horas <= 1) return VALOR_PRIMEIRA_HORA;
return VALOR_PRIMEIRA_HORA + (horas - 1) * VALOR_HORA_ADICIONAL;
```

Regra: R$ 8 pela primeira hora + R$ 8 por hora adicional.

### 12.4. Editar o `BilheteController`

`src/bilhete/bilhete.controller.ts`:

```typescript
import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe,
} from '@nestjs/common';
import { BilheteService } from './bilhete.service';
import { CreateBilheteDto } from './dto/create-bilhete.dto';
import { UpdateBilheteDto } from './dto/update-bilhete.dto';
import { FinalizarBilheteDto } from './dto/finalizar-bilhete.dto';

@Controller('bilhete')
export class BilheteController {
  constructor(private readonly bilheteService: BilheteService) {}

  @Post()
  create(@Body() createBilheteDto: CreateBilheteDto) {
    return this.bilheteService.create(createBilheteDto);
  }

  @Get()
  findAll() {
    return this.bilheteService.findAll();
  }

  @Get('abertos')
  findAbertos() {
    return this.bilheteService.findAbertos();
  }

  @Get('finalizados')
  findFinalizados() {
    return this.bilheteService.findFinalizados();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bilheteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBilheteDto: UpdateBilheteDto,
  ) {
    return this.bilheteService.update(id, updateBilheteDto);
  }

  @Patch(':id/finalizar')
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() finalizarBilheteDto: FinalizarBilheteDto,
  ) {
    return this.bilheteService.finalizar(id, finalizarBilheteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bilheteService.remove(id);
  }
}
```

⚠️ **Atenção à ordem das rotas:** `@Get('abertos')` e `@Get('finalizados')` **antes** de `@Get(':id')`. Se inverter, o Nest trata `"abertos"` como `id` e o `ParseIntPipe` retorna 400.

### 12.5. Registrar no `AppModule`

```typescript
import { BilheteModule } from './bilhete/bilhete.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClienteModule,
    VeiculoModule,
    VagaModule,
    BilheteModule,
  ],
})
export class AppModule {}
```

### 12.6. Testar no Insomnia

**1. Check-in:**

```
POST http://localhost:3000/bilhete
```
```json
{
  "Veiculo_id_veiculo": 5,
  "Vaga_id_vaga": 3
}
```

Resposta esperada:

```json
{
  "id_bilhete": 34,
  "hora_entrada_bilhete": "2026-09-16T18:42:00.000Z",
  "hora_saida_bilhete": null,
  "valor_bilhete": null,
  "status_bilhete": "Ocupado",
  "Veiculo_id_veiculo": 5,
  "Vaga_id_vaga": 3,
  "veiculo": { ... },
  "vaga": { ... }
}
```

**2. Tentar ocupar vaga já usada (deve dar 409):**

Repita o mesmo POST. Resposta:

```json
{
  "statusCode": 409,
  "message": "Vaga 3 já está ocupada pelo bilhete #34",
  "error": "Conflict"
}
```

**3. Bilhetes abertos:**

```
GET http://localhost:3000/bilhete/abertos
```

**4. Check-out:**

```
PATCH http://localhost:3000/bilhete/34/finalizar
```
```json
{}
```

Resposta:

```json
{
  "id_bilhete": 34,
  "hora_entrada_bilhete": "2026-09-16T18:42:00.000Z",
  "hora_saida_bilhete": "2026-09-16T19:15:00.000Z",
  "valor_bilhete": "8",
  "status_bilhete": "Finalizado",
  ...
}
```

**5. Tentar finalizar de novo (deve dar 400):**

```json
{
  "statusCode": 400,
  "message": "Bilhete já foi finalizado",
  "error": "Bad Request"
}
```

**6. Bilhetes finalizados (histórico):**

```
GET http://localhost:3000/bilhete/finalizados
```

**7. Deletar bilhete aberto (deve dar 400):**

```
DELETE http://localhost:3000/bilhete/34
```
```json
{
  "statusCode": 400,
  "message": "Não é possível deletar bilhete em aberto. Finalize primeiro.",
  "error": "Bad Request"
}
```

---

<a id="parte-13"></a>
## 13. Testando com Insomnia

### 13.1. Organizando as requests

Crie uma **collection** chamada "Estacionamento" e agrupe:

```
📁 Estacionamento
├── 📁 Cliente
│   ├── Criar
│   ├── Listar
│   ├── Buscar
│   ├── Atualizar
│   └── Deletar
├── 📁 Veículo
│   ├── ...
├── 📁 Vaga
│   ├── ...
└── 📁 Bilhete
    ├── Check-in
    ├── Abertos
    ├── Finalizados
    ├── Check-out
    └── ...
```

### 13.2. Variáveis de ambiente no Insomnia

Crie um **Environment** chamado "Local" com:

```
base_url: http://localhost:3000
```

E nas requests use `{{ base_url }}/cliente`. Isso facilita trocar de ambiente depois.

### 13.3. Cenário completo de teste

**Passo 1:** criar cliente

```
POST /cliente
{
  "nome_cliente": "Maria Souza",
  "cpf_cliente": "111.222.333-44",
  "telefone_cliente": "(47) 98888-7777",
  "endereco_cliente": "Rua das Flores, 10"
}
```
→ Anote o `id_cliente` retornado (ex: 35)

**Passo 2:** criar veículo para esse cliente

```
POST /veiculo
{
  "placa_veiculo": "XYZ-9876",
  "marca_modelo_veiculo": "Honda Fit",
  "cor_veiculo": "Prata",
  "Cliente_id_cliente": 35
}
```
→ Anote o `id_veiculo` retornado (ex: 34)

**Passo 3:** ver vagas disponíveis

```
GET /vaga/disponiveis
```
→ Anote um `id_vaga` livre (ex: 5)

**Passo 4:** fazer check-in

```
POST /bilhete
{
  "Veiculo_id_veiculo": 34,
  "Vaga_id_vaga": 5
}
```
→ Anote o `id_bilhete` retornado (ex: 35)

**Passo 5:** consultar bilhetes abertos

```
GET /bilhete/abertos
```

**Passo 6:** fazer check-out

```
PATCH /bilhete/35/finalizar
{}
```

**Passo 7:** consultar histórico

```
GET /bilhete/finalizados
```

---

<a id="parte-14"></a>
## 14. Compilando e rodando em produção

### 14.1. Entender o papel do `dist/`

Quando você roda `npm run start:dev`, o Nest transpila o TypeScript **em tempo real**. Isso é ótimo para desenvolvimento, mas para produção é melhor compilar tudo antes.

O `npm run build`:

1. Lê o `tsconfig.json`
2. Compila todos os `.ts` de `src/` para `.js` em `dist/`
3. Copia assets (se configurado)

O resultado é a pasta `dist/` — JavaScript puro que o Node executa.

### 14.2. Ajustar o `nest-cli.json`

Abra `nest-cli.json` e substitua por:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "assets": [
      {
        "include": "generated/**/*",
        "outDir": "dist"
      }
    ],
    "watchAssets": true
  }
}
```

**Por que:** o compilador TypeScript só copia `.ts` compilados. O cliente Prisma gerado em `src/generated/prisma` **pode ter arquivos `.js` ou `.wasm`** que não são compilados. Precisamos copiá-los explicitamente para `dist/`.

### 14.3. Adicionar o `prebuild`

Abra `package.json` e adicione em `scripts`:

```json
{
  "scripts": {
    "prebuild": "prisma generate",
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

**Como funciona:** o npm executa automaticamente o script `prebuild` **antes** do `build`. Assim, o Prisma Client é regenerado antes de cada build.

### 14.4. Buildar

```bash
npm run build
```

Se não houver erros, a pasta `dist/` estará criada.

**Verifique:**

```bash
# Windows
dir dist\main.js
dir dist\generated\prisma

# Linux/Mac
ls dist/main.js
ls dist/generated/prisma
```

### 14.5. Rodar em produção

```bash
npm run start:prod
```

Ou diretamente:

```bash
node dist/main
```

A API sobe na porta 3000. Teste no Insomnia o mesmo fluxo.

### 14.6. Diferença entre dev e prod

| Aspecto | `start:dev` | `start:prod` |
|---------|-------------|--------------|
| Executa | TypeScript via `ts-node` | JavaScript compilado |
| Watch | ✅ reinicia ao salvar | ❌ estático |
| Build | Não precisa | Precisa de `npm run build` |
| Uso | Desenvolvimento | Produção |

---

<a id="parte-15"></a>
## 15. Solução de problemas comuns

### ❌ Erro: `Cannot find module '../generated/prisma/client'`

**Causa:** o Prisma Client não foi gerado.

**Solução:**

```bash
npx prisma generate
```

### ❌ Erro: `ReferenceError: exports is not defined in ES module scope`

**Causa:** o Prisma 7 gerou código em ESM, mas o NestJS usa CommonJS.

**Solução:** adicione `moduleFormat = "cjs"` no generator:

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../src/generated/prisma"
  moduleFormat = "cjs"
}
```

Depois:

```bash
npx prisma generate
```

### ❌ Erro: `Object literal may only specify known properties, and 'url' does not exist`

**Causa:** você está passando `url` para o adapter no Prisma 7.

**Solução:** no `PrismaService`, troque:

```typescript
// ❌ Errado
new PrismaMariaDb({ url: process.env.DATABASE_URL })

// ✅ Correto
new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'estacionamento',
})
```

### ❌ Erro: `Property 'cliente' does not exist on type 'PrismaService'`

**Causa:** o Prisma Client está desatualizado.

**Solução:**

```bash
npx prisma generate
```

### ❌ Erro: `Cannot find module '@nestjs/mapped-types'`

**Causa:** dependência não instalada.

**Solução:**

```bash
npm install @nestjs/mapped-types
```

### ❌ Erro: `EADDRINUSE: address already in use :::3000`

**Causa:** a porta 3000 já está em uso (outra instância do Nest está rodando).

**Solução:**

**Windows:**

```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**

```bash
lsof -ti:3000 | xargs kill -9
```

### ❌ Erro: `connect ECONNREFUSED 127.0.0.1:3306`

**Causa:** o MySQL/MariaDB não está rodando.

**Solução:** abra o XAMPP Control Panel e clique em **Start** no MySQL.

### ❌ Erro: `Foreign key constraint failed` no DELETE

**Causa:** existem registros dependentes (ex: cliente com veículos, veículo com bilhetes).

**Solução:** delete primeiro os dependentes, ou use `ON DELETE CASCADE` no banco (não recomendado sem pensar).

### ❌ Erro: `Object literal may only specify known properties, but 'bilhetes' does not exist`

**Causa:** o nome do campo de relação é diferente no seu `schema.prisma`. O Prisma nomeia automaticamente — pode ser `bilhete` (singular) em vez de `bilhetes`.

**Solução:** abra o `schema.prisma`, procure no model `Vaga` como a relação foi nomeada, e ajuste o código:

```prisma
model Vaga {
  bilhete Bilhete[]   // ← nome real
}
```

E no service:

```typescript
bilhete: {  // ← use o nome correto
  where: { status_bilhete: 'Ocupado' },
}
```

### ❌ Erro: `409 Conflict` ao criar cliente

**Causa:** CPF duplicado.

**Solução:** use outro CPF, ou delete o cliente existente primeiro.

### ❌ Erro: `400 Bad Request` em `/vaga/disponiveis`

**Causa:** a rota `:id` está declarada **antes** de `disponiveis`.

**Solução:** mova `@Get('disponiveis')` para **antes** de `@Get(':id')`.

### ❌ Erro: `Decimal number too large`

**Causa:** o valor do bilhete passou de `99.99` (limite do `Decimal(4,2)`).

**Solução:** altere o tipo no banco:

```sql
ALTER TABLE bilhete MODIFY valor_bilhete DECIMAL(10,2);
```

Depois:

```bash
npx prisma db pull
npx prisma generate
```

### ❌ Erro: bilhete não aparece em `findDisponiveis`

**Causa:** o status `Ocupado` está com grafia diferente (case-sensitive).

**Solução:** verifique no banco:

```sql
SELECT DISTINCT status_bilhete FROM bilhete;
```

Se estiver `"ocupado"` minúsculo, o filtro `'Ocupado'` não bate.

### ❌ Build passa mas `start:prod` falha com `MODULE_NOT_FOUND`

**Causa:** assets não foram copiados para o `dist`.

**Solução:** ajuste o `nest-cli.json` com `assets` (ver seção 14.2).

---

<a id="parte-16"></a>
## 16. Próximos passos

Agora que a API funciona, você pode evoluí-la.

### 16.1. Validação com `class-validator`

Instale:

```bash
npm install class-validator class-transformer
```

Ative no `main.ts`:

```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
```

Decore os DTOs:

```typescript
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nome_cliente: string;

  @IsString()
  @Length(11, 14)
  cpf_cliente: string;

  @IsString()
  telefone_cliente: string;

  @IsString()
  endereco_cliente: string;
}
```

Agora, se alguém enviar dados inválidos, a API retorna `400 Bad Request` com a explicação.

### 16.2. Swagger (documentação automática)

```bash
npm install @nestjs/swagger swagger-ui-express
```

No `main.ts`:

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Estacionamento API')
  .setDescription('API de gerenciamento de estacionamento')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

Acesse `http://localhost:3000/api` no navegador.

### 16.3. Filtro global de exceções do Prisma

Crie `src/common/filters/prisma-exception.filter.ts`:

```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const map: Record<string, { status: number; message: string }> = {
      P2002: { status: HttpStatus.CONFLICT, message: 'Registro duplicado' },
      P2003: { status: HttpStatus.BAD_REQUEST, message: 'Violação de chave estrangeira' },
      P2025: { status: HttpStatus.NOT_FOUND, message: 'Registro não encontrado' },
    };

    const error = map[exception.code] ?? {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro no banco de dados',
    };

    response.status(error.status).json({
      statusCode: error.status,
      message: error.message,
      error: exception.code,
    });
  }
}
```

Registre no `main.ts`:

```typescript
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

app.useGlobalFilters(new PrismaExceptionFilter());
```

### 16.4. Autenticação JWT

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
```

Cria um `AuthModule` com login, geração de token e proteção de rotas.

### 16.5. Paginação

Modifique `findAll` para aceitar `page` e `limit`:

```typescript
async findAll(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    this.prisma.cliente.findMany({ skip, take: limit }),
    this.prisma.cliente.count(),
  ]);
  return { data, total, page, limit };
}
```

### 16.6. Endpoints de relatório

**Faturamento por período:**

```typescript
async faturamento(inicio: Date, fim: Date) {
  const result = await this.prisma.bilhete.aggregate({
    where: {
      status_bilhete: 'Finalizado',
      hora_saida_bilhete: { gte: inicio, lte: fim },
    },
    _sum: { valor_bilhete: true },
    _count: { id_bilhete: true },
  });
  return {
    total: result._sum.valor_bilhete ?? 0,
    quantidade: result._count.id_bilhete,
  };
}
```

**Ocupação geral:**

```typescript
async ocupacao() {
  const total = await this.prisma.vaga.count();
  const ocupadas = await this.prisma.vaga.count({
    where: { bilhete: { some: { status_bilhete: 'Ocupado' } } },
  });
  return { total, ocupadas, disponiveis: total - ocupadas };
}
```

### 16.7. Testes automatizados

```bash
npm install --save-dev jest supertest @types/supertest
```

Crie `test/cliente.e2e-spec.ts`:

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Cliente (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /cliente', () => {
    return request(app.getHttpServer())
      .get('/cliente')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

Rode com:

```bash
npm run test:e2e
```

### 16.8. Deploy em produção

**Opção 1 — Servidor tradicional (VPS):**

1. Contrate uma VPS (DigitalOcean, Hetzner, Contabo)
2. Instale Node.js 22 e MySQL/MariaDB
3. Clone o projeto, rode `npm install`, `prisma generate`, `npm run build`
4. Use **PM2** para manter rodando:
   ```bash
   pm2 start dist/main.js --name estacionamento-api
   pm2 save
   pm2 startup
   ```
5. Configure **Nginx** como proxy reverso

**Opção 2 — Docker:**

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main"]
```

**Opção 3 — Plataformas PaaS:**

- **Railway**: detecta NestJS automaticamente
- **Render**: suporta Node.js nativamente
- **Fly.io**: deploy via Docker

---

## 🎓 Conclusão

Você construiu do zero uma API REST completa com:

- ✅ **NestJS** como framework
- ✅ **Prisma 7** como ORM (com todas as mudanças de versão)
- ✅ **MariaDB** como banco (rodando no XAMPP)
- ✅ **CRUDs** de cliente, veículo, vaga e bilhete
- ✅ **Regras de negócio** reais (check-in/out, cálculo de tarifa, validações)
- ✅ **Testes** com Insomnia
- ✅ **Build de produção**

### Principais aprendizados

1. **Arquitetura NestJS**: módulos, controllers, services, DTOs
2. **Prisma 7**: driver adapters, `prisma.config.ts`, `moduleFormat = "cjs"`
3. **Relações**: FK, `include`, `none`, `some`
4. **Regras de negócio**: onde colocar, como validar
5. **Ciclo de vida**: `onModuleInit`, `onModuleDestroy`
6. **Boas práticas**: rotas estáticas antes de paramétricas, tratamento de erros

### Onde continuar

- Documentação oficial do [NestJS](https://docs.nestjs.com)
- Documentação do [Prisma](https://www.prisma.io/docs)
- Comunidade [Discord do NestJS](https://discord.gg/nestjs)
- [Roadmap.sh/backend](https://roadmap.sh/backend) para guias de carreira

### Conselho final

A melhor forma de consolidar o aprendizado é **modificar o projeto**. Adicione:

- Um campo novo em alguma tabela
- Uma nova entidade (ex: `Pagamento`)
- Uma regra de desconto para clientes frequentes
- Um endpoint de relatório

Cada modificação te faz aprender algo novo. Boa sorte na jornada! 🚀

---

<p align="center">
  <strong>Feito com ❤️ e muita paciência</strong><br>
  <em>Guia criado em 2026 para desenvolvedores iniciantes em NestJS + Prisma 7</em>
</p>