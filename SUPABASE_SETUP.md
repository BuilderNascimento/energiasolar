# Configuração do Supabase

## ⚠️ AÇÃO NECESSÁRIA: Configurar Senha do Banco de Dados

Para que o sistema funcione corretamente com o Supabase, você precisa configurar a senha do banco de dados:

### Passos para Configurar:

1. **Acesse o Painel do Supabase:**
   - Vá para: https://supabase.com/dashboard
   - Faça login na sua conta
   - Selecione o projeto: `kjjybkcycorwzrboutui`

2. **Obtenha a Senha do Banco:**
   - No painel lateral, clique em "Settings" (Configurações)
   - Clique em "Database"
   - Na seção "Connection string", você encontrará a senha
   - Ou vá em "Database" > "Connection pooling" para ver a string de conexão completa

3. **Configure o Arquivo .env:**
   - Abra o arquivo `.env` na raiz do projeto
   - Substitua `[YOUR_DB_PASSWORD]` pela senha real do seu banco Supabase
   - Exemplo: `postgresql://postgres.kjjybkcycorwzrboutui:SUA_SENHA_AQUI@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`

4. **Execute a Migração:**
   ```bash
   npx prisma db push
   ```

5. **Reinicie o Servidor:**
   ```bash
   npm run dev
   ```

## Estrutura das Tabelas

O sistema criará automaticamente as seguintes tabelas no Supabase:

- **leads**: Para armazenar informações de leads/contatos
- **simulations**: Para armazenar resultados de simulações
- **users**: Para usuários administrativos
- **products**: Para catálogo de produtos
- **settings**: Para configurações do sistema

## Verificação

Após configurar, você pode verificar se tudo está funcionando:

1. Acesse o site: http://localhost:3000
2. Preencha o formulário de simulação
3. Verifique se os dados aparecem nas tabelas do Supabase

## Problemas Comuns

- **Erro de conexão**: Verifique se a senha está correta
- **Tabelas não criadas**: Execute `npx prisma db push` novamente
- **Dados não salvos**: Verifique o console do navegador para erros

---

**Nota**: Este arquivo pode ser deletado após a configuração estar completa.