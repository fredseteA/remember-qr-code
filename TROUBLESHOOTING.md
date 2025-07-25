# Troubleshooting - Remember QR Code

## Problema: "Erro ao enviar solicitação"

### Verificações Básicas:

1. **Reinicie o servidor de desenvolvimento**
   \`\`\`bash
   # Pare o servidor (Ctrl+C) e reinicie
   npm run dev
   \`\`\`

2. **Verifique o arquivo .env.local**
   - Deve estar na raiz do projeto (mesmo nível do package.json)
   - Formato correto:
   \`\`\`
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=sua_chave_aqui
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=seu_service_id_aqui
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=seu_template_id_aqui
   \`\`\`

3. **Abra o Console do Navegador (F12)**
   - Vá para a aba "Console"
   - Procure por mensagens de debug que começam com 🔍, ⚠️, 📧, etc.

### Problemas Comuns:

#### 1. Chaves não carregadas
**Sintoma:** Debug mostra "NÃO ENCONTRADA"
**Solução:** 
- Verifique se o arquivo .env.local existe
- Reinicie o servidor
- Certifique-se que as variáveis começam com `NEXT_PUBLIC_`

#### 2. Chaves inválidas
**Sintoma:** Erro 400 "The Public Key is invalid"
**Solução:**
- Verifique se copiou a chave correta do EmailJS
- Vá em https://dashboard.emailjs.com/admin/account
- Copie a "Public Key" exatamente como aparece

#### 3. Service ID incorreto
**Sintoma:** Erro 404 ou "Service not found"
**Solução:**
- Vá em https://dashboard.emailjs.com/admin
- Copie o ID do serviço (ex: service_abc123)

#### 4. Template ID incorreto
**Sintoma:** Erro 400 "Template not found"
**Solução:**
- Vá em https://dashboard.emailjs.com/admin/templates
- Copie o ID do template (ex: template_xyz789)

#### 5. Template mal configurado
**Sintoma:** Email enviado mas sem dados
**Solução:**
- Verifique se o template tem as variáveis:
  - {{solicitante_nome}}
  - {{solicitante_email}}
  - {{solicitante_telefone}}
  - {{memorial_nome}}
  - {{memorial_local}}
  - {{memorial_nascimento}}
  - {{memorial_falecimento}}
  - {{memorial_url}}

### Sistema de Fallback

Se nada funcionar, o sistema automaticamente:
1. Abre seu cliente de email padrão (Gmail, Outlook, etc.)
2. Preenche automaticamente o destinatário e dados
3. Você só precisa clicar em "Enviar"

### Debug Avançado

Em modo de desenvolvimento, você pode:
1. Clicar em "Mostrar Debug" na página do memorial
2. Ver informações sobre as configurações
3. Verificar logs no console do navegador

### Contato

Se ainda tiver problemas, envie um email para fredericoluna93@gmail.com com:
- Screenshot do erro
- Logs do console
- Informações do debug
