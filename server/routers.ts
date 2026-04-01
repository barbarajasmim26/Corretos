import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  listarPropriedades,
  obterPropriedade,
  criarPropriedade,
  listarContratos,
  obterContrato,
  criarContrato,
  atualizarContrato,
  listarPagamentos,
  obterPagamento,
  criarPagamento,
  atualizarPagamento,
  listarAlertas,
  criarAlerta,
  marcarAlertaComoLido,
  criarRecibo,
  obterRecibos,
  criarContratoPdf,
  obterContratoPdfs,
  deletarContratoPdf,
  criarMensagemWhatsapp,
  listarMensagensWhatsapp,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // PROPRIEDADES
  // ============================================================================
  propriedades: router({
    listar: protectedProcedure.query(async () => {
      return listarPropriedades();
    }),

    obter: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return obterPropriedade(input.id);
      }),

    criar: protectedProcedure
      .input(
        z.object({
          nome: z.string(),
          endereco: z.string(),
          cidade: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return criarPropriedade(input);
      }),
  }),

  // ============================================================================
  // CONTRATOS
  // ============================================================================
  contratos: router({
    listar: protectedProcedure
      .input(
        z.object({
          propriedadeId: z.number().optional(),
          status: z.string().optional(),
          busca: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return listarContratos(input);
      }),

    obter: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return obterContrato(input.id);
      }),

    criar: protectedProcedure
      .input(
        z.object({
          propriedadeId: z.number(),
          casa: z.string(),
          nomeInquilino: z.string(),
          dataEntrada: z.string(),
          dataSaida: z.string().optional(),
          caucao: z.string(),
          aluguel: z.string(),
          diaPagamento: z.number(),
          status: z.enum(["ativo", "encerrado", "pendente"]).optional(),
          telefone: z.string().optional(),
          observacoes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return criarContrato(input);
      }),

    atualizar: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ input }) => {
        return atualizarContrato(input.id, input.data);
      }),
  }),

  // ============================================================================
  // PAGAMENTOS
  // ============================================================================
  pagamentos: router({
    listar: protectedProcedure
      .input(z.object({ contratoId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return listarPagamentos(input && input.contratoId ? input.contratoId : undefined);
      }),

    obter: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return obterPagamento(input.id);
      }),

    criar: protectedProcedure
      .input(
        z.object({
          contratoId: z.number(),
          ano: z.number(),
          mes: z.number(),
          status: z.enum(["pago", "caucao", "pendente", "atrasado"]),
          valorPago: z.string().optional(),
          dataPagamento: z.string().optional(),
          observacao: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return criarPagamento(input);
      }),

    atualizar: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ input }) => {
        return atualizarPagamento(input.id, input.data);
      }),
  }),

  // ============================================================================
  // ALERTAS
  // ============================================================================
  alertas: router({
    listar: protectedProcedure.query(async () => {
      return listarAlertas();
    }),

    criar: protectedProcedure
      .input(
        z.object({
          contratoId: z.number(),
          tipo: z.enum(["vencimento", "pagamento_atrasado", "caucao_pendente"]),
          mensagem: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return criarAlerta(input);
      }),

    marcarComoLido: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await marcarAlertaComoLido(input.id);
        return { success: true };
      }),
  }),

  // ============================================================================
  // RECIBOS
  // ============================================================================
  recibos: router({
    criar: protectedProcedure
      .input(
        z.object({
          contratoId: z.number(),
          ano: z.number(),
          mes: z.number(),
          urlPdf: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return criarRecibo(input);
      }),

    listar: protectedProcedure
      .input(z.object({ contratoId: z.number() }))
      .query(async ({ input }) => {
        return obterRecibos(input.contratoId);
      }),
  }),

  // ============================================================================
  // CONTRATOS PDF
  // ============================================================================
  contratoPdfs: router({
    criar: protectedProcedure
      .input(
        z.object({
          contratoId: z.number(),
          nomeArquivo: z.string(),
          urlS3: z.string(),
          tamanho: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return criarContratoPdf(input);
      }),

    listar: protectedProcedure
      .input(z.object({ contratoId: z.number() }))
      .query(async ({ input }) => {
        return obterContratoPdfs(input.contratoId);
      }),

    deletar: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletarContratoPdf(input.id);
        return { success: true };
      }),
  }),

  // ============================================================================
  // MENSAGENS WHATSAPP
  // ============================================================================
  whatsapp: router({
    enviarMensagem: protectedProcedure
      .input(
        z.object({
          contratoId: z.number(),
          tipo: z.enum(["cobranca", "vencimento", "confirmacao", "boas_vindas"]),
          telefone: z.string(),
          mensagem: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return criarMensagemWhatsapp({
          ...input,
          status: "pendente",
        });
      }),

    listar: protectedProcedure
      .input(z.object({ contratoId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return listarMensagensWhatsapp(input && input.contratoId ? input.contratoId : undefined);
      }),
  }),
});

export type AppRouter = typeof appRouter;
