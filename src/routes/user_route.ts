import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ProductSchema, UserSchema } from "../../prisma/generated/zod/index.js";
import { prisma } from "../lib/prisma.js";
import { prismaErrorHandler } from "../lib/prismaErrorHandler.js";
import { dmmfToRuntimeDataModel } from "@prisma/client/runtime/library";

export const userRoute: FastifyPluginAsyncZod = async (app) => {
	// get user data
	app.get('/', {
		preHandler: [app.authenticate],
		schema: {
			summary: "get user data",
			tags: ["USER"],
			// response: {
			// 	200: UserSchema.pick({
			// 		email: true,
			// 		name: true,
			// 		phoneNumber: true,
					
			// 	}),
			// 	400: z.object({
			// 		error: z.string()
			// 	})
			// }
		}
	}, async (req, reply) => {
		const { userId } = req.user

		try {
			const user = await prisma.user.findUnique({
				where: {
					id: userId
				}, select: {
					email: true,
					name: true,
					phoneNumber: true,
					likedProducts: true,
					reservedProducts: true,
				}
			})

			if(!user) {
				return reply.status(400).send({error: 'Unable to find user'})
			}

			reply.status(200).send(user)
		} catch(e) {
			prismaErrorHandler(reply, e)
		}
	}) 

	// get products liked by a user
	app.get('/products/liked', {
		preHandler: [app.authenticate],
		schema: {
			summary: "get products liked by a user",
			tags: ["USER"],
			response: {
				200: ProductSchema.array(),
				400: z.object({
					error: z.string()
				})
			}
		}
	}, async (req, reply) => {
		const { userId } = req.user

		try {
			const user = await prisma.user.findUnique({
				where: {
					id: userId
				}, select: {
					likedProducts: true
				}
			})

			if(!user) {
				return reply.status(400).send({error: 'Unable to find user'})
			}

			if(!user.likedProducts) {
				return reply.status(400).send({error: 'Unable to find products'})
			}

			reply.status(200).send(user.likedProducts)
		} catch(e) {
			prismaErrorHandler(reply, e)
		}
	})

	// get reserved products by a user
	app.get('/products/reserved', {
		preHandler: [app.authenticate],
		schema: {
			summary: "get reserved products by a user",
			tags: ["USER"],
			response: {
				200: ProductSchema.array(),
				400: z.object({
					error: z.string()
				})
			}
		}
	}, async (req, reply) => {
		const { userId } = req.user

		try {
			const user = await prisma.user.findUnique({
				where: {
					id: userId
				}, select: {
					reservedProducts: true
				}
			})

			console.log(user?.reservedProducts)

			if(!user) {
				return reply.status(400).send({error: 'Unable to find user'})
			}

			if(!user.reservedProducts) {
				return reply.status(400).send({error: 'Unable to find products'})
			}

			reply.status(200).send(user.reservedProducts)
		} catch(e) {
			prismaErrorHandler(reply, e)
		}
	})

	// update user data
	app.patch('/', {
		schema: {
			tags: ['USERS'],
			summary: 'update user data',
			body: z.object({
				
			})
		}
	}, (req, reply) => {
		const { userId } = req.user

		prisma.user.update({
			where: {
				id: userId
			},
			data: {
				
			}
		})
	})
};
