import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import sharp from "sharp";
import { storage } from "../lib/firebase.js";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { equal } from "assert";
import {
	JsonValueSchema,
	ProductSchema,
	ProductTypeSchema,
} from "../../prisma/generated/zod/index.js";
import { ProductType } from "../../prisma/generated/prisma/enums.js";

const body = z.object({
	name: z.string(),
	price: z.number().optional(),
	type: z.enum(["CLOTHES", "SHOE", "HAT", "PERFUME", "BAG"]),
	features: z.string(),
});

type bodyType = z.infer<typeof body>;

export const productsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/",
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ["PRODUCTS"],
				summary: "get products",
				response: {
					200: ProductSchema.array(),
					500: z.object({
						error: z.string(),
					}),
				},
			},
		},
		async (req, reply) => {
			try {
				const products = await prisma.product.findMany({
					select: {
						id: true,
						data: true,
						imageUrl: true,
						isReserved: true,
						likes: true,
						name: true,
						price: true,
						type: true,
					},
				});

				reply.status(200).send(products);
			} catch (prismaError) {
				console.error(prismaError);
				reply
					.status(500)
					.send({ error: "Unable to criate product. Try again later." });
			}
		},
	);

	app.post(
		"/",
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ["PRODUCTS"],
				summary: "create a product",
				response: {
					200: z.object({
						message: z.string(),
					}),
					400: z.object({
						error: z.string(),
					}),
					500: z.object({
						error: z.string(),
					}),
				},
			},
		},
		async (req, reply) => {
			// return the first file found
			const data = await req.file({
				limits: {
					fileSize: 4000000,
				},
			});

			if (!data)
				return reply.code(400).send({ error: "Nenhum arquivo enviado" });

			// helper to extract the field value from Multipart | Multipart[] | MultipartFile variants
			const getFieldValue = (field: any): any => {
				if (!field) return null;
				const value = Array.isArray(field) ? field[0] : field;
				if (value && typeof value === "object" && "value" in value)
					return (value as any).value;
				return value;
			};

			const features = getFieldValue(data.fields.features);
			const name = getFieldValue(data.fields.name);
			const type = getFieldValue(data.fields.type);
			const price = getFieldValue(data.fields.price);

			try {
				// SHARP PROCESS
				const processedBuffer = await sharp(await data.toBuffer())
					.resize(800) // Width of 800px (proportional height)
					.webp({ quality: 80 }) // converts to .webp and set the quality of 80
					.toBuffer();

				// FIREBASE UPLOAD
				const fileName = `produtos/${Date.now()}-${data.filename}.webp`;

				const imageRef = ref(storage, fileName);

				uploadBytes(imageRef, processedBuffer, {
					customMetadata: {
						/**TODO: add image metadata */
					},
				})
					.then(async (snapshot) => {
						try {
							// PRISMA PRODUCT CREATION
							const featuresJson = JSON.parse(features);

							await prisma.product.create({
								data: {
									data: featuresJson,
									imageUrl: `https://firebasestorage.googleapis.com/v0/b/grand-eva-modas.firebasestorage.app/o/produtos%2F${snapshot.metadata.name}?alt=media`,
									price: price,
									type: type,
									name: name,
								},
							});
							return reply
								.status(200)
								.send({ message: "Produto criado com sucesso!" });
						} catch (prismaError) {
							console.error(
								"Failed to create product. Initializing image rollback",
							);
							deleteObject(imageRef)
								.then(() => {
									return reply
										.code(500)
										.send({ error: "Não foi possível criar este produto" });
								})
								.catch((e) => {
									console.error(`Não foi possível deletar a imagem: ${e}`);
									return reply
										.code(500)
										.send({ error: "Não foi possível deletar a imagem" });
								});
						}
					})
					.catch((e) => {
						return reply
							.code(500)
							.send({ error: "Não foi possível fazer o upload da sua imagem" });
					});
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ error: "Erro ao processar imagem" });
			}
		},
	);

	app.delete("/", {}, async (req, res) => {
		await prisma.product.deleteMany({});
	});
};
