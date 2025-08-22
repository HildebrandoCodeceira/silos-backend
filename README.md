# Silos Backend (Node.js + Express + MongoDB)

Backend completo para o sistema de **Monitoramento de Silos Agrícolas**.
Inclui autenticação JWT, CRUD de silos, leituras de sensores, alertas automáticos e scripts de simulação.

## Requisitos
- Node.js 18+
- MongoDB 6+ (local ou em nuvem)

## Configuração
1. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. (Opcional) Crie um usuário administrador:
   ```bash
   npm run seed:admin
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Endpoints Principais (base: `http://localhost:${PORT}/api`)

### Autenticação
- `POST /auth/register` (admin) – cria usuário
- `POST /auth/login` – retorna token JWT

### Silos
- `GET /silos` – lista silos
- `POST /silos` (admin) – cria silo
- `GET /silos/:id` – detalhes
- `PATCH /silos/:id` (admin) – atualiza
- `DELETE /silos/:id` (admin) – remove

### Leituras
- `GET /readings?siloId=...&from=...&to=...` – histórico/página
- `POST /readings` (IoT) – cria leitura `{ temperature, humidity, co2, level, siloId }`

### Alertas
- `GET /alerts` – lista alertas (filtros por status, tipo, siloId)
- `PATCH /alerts/:id/resolve` – marca como resolvido

## Simulação de Dados (sem IoT)
Gere leituras a cada X segundos e veja alertas aparecerem automaticamente:
```bash
npm run simulate
```

## Segurança
- Helmet, CORS, Rate Limit, JWT
- Hash de senha com bcrypt
- Validação com Joi

## Observações
- Os limiares de alerta podem ser ajustados via `.env` ou por silo.
- Estrutura preparada para futura integração com MQTT/LoRaWAN.
- Data de geração: 2025-08-22
