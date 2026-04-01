import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Building2, Users, TrendingUp, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: propriedades } = trpc.propriedades.listar.useQuery();
  const { data: contratos } = trpc.contratos.listar.useQuery({});
  const { data: pagamentos } = trpc.pagamentos.listar.useQuery({});
  const { data: alertas } = trpc.alertas.listar.useQuery();

  const [stats, setStats] = useState({
    totalPropriedades: 0,
    totalContratos: 0,
    contratosAtivos: 0,
    receita: 0,
    pagamentosPendentes: 0,
    alertasNaoLidos: 0,
  });

  useEffect(() => {
    if (propriedades && contratos && pagamentos && alertas) {
      const ativos = contratos.filter((c: any) => c.status === "ativo").length;
      const receita = contratos.reduce((acc: number, c: any) => {
        const pagos = pagamentos.filter(
          (p: any) => p.contratoId === c.id && p.status === "pago"
        ).length;
        return acc + pagos * Number(c.aluguel);
      }, 0);
      const pendentes = pagamentos.filter((p: any) => p.status === "pendente" || p.status === "atrasado").length;
      const naoLidos = alertas.filter((a: any) => !a.lido).length;

      setStats({
        totalPropriedades: propriedades.length,
        totalContratos: contratos.length,
        contratosAtivos: ativos,
        receita,
        pagamentosPendentes: pendentes,
        alertasNaoLidos: naoLidos,
      });
    }
  }, [propriedades, contratos, pagamentos, alertas]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Visão geral do sistema de gestão de imóveis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriedades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPropriedades}</div>
            <p className="text-xs text-muted-foreground">Imóveis cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contratosAtivos}</div>
            <p className="text-xs text-muted-foreground">{stats.totalContratos} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita (2026)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.receita.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">Pagamentos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alertasNaoLidos}</div>
            <p className="text-xs text-muted-foreground">Não lidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Rápido</CardTitle>
          <CardDescription>Informações importantes do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="font-medium">Pagamentos Pendentes</span>
              <span className="text-2xl font-bold text-orange-600">{stats.pagamentosPendentes}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="font-medium">Taxa de Ocupação</span>
              <span className="text-2xl font-bold text-green-600">
                {stats.totalContratos > 0 ? Math.round((stats.contratosAtivos / stats.totalContratos) * 100) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
