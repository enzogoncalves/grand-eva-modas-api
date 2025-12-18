import type { FastifyReply, FastifyRequest } from "fastify";
import fp from 'fastify-plugin'
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { jwtVerify } from "jose";
import type { JWTInvalid } from "jose/errors";
import { prisma } from "../lib/prisma.js";

export const authPlugin: FastifyPluginAsyncZod = async (app) => {
	// middleware para verificar se o token do usuário está expirado
	app.decorate('token-verification', async (req: FastifyRequest, reply: FastifyReply) => {
		const { headers: { auth_token } }= req;

		if(auth_token === undefined) {
			console.log('Token not found');
			return reply.status(401).send()
		}

		const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

		if(!secret) {
			throw new Error('JWT_SECRET is not configured on the server.') 
		}

		try {
				await jwtVerify(auth_token as string, secret, {
					issuer: 'urn:example:issuer',
					audience: 'urn:example:audience'
				})
				

			} catch(e) {
				console.log(e)
				const error = e as JWTInvalid

				switch(error.code) {
					case 'ERR_JWT_EXPIRED':
						return reply.status(401).send({
							authorized: false,
							message: 'Token expired'
						});
					default: 
						return reply.status(401).send({
							authorized: false,
							message: 'Invalid token'
						});
				}
			}
	})

	// middleware para verificar se o token do usuário está expirado e se está ativo no banco de dados
	app.decorate('authenticate', async (req: FastifyRequest<Object>, reply: FastifyReply) => {
		const { headers: { auth_token } } = req;

		if(auth_token === undefined) {
			console.log('Token not found');
			return reply.status(401).send()
		}

		const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

			if(!secret) {
				throw new Error('JWT_SECRET is not configured on the server.') 
			}

			// if(data?.authToken!.token == null)

			try {
				await jwtVerify(auth_token as string, secret, {
					issuer: 'urn:example:issuer',
					audience: 'urn:example:audience'
				})
			} catch(e) {
				console.log(e)
				const error = e as JWTInvalid

				switch(error.code) {
					case 'ERR_JWT_EXPIRED':
						return reply.status(401).send({
							authorized: false,
							message: 'Token expired'
						});
					default: 
						return reply.status(401).send({
							authorized: false,
							message: 'Invalid token'
						});
				}
			}

		await prisma.authToken.findFirst({
			where: {
				token: auth_token as string,
			},
			select: {
				token: true,
				userId: true,
			}
		})
		.then(async (data) => {
			if(!data) {
				console.log('não encontrado')
				return reply.status(401).send({
					authorized: false,
					message: 'Token not found'
				})
			} else {
				console.log('token encontrado!')
			}
		}).catch((e) => {
			console.log(e)
			return reply.status(401).send({
				authorized: false,
				message: 'Something went wrong while getting the token'
			});
		});
	});
}


export default fp(authPlugin);