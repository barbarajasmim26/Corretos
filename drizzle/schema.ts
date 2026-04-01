import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  date,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Propriedades/Condomínios
 */
export const propriedades = mysqlTable("propriedades", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  endereco: varchar("endereco", { length: 500 }).notNull(),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Propriedade = typeof propriedades.$inferSelect;
export type InsertPropriedade = typeof propriedades.$inferInsert;

/**
 * Contratos de Aluguel
 */
export const contratos = mysqlTable("contratos", {
  id: int("id").autoincrement().primaryKey(),
  propriedadeId: int("propriedadeId").notNull(),
  casa: varchar("casa", { length: 20 }).notNull(),
  nomeInquilino: varchar("nomeInquilino", { length: 255 }).notNull(),
  dataEntrada: date("dataEntrada").notNull(),
  dataSaida: date("dataSaida"),
  caucao: decimal("caucao", { precision: 10, scale: 2 }).notNull(),
  aluguel: decimal("aluguel", { precision: 10, scale: 2 }).notNull(),
  diaPagamento: int("diaPagamento").notNull(),
  status: mysqlEnum("status", ["ativo", "encerrado", "pendente"]).default("ativo").notNull(),
  telefone: varchar("telefone", { length: 20 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contrato = typeof contratos.$inferSelect;
export type InsertContrato = typeof contratos.$inferInsert;

/**
 * Pagamentos
 */
export const pagamentos = mysqlTable("pagamentos", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId").notNull(),
  ano: int("ano").notNull(),
  mes: int("mes").notNull(), // 1-12
  status: mysqlEnum("status", ["pago", "caucao", "pendente", "atrasado"]).default("pendente").notNull(),
  valorPago: decimal("valorPago", { precision: 10, scale: 2 }),
  dataPagamento: date("dataPagamento"),
  observacao: text("observacao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pagamento = typeof pagamentos.$inferSelect;
export type InsertPagamento = typeof pagamentos.$inferInsert;

/**
 * Alertas de Contratos Vencendo
 */
export const alertas = mysqlTable("alertas", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId").notNull(),
  tipo: mysqlEnum("tipo", ["vencimento", "pagamento_atrasado", "caucao_pendente"]).notNull(),
  mensagem: text("mensagem").notNull(),
  lido: boolean("lido").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Alerta = typeof alertas.$inferSelect;
export type InsertAlerta = typeof alertas.$inferInsert;

/**
 * Recibos Gerados
 */
export const recibos = mysqlTable("recibos", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId").notNull(),
  ano: int("ano").notNull(),
  mes: int("mes").notNull(),
  urlPdf: varchar("urlPdf", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Recibo = typeof recibos.$inferSelect;
export type InsertRecibo = typeof recibos.$inferInsert;

/**
 * Contratos em PDF (Upload)
 */
export const contratoPdfs = mysqlTable("contratoPdfs", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId").notNull(),
  nomeArquivo: varchar("nomeArquivo", { length: 255 }).notNull(),
  urlS3: varchar("urlS3", { length: 500 }).notNull(),
  tamanho: int("tamanho"), // em bytes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContratoPdf = typeof contratoPdfs.$inferSelect;
export type InsertContratoPdf = typeof contratoPdfs.$inferInsert;

/**
 * Mensagens WhatsApp Enviadas
 */
export const mensagensWhatsapp = mysqlTable("mensagensWhatsapp", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId").notNull(),
  tipo: mysqlEnum("tipo", ["cobranca", "vencimento", "confirmacao", "boas_vindas"]).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  mensagem: text("mensagem").notNull(),
  status: mysqlEnum("status", ["enviada", "falha", "pendente"]).default("pendente").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MensagemWhatsapp = typeof mensagensWhatsapp.$inferSelect;
export type InsertMensagemWhatsapp = typeof mensagensWhatsapp.$inferInsert;
