import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import Redis from 'ioredis';
import { nanoid } from 'nanoid';


const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const fastify = Fastify();


fastify.register(cors, { origin: '*' });

type Intent = {
  code: string;
  amount: string;
  currency: string;
  network: string;
  address: string;
  description?: string;
  status: 'created' | 'paid' | 'expired';
  expiresAt: number;
  txHash?: string;
};

const CODE_TTL = 120; // секунды

// Создание intent-кода
fastify.post('/intent', async (request, reply) => {
  const { amount, currency, network, address, description } = request.body as Omit<Intent, 'code' | 'status' | 'expiresAt'>;
  const code = nanoid(6).toUpperCase(); // 6-символьный уникальный
  const expiresAt = Math.floor(Date.now() / 1000) + CODE_TTL;

  const intent: Intent = {
    code,
    amount,
    currency,
    network,
    address,
    description,
    status: 'created',
    expiresAt,
  };

  // Проверка на уникальность
  if (await redis.exists(`intent:${code}`)) {
    return reply.status(409).send({ error: 'Code already exists' });
  }

  await redis.set(`intent:${code}`, JSON.stringify(intent), 'EX', CODE_TTL);
  return { code, expiresAt };
});

// Получить intent по коду
fastify.get('/intent/:code', async (request, reply) => {
  const { code } = request.params as { code: string };
  const data = await redis.get(`intent:${code}`);
  if (!data) return reply.status(404).send({ error: 'Not found or expired' });
  const intent = JSON.parse(data) as Intent;
  return intent;
});

// Подтвердить intent — сохраняем txHash и меняем статус
fastify.post('/intent/:code/confirm', async (request, reply) => {
  const { code } = request.params as { code: string };
  const { txHash } = request.body as { txHash: string };
  const data = await redis.get(`intent:${code}`);
  if (!data) return reply.status(404).send({ error: 'Not found or expired' });
  const intent = JSON.parse(data) as Intent;
  if (intent.status !== 'created') return reply.status(400).send({ error: 'Already paid or expired' });

  intent.status = 'paid';
  intent.txHash = txHash;
  await redis.set(`intent:${code}`, JSON.stringify(intent), 'EX', CODE_TTL);
  return { success: true };
});

// Получить статус intent
fastify.get('/intent/:code/status', async (request, reply) => {
  const { code } = request.params as { code: string };
  const data = await redis.get(`intent:${code}`);
  if (!data) return reply.status(404).send({ error: 'Not found or expired' });
  const intent = JSON.parse(data) as Intent;
  return { status: intent.status, txHash: intent.txHash };
});

fastify.listen({ port: 3001, host: '0.0.0.0' }, err => {
  if (err) throw err;
  console.log('Server running on http://localhost:3001');
});
