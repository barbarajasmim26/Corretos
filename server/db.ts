import { eq, and, gte, lte, like, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  propriedades,
  contratos,
  pagamentos,
  alertas,
  recibos,
  contratoPdfs,
  mensagensWhatsapp,
  type Propriedade,
  type Contrato,
  type Pagamento,
  type Alerta,
  type Recibo,
  type ContratoPdf,
  type MensagemWhatsapp,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// PROPRIEDADES
// ============================================================================

export async function listarPropriedades(): Promise<Propriedade[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(propriedades).orderBy(asc(propriedades.nome));
}

export async function obterPropriedade(id: number): Promise<Propriedade | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(propriedades).where(eq(propriedades.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function criarPropriedade(data: {
  nome: string;
  endereco: string;
  cidade: string;
}): Promise<Propriedade> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(propriedades).values(data);
  const id = Number(result[0].insertId);
  return obterPropriedade(id) as Promise<Propriedade>;
}

// ============================================================================
// CONTRATOS
// ============================================================================

export async function listarContratos(filtros?: {
  propriedadeId?: number;
  status?: string;
  busca?: string;
}): Promise<Contrato[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [];

  if (filtros?.propriedadeId) {
    conditions.push(eq(contratos.propriedadeId, filtros.propriedadeId));
  }

  if (filtros?.status) {
    conditions.push(eq(contratos.status, filtros.status as any));
  }

  if (conditions.length > 0) {
    return db.select().from(contratos).where(and(...conditions)).orderBy(desc(contratos.dataEntrada));
  }

  return db.select().from(contratos).orderBy(desc(contratos.dataEntrada));
}

export async function obterContrato(id: number): Promise<Contrato | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(contratos).where(eq(contratos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function criarContrato(data: any): Promise<Contrato> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contratos).values(data);
  const id = Number(result[0].insertId);
  return obterContrato(id) as Promise<Contrato>;
}

export async function atualizarContrato(id: number, data: any): Promise<Contrato | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(contratos).set(data).where(eq(contratos.id, id));
  return obterContrato(id);
}

// ============================================================================
// PAGAMENTOS
// ============================================================================

export async function listarPagamentos(contratoId?: number): Promise<Pagamento[]> {
  const db = await getDb();
  if (!db) return [];

  if (contratoId) {
    return db.select().from(pagamentos).where(eq(pagamentos.contratoId, contratoId)).orderBy(desc(pagamentos.ano), desc(pagamentos.mes));
  }

  return db.select().from(pagamentos).orderBy(desc(pagamentos.ano), desc(pagamentos.mes));
}

export async function obterPagamento(id: number): Promise<Pagamento | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(pagamentos).where(eq(pagamentos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function criarPagamento(data: any): Promise<Pagamento> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(pagamentos).values(data);
  const id = Number(result[0].insertId);
  return obterPagamento(id) as Promise<Pagamento>;
}

export async function atualizarPagamento(id: number, data: any): Promise<Pagamento | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(pagamentos).set(data).where(eq(pagamentos.id, id));
  return obterPagamento(id);
}

// ============================================================================
// ALERTAS
// ============================================================================

export async function listarAlertas(): Promise<Alerta[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(alertas).orderBy(desc(alertas.createdAt));
}

export async function criarAlerta(data: any): Promise<Alerta> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(alertas).values(data);
  const id = Number(result[0].insertId);
  const alerta = await db.select().from(alertas).where(eq(alertas.id, id)).limit(1);
  return alerta[0];
}

export async function marcarAlertaComoLido(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(alertas).set({ lido: true }).where(eq(alertas.id, id));
}

// ============================================================================
// RECIBOS
// ============================================================================

export async function criarRecibo(data: any): Promise<Recibo> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(recibos).values(data);
  const id = Number(result[0].insertId);
  const recibo = await db.select().from(recibos).where(eq(recibos.id, id)).limit(1);
  return recibo[0];
}

export async function obterRecibos(contratoId: number): Promise<Recibo[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(recibos).where(eq(recibos.contratoId, contratoId));
}

// ============================================================================
// CONTRATOS PDF
// ============================================================================

export async function criarContratoPdf(data: any): Promise<ContratoPdf> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contratoPdfs).values(data);
  const id = Number(result[0].insertId);
  const pdf = await db.select().from(contratoPdfs).where(eq(contratoPdfs.id, id)).limit(1);
  return pdf[0];
}

export async function obterContratoPdfs(contratoId: number): Promise<ContratoPdf[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(contratoPdfs).where(eq(contratoPdfs.contratoId, contratoId));
}

export async function deletarContratoPdf(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(contratoPdfs).where(eq(contratoPdfs.id, id));
}

// ============================================================================
// MENSAGENS WHATSAPP
// ============================================================================

export async function criarMensagemWhatsapp(data: any): Promise<MensagemWhatsapp> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(mensagensWhatsapp).values(data);
  const id = Number(result[0].insertId);
  const msg = await db.select().from(mensagensWhatsapp).where(eq(mensagensWhatsapp.id, id)).limit(1);
  return msg[0];
}

export async function listarMensagensWhatsapp(contratoId?: number): Promise<MensagemWhatsapp[]> {
  const db = await getDb();
  if (!db) return [];

  if (contratoId) {
    return db.select().from(mensagensWhatsapp).where(eq(mensagensWhatsapp.contratoId, contratoId)).orderBy(desc(mensagensWhatsapp.createdAt));
  }

  return db.select().from(mensagensWhatsapp).orderBy(desc(mensagensWhatsapp.createdAt));
}
