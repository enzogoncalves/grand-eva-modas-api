import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { prisma } from "../lib/prisma.js"

export const productsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get('/', {
		preHandler: [app.authenticate],
		schema: {
			tags: ['PRODUCTS'],
			summary: 'get products'
		}
	}, async (req, reply) => {
		 const products = await prisma.product.findMany()

		 reply.send(products)
	})

	app.post('/', {
		preHandler: [app.authenticate],
		schema: {
			tags: ['PRODUCTS'],
			summary: 'create a product',
			body: z.object({
				name: z.string(),
				price: z.number().optional(),
				type: z.enum(['CLOTHES', 'SHOE', 'HAT', 'PERFUME', 'BAG']),
				data: z.object({
					size: z.string().optional(),
					gender: z.enum(['F', 'M', 'Unissex'])
				}),
				imageUrl: z.string(),
			})
		},
	}, async (req, reply) => {
		const { data, imageUrl, price, type, name } = req.body

		console.log(price)

		const product = await prisma.product.create({
			data: {
				data: data,
				imageUrl: imageUrl,
				price: price,
				type: type,
				name: name
			}
		})

		reply.send(product)
	})
}