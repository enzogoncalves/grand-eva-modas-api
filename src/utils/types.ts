import { JWT } from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
	}
	export interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
	}
}

const userPayload = z.object({
	userId: z.string(),
});

type UserPayload = z.infer<typeof userPayload>;

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}
