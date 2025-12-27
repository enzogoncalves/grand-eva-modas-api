import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import Fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { env } from "./env.js";
import { productsRoute } from "./routes/products_route.js";
import { authRoute } from "./routes/auth_route.js";
import { authPlugin } from "./middlewares/token_verification.js";
import fastifyMultipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";

const server = Fastify().withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

// server.register(fastifyJwt, { secret: env.JWT_SECRET_KEY })

server.register(fastifyMultipart, {
	// attachFieldsToBody: true
});

server.register(authPlugin);

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Grand Eva Modas API",
			description:
				"An API to handle requests from the store site: https://grand-eva-modas.vercel.app",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform
});

server.register(ScalarApiReference, {
	routePrefix: "/docs",
});

server.register(authRoute, { prefix: "/auth" });
server.register(productsRoute, { prefix: "/products" });

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log("HTTP server running at http://localhost:3333");
});
