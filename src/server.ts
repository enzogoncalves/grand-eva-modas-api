import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env";
import ScalarApiReference from "@scalar/fastify-api-reference";

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Grand Eva Modas API",
			description:
				"An API to handle requests from the store site: https://grand-eva-modas.vercel.app",
			version: "1.0.0",
		},
	},
});

server.register(ScalarApiReference, {
	routePrefix: "/docs",
});

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log("HTTP server running at http://localhost:3333");
});
