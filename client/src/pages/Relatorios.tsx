import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Relatorios() {
  const { data: contratos } = trpc.contratos.listar.useQuery({});
  const { data: pagamentos } = trpc.pagamentos.listar.useQuery({});
  const [relatorios, setRelatorios] = useState({
    receitaMensal: [] as any[],
    ocupacao: 0,
    vencimentosFuturos: 0,
  });

  useEffect(() => {
    if (contratos && pagamentos) {
      // Receita Mensal
      const receitaMensal: Record<number, number> = {};
      for (let mes = 1; mes <= 12; mes++) {
        receitaMensal[mes] = 0;
      }

      pagamentos.forEach((p: any) => {
        if (p.status === "pago" && p.mes >= 1 && p.mes <= 12) {
          receitaMensal[p.mes] += Number(p.valorPago || 0);
        }
      });

      const receitaMensalArray = Object.entries(receitaMensal).map(([mes, valor]) => ({
        mes: new Date(2026, parseInt(mes) - 1).toLocaleDateString("pt-BR", { month: "short" }),
        receita: valor,
      }));

      // Taxa de Ocupação
      const ativos = contratos.filter((c: any) => c.status === "ativo").length;
      const ocupacao = contratos.length > 0 ? Math.round((ativos / contratos.length) * 100) : 0;

      // Vencimentos Futuros (próximos 30 dias)
      const hoje = new Date();
      const futuro = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      const vencimentosFuturos = contratos.filter((c: any) => {
        if (!c.dataSaida) return false;
        const dataSaida = new Date(c.dataSaida);
        return dataSaida >= hoje && dataSaida <= futuro;
      }).length;

      setRelatorios({
        receitaMensal: receitaMensalArray,
        ocupacao,
        vencimentosFuturos,
      });
    }
  }, [contratos, pagamentos]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground mt-2">Análise de receita, ocupação e vencimentos</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{relatorios.ocupacao}%</div>
            <p className="text-xs text-muted-foreground mt-1">Contratos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencimentos (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{relatorios.vencimentosFuturos}</div>
            <p className="text-xs text-muted-foreground mt-1">Contratos a vencer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Total (2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {relatorios.receitaMensal.reduce((acc, item) => acc + item.receita, 0).toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pagamentos confirmados</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Receita Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Receita Mensal (2026)</CardTitle>
          <CardDescription>Distribuição de receita ao longo do ano</CardDescription>
        </CardHeader>
        <CardContent>
          {relatorios.receitaMensal.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={relatorios.receitaMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
                <Legend />
                <Bar dataKey="receita" fill="#3b82f6" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Sem dados disponíveis</div>
          )}
        </CardContent>
      </Card>

      {/* Resumo por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Contratos</CardTitle>
          <CardDescription>Distribuição por status</CardDescription>
        </CardHeader>
        <CardContent>
          {contratos ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Contratos Ativos</span>
                <span className="text-2xl font-bold text-green-600">
                  {contratos.filter((c: any) => c.status === "ativo").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Contratos Encerrados</span>
                <span className="text-2xl font-bold text-slate-600">
                  {contratos.filter((c: any) => c.status === "encerrado").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Contratos Pendentes</span>
                <span className="text-2xl font-bold text-orange-600">
                  {contratos.filter((c: any) => c.status === "pendente").length}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
