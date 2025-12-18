import bcrypt from 'bcrypt';
import { addMonths } from "date-fns";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { jwtVerify, SignJWT } from "jose";
import { JWTInvalid } from "jose/errors";
import z from "zod";
import { AuthTokenSchema } from "../../prisma/generated/zod/index.js";
import { env } from "../env.js";
import { prisma } from "../lib/prisma.js";

const authTokenWithoutIdsSchema = AuthTokenSchema.omit({id: true, userId: true})

type authTokenWithoutIdsType = z.infer<typeof authTokenWithoutIdsSchema>

async function createJwtToken(): Promise<authTokenWithoutIdsType> {
	const date = new Date();
	const timeToExpiresTokenInMonths = 1;
	
	/**
	 * Use addSeconds(), addMinutes(), addDays() functions to set the token expired date
	*/
	const tokenExpiredDate = addMonths(date, timeToExpiresTokenInMonths)

	let jwt: string;

	try {
		const secret = new TextEncoder().encode(env.JWT_SECRET_KEY)
			
		const alg = 'HS256'
		
		jwt = await new SignJWT({  })
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setIssuer('urn:example:issuer')
		.setAudience('urn:example:audience')
		.setExpirationTime(tokenExpiredDate)
		.sign(secret)
	} catch(e) {
		console.log(e)
		throw new Error('Unable to create JWT Token')
	}

	return {
		token: jwt,
		expiresAt: tokenExpiredDate,
		createdAt: date,
	} as authTokenWithoutIdsType
}

async function isTokenExpired(token: string): Promise<boolean> {
	const secret = new TextEncoder().encode(env.JWT_SECRET_KEY)

	if(!secret) {
		throw new Error('JWT_SECRET is not configured on the server.')
	}

	try {
		await jwtVerify(token, secret, {
			issuer: 'urn:example:issuer',
			audience: 'urn:example:audience'
		})

		return false;
	} catch(e) {
			const error = e as JWTInvalid

			switch(error.code) {
				case 'ERR_JWT_EXPIRED':
					return true;
				default: 
					return true;
			}
		}
}

async function doesUserAlreadyExist(email: string): Promise<boolean> {
	const user = await prisma.user.findFirst({
		where: {
			email: email
		}
	})

	console.log(`user: ${user}`)

	return user !== null;
}

export const authRoute: FastifyPluginAsyncZod = async (app) => {
	app.post('/register', {
		preHandler: [],
		schema: {
			summary: '/register',
			description: 'Register a new user',
			tags: ['AUTH'],
			body: z.object({
				method: z.enum(['Google', 'Email-Password']),
				email: z.email(),
				password: z.string().nullable(),
				name: z.string(),
			})
		}
	}, async (req, reply) => {
		const { method, email, password, name } = req.body;

		const doesUserExist = await doesUserAlreadyExist(email)

		if(doesUserExist) {
			return reply.status(409).send();
		}

		if(method === "Email-Password" && password !== null) {
			const passwordSalt = await bcrypt.genSalt()
			const hashedPassword = await bcrypt.hash(password, passwordSalt)

			try {
				const user = await prisma.user.create({
					data: {
						email,
						name,
						password: hashedPassword
					},
					select: {
						id: true
					}
				})

				const newToken = await createJwtToken();

				const token = await prisma.authToken.create({
					data: {
						token: newToken.token,
						createdAt: newToken.createdAt,
						expiresAt: newToken.expiresAt,
						user: {
							connect: {
								id: user.id
							}
						}
					},
					select: {
						token: true
					}
				})

				return reply.status(200).header('authorization', token.token).send()
			} catch(_e) {
				return reply.status(500).send()
			}
		}
	})

	app.post('/signin', {
		schema: {
			tags: ['AUTH'],
			summary: '/sigin',
			description: 'Sign in a user',
			body: z.object({
				method: z.enum(['Google', 'Email-Password']),
				email: z.email(),
				password: z.string().nullable()
			}),
			response: {
				200: z.object({}),
				401: z.object({}),
				500: z.object({
					message: z.string()
				})
			}
		}
	}, async (req, reply) => {
		const { method, email, password } = req.body 

		const user = await prisma.user.findFirst({
			where: {
				email: email
			},
			select: {
				password: true,
				id: true
			}
		})

		if(method === "Email-Password" && password !== null) {
			const authorized = user && (await bcrypt.compare(password, user.password))

			if(user === null || !authorized) {
				return reply.status(401).send({})
			}

			const userToken = await prisma.authToken.findFirst({
				where: {
					userId: user?.id
				},
				select: {
					id: true,
					token: true,
					expiresAt: true,
					createdAt: true,
				}
			})

			if(userToken) {
			const verifyIfTokenIsExpired = await isTokenExpired(userToken.token)
			
			if(!verifyIfTokenIsExpired) {
				console.log('Não foi preciso atualizar o token')

				reply.header("authorization", userToken.token).status(200).send()
			} else {
				const newToken = await createJwtToken();

				await prisma.authToken.update({
					where: {
						id: userToken.id
					}, data : newToken
				}).then((_) => {
					console.log('Conseguimos atualizar o token')

					reply.header("authorization", userToken.token).status(200).send()
				}).catch((e) => {
					console.log('unable to update token')
					console.log(e);

					return reply.status(500).send({
						message: 'Unable to update token',
					})
				})
			}
			}
		}
	})
}