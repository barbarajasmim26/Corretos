import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Alertas() {
  const { data: alertas, refetch } = trpc.alertas.listar.useQuery();
  const marcarComoLido = trpc.alertas.marcarComoLido.useMutation({
    onSuccess: () => refetch(),
  });

  const getAlertaBadge = (tipo: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      vencimento: "destructive",
      pagamento_atrasado: "destructive",
      caucao_pendente: "secondary",
    };
    return variants[tipo] || "outline";
  };

  const getAlertaLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      vencimento: "Vencimento",
      pagamento_atrasado: "Pagamento Atrasado",
      caucao_pendente: "Caução Pendente",
    };
    return labels[tipo] || tipo;
  };

  const naoLidos = alertas?.filter((a: any) => !a.lido) || [];
  const lidos = alertas?.filter((a: any) => a.lido) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
        <p className="text-muted-foreground mt-2">Contratos vencendo e pagamentos atrasados</p>
      </div>

      {/* Alertas Não Lidos */}
      {naoLidos.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Alertas Não Lidos ({naoLidos.length})
            </CardTitle>
            <CardDescription>Atenção necessária</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {naoLidos.map((alerta: any) => (
              <div key={alerta.id} className="flex items-start justify-between p-4 bg-white rounded-lg border border-red-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getAlertaBadge(alerta.tipo)}>
                      {getAlertaLabel(alerta.tipo)}
                    </Badge>
                  </div>
                  <p className="text-sm">{alerta.mensagem}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(alerta.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => marcarComoLido.mutate({ id: alerta.id })}
                  className="ml-4"
                >
                  Marcar como Lido
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Alertas Lidos */}
      {lidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Alertas Resolvidos ({lidos.length})
            </CardTitle>
            <CardDescription>Histórico de alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lidos.map((alerta: any) => (
              <div key={alerta.id} className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200 opacity-75">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">
                      {getAlertaLabel(alerta.tipo)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alerta.mensagem}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(alerta.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sem Alertas */}
      {alertas && alertas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium">Sem alertas</p>
            <p className="text-sm text-muted-foreground">Todos os contratos e pagamentos estão em dia</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
