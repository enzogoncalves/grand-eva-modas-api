import type { FastifyReply } from "fastify";
import { Prisma } from "../../prisma/generated/prisma/client.js";

export function prismaErrorHandler(reply: FastifyReply, error: any) {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		console.error(`Prisma error: ${error.code}`);

		// P2025: "An operation failed because it depends on one or more records that were required but not found."
		if (error.code === "P2025") {
			console.log(error.clientVersion);
			return reply.status(500).send({
				code: error.code,
				error: error.name,
				cause: error.meta?.cause,
				// modelName: error.meta?.modelName
			});
		}

		// P2002: creating two @unique (ex: duplicated email)
		if (error.code === "P2002") {
			return reply.status(500).send({
				code: error.code,
				error: error.name,
				cause: error.meta?.cause,
				// modelName: error.meta?.modelName
			});
		}

		return reply.status(500).send({
			code: error.code,
			error: error.name,
			cause: error.meta?.cause,
			// modelName: error.meta?.modelName
		});
	} else if (error instanceof Prisma.PrismaClientValidationError) {
		return reply.status(500).send({
			cause: error.cause,
			error: error.name,
		});
	}

	// 3. Erros genéricos (rede, conexão, etc)
	else {
		console.log("Erro desconhecido:", error);
		return reply.status(500).send({ error: error });
	}
}
