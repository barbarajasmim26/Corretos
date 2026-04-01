import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface ContratoDetalheProps {
  params: { id: string };
}

export default function ContratoDetalhe({ params }: ContratoDetalheProps) {
  const [, navigate] = useLocation();
  const contratoId = parseInt(params.id);
  const { data: contrato } = trpc.contratos.obter.useQuery({ id: contratoId });
  const { data: pagamentos } = trpc.pagamentos.listar.useQuery({ contratoId });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pago: "default",
      pendente: "destructive",
      atrasado: "destructive",
      caucao: "secondary",
    };
    return variants[status] || "outline";
  };

  if (!contrato) {
    return <div className="text-center py-8">Contrato não encontrado</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{contrato.nomeInquilino}</h1>
          <p className="text-muted-foreground mt-2">Casa {contrato.casa}</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/contratos")}>Voltar</Button>
      </div>

      {/* Informações do Contrato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">{contrato.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{contrato.telefone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Entrada</p>
              <p className="font-medium">{new Date(contrato.dataEntrada).toLocaleDateString("pt-BR")}</p>
            </div>
            {contrato.dataSaida && (
              <div>
                <p className="text-sm text-muted-foreground">Data de Saída</p>
                <p className="font-medium">{new Date(contrato.dataSaida).toLocaleDateString("pt-BR")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Aluguel Mensal</p>
              <p className="text-2xl font-bold">R$ {Number(contrato.aluguel).toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Caução</p>
              <p className="font-medium">R$ {Number(contrato.caucao).toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dia de Pagamento</p>
              <p className="font-medium">Dia {contrato.diaPagamento}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      {contrato.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{contrato.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos (2026)</CardTitle>
          <CardDescription>{pagamentos?.length || 0} registros</CardDescription>
        </CardHeader>
        <CardContent>
          {pagamentos && pagamentos.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data de Pagamento</TableHead>
                    <TableHead>Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos.map((pagamento: any) => (
                    <TableRow key={pagamento.id}>
                      <TableCell className="font-medium">
                        {new Date(2026, pagamento.mes - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(pagamento.status)}>{pagamento.status}</Badge>
                      </TableCell>
                      <TableCell>R$ {pagamento.valorPago ? Number(pagamento.valorPago).toLocaleString("pt-BR") : "-"}</TableCell>
                      <TableCell>
                        {pagamento.dataPagamento
                          ? new Date(pagamento.dataPagamento).toLocaleDateString("pt-BR")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{pagamento.observacao || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Nenhum pagamento registrado</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
