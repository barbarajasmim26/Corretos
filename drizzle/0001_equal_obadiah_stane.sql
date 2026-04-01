CREATE TABLE `alertas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contratoId` int NOT NULL,
	`tipo` enum('vencimento','pagamento_atrasado','caucao_pendente') NOT NULL,
	`mensagem` text NOT NULL,
	`lido` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alertas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contratoPdfs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contratoId` int NOT NULL,
	`nomeArquivo` varchar(255) NOT NULL,
	`urlS3` varchar(500) NOT NULL,
	`tamanho` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contratoPdfs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contratos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propriedadeId` int NOT NULL,
	`casa` varchar(20) NOT NULL,
	`nomeInquilino` varchar(255) NOT NULL,
	`dataEntrada` date NOT NULL,
	`dataSaida` date,
	`caucao` decimal(10,2) NOT NULL,
	`aluguel` decimal(10,2) NOT NULL,
	`diaPagamento` int NOT NULL,
	`status` enum('ativo','encerrado','pendente') NOT NULL DEFAULT 'ativo',
	`telefone` varchar(20),
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contratos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mensagensWhatsapp` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contratoId` int NOT NULL,
	`tipo` enum('cobranca','vencimento','confirmacao','boas_vindas') NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`mensagem` text NOT NULL,
	`status` enum('enviada','falha','pendente') NOT NULL DEFAULT 'pendente',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mensagensWhatsapp_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pagamentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contratoId` int NOT NULL,
	`ano` int NOT NULL,
	`mes` int NOT NULL,
	`status` enum('pago','caucao','pendente','atrasado') NOT NULL DEFAULT 'pendente',
	`valorPago` decimal(10,2),
	`dataPagamento` date,
	`observacao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pagamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `propriedades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`endereco` varchar(500) NOT NULL,
	`cidade` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `propriedades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recibos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contratoId` int NOT NULL,
	`ano` int NOT NULL,
	`mes` int NOT NULL,
	`urlPdf` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recibos_id` PRIMARY KEY(`id`)
);
