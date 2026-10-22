import { PrismaNeonHTTP, PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

export function isDatabaseAvailable() {
  return Boolean(process.env.DATABASE_URL);
}
export function isServerlessRuntime() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}
export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  if (isServerlessRuntime()) {
    const adapter = new PrismaNeonHTTP(connectionString, {
      arrayMode: false,
      fullResults: true
    });
    return new PrismaClient({
      adapter
    });
  }
  neonConfig.webSocketConstructor = ws;
  const adapter = new PrismaNeon({
    connectionString
  });
  return new PrismaClient({
    adapter
  });
}
export function getPrismaClient() {
  if (!isDatabaseAvailable()) return null;
  if (global.__yearwisePrisma) return global.__yearwisePrisma;
  const client = createPrismaClient();
  global.__yearwisePrisma = client;
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


