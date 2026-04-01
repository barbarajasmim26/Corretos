import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Contratos() {
  const [, navigate] = useLocation();
  const [filtros, setFiltros] = useState({
    status: "",
    busca: "",
  });

  const { data: contratos, isLoading } = trpc.contratos.listar.useQuery(
    filtros.status || filtros.busca ? filtros : {}
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ativo: "default",
      encerrado: "secondary",
      pendente: "destructive",
    };
    return variants[status] || "outline";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
        <p className="text-muted-foreground mt-2">Gerenciamento de contratos de aluguel</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Buscar por inquilino, casa..."
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
            />
            <Select value={filtros.status} onValueChange={(value) => setFiltros({ ...filtros, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setFiltros({ status: "", busca: "" })}>Limpar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Contratos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
          <CardDescription>{contratos?.length || 0} contratos encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : contratos && contratos.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Casa</TableHead>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Aluguel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratos.map((contrato: any) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">{contrato.casa}</TableCell>
                      <TableCell>{contrato.nomeInquilino}</TableCell>
                      <TableCell>R$ {Number(contrato.aluguel).toLocaleString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(contrato.status)}>{contrato.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(contrato.dataEntrada).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/contratos/${contrato.id}`)}
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Nenhum contrato encontrado</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
