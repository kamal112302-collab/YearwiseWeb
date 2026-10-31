import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

export function isDatabaseAvailable() {
  return Boolean(process.env.DATABASE_URL);
}
export function isServerlessRuntime() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}
export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  // Prefer HTTP over WebSocket — more reliable in Vite SSR and Vercel.
  const adapter = new PrismaNeonHTTP(connectionString, {
    arrayMode: false,
    fullResults: true,
  });
  return new PrismaClient({ adapter });
}
// Bump when Prisma models change so Vite SSR drops a stale cached client.
const PRISMA_CLIENT_GENERATION = 3;

export function getPrismaClient() {
  if (!isDatabaseAvailable()) return null;
  if (global.__yearwisePrisma && global.__yearwisePrismaGeneration === PRISMA_CLIENT_GENERATION) {
    return global.__yearwisePrisma;
  }
  if (global.__yearwisePrisma) {
    void global.__yearwisePrisma.$disconnect().catch(() => {});
  }
  const client = createPrismaClient();
  global.__yearwisePrisma = client;
  global.__yearwisePrismaGeneration = PRISMA_CLIENT_GENERATION;
  return client;
}
export var db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    if (!client) throw new Error("DATABASE_URL is not set");
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  }
});
export function tryDb() {
  return getPrismaClient();
}


