import type { FastifyError } from "fastify";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import sharp from "sharp";
import { z } from "zod";
import { ProductSchema } from "../../prisma/generated/zod/index.js";
import { storage } from "../lib/firebase.js";
import { prisma } from "../lib/prisma.js";
import { prismaErrorHandler } from "../lib/prismaErrorHandler.js";

const MongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const paramsSchema = z.object({
	productId: MongoIdSchema,
});

export const productsRoute: FastifyPluginAsyncZod = async (app) => {
	app.setErrorHandler((error: FastifyError, _, reply) => {
		if (error.validation) {
			console.log(error);

			reply.status(400).send({
				error: error.message,
			});
		}
	});

	// get all products
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
		async (_, reply) => {
			try {
				const products = await prisma.product.findMany({
					select: {
						id: true,
						data: true,
						imageUrl: true,
						imageName: true,
						isReserved: true,
						likes: true,
						name: true,
						price: true,
						type: true,
					},
				});

				reply.status(200).send(products);
			} catch (e) {
				prismaErrorHandler(reply, e);
			}
		},
	);

	// create a product
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
									imageName: fileName,
									imageUrl: `https://firebasestorage.googleapis.com/v0/b/grand-eva-modas.firebasestorage.app/o/produtos%2F${snapshot.metadata.name}?alt=media`,
									price: price,
									type: type,
									name: name,
								},
							});
							return reply
								.status(200)
								.send({ message: "Produto criado com sucesso!" });
						} catch (_e) {
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

	// delete all products
	// TODO: REFACTORY
	// delete all product records
	app.delete("/", {}, async (req, res) => {
		await prisma.product.deleteMany({});
	});

	// delete a single product
	app.delete(
		"/:id",
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ["PRODUCTS"],
				params: z.object({
					id: z.string(),
				}),
			},
		},
		async (req, reply) => {
			const { id } = req.params;

			const parsedId = z.parse(z.string(), id); //TODO: Verify if is a valid ID

			try {
				const product = await prisma.product.delete({
					where: {
						id: parsedId,
					},
					select: {
						imageName: true,
					},
				});

				const imageRef = ref(storage, product.imageName);

				deleteObject(imageRef)
					.then(() => {
						return reply.status(200).send();
					})
					.catch((error) => {
						// Uh-oh, an error occurred!
						console.log(error);
						return reply
							.status(500)
							.send("Um erro ocorreu ao deletar a imagem");
					});
			} catch (e) {
				prismaErrorHandler(reply, e);
			}
		},
	);

	// like a product
	app.patch(
		"/:productId/like",
		{
			preHandler: [app.authenticate],
			schema: {
				params: paramsSchema,
			},
		},
		async (req, reply) => {
			const { userId } = req.user;
			const params = paramsSchema.safeParse(req.params);

			// TODO: ADD const isValid = ObjectId.isValid("productId"); (from mongodb package)
			if (!params.success)
				return reply.status(400).send({
					error: params.error,
				});

			const user = await prisma.user
				.findUnique({
					where: {
						id: userId,
					},
					select: {
						likedProducts: true,
					},
				})
				.catch((prismaError) => {
					console.log(prismaError);
					return reply.status(500).send("Unable to find user");
				});

			if (!user)
				return reply.status(500).send({ error: "Unable to find user." });

			const isProductAlreadyLiked = user.likedProducts.indexOf(
				params.data.productId,
			);

			if (isProductAlreadyLiked !== -1)
				return reply.status(200).send({ message: "Product already liked" });

			try {
				//transaction
				await prisma.$transaction(async (tx) => {
					await tx.product.update({
						where: {
							id: params.data.productId,
						},
						data: {
							likes: {
								increment: 1,
							},
						},
					});

					await tx.user.update({
						where: {
							id: userId,
						},
						data: {
							likedProducts: {
								push: params.data.productId,
							},
						},
					});
				});

				return reply.status(200).send();
			} catch (e) {
				prismaErrorHandler(reply, e);
			}
		},
	);

	// reserve a product
	app.patch(
		"/:productId/reserve",
		{
			preHandler: [app.authenticate],
			schema: {
				params: paramsSchema,
			},
		},
		async (req, reply) => {
			const { userId } = req.user;
			const params = paramsSchema.safeParse(req.params);

			// TODO: ADD const isValid = ObjectId.isValid("productId"); (from mongodb package)
			if (!params.success)
				return reply.status(400).send({
					error: params.error,
				});

			const user = await prisma.user
				.findUnique({
					where: {
						id: userId,
					},
					select: {
						reservedProducts: true,
					},
				})
				.catch((prismaError) => {
					console.log(prismaError);
					return reply.status(500).send("Unable to find user");
				});

			if (!user)
				return reply.status(500).send({ error: "Unable to find user." });

			const isProductAlreadyReserved = user.reservedProducts.indexOf(
				params.data.productId,
			);

			if (isProductAlreadyReserved !== -1)
				return reply.status(200).send({ message: "Product already reserved" });

			try {
				await prisma.product.update({
					where: {
						id: params.data.productId,
					},
					data: {
						isReserved: {
							set: false,
						},
					},
				});

				await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						likedProducts: {
							push: params.data.productId,
						},
					},
				});

				return reply.status(200).send();
			} catch (e) {
				prismaErrorHandler(reply, e);
			}
		},
	);
};
