import "dotenv/config";
import { PrismaClient } from '../../prisma/generated/prisma/client.js'

const prisma = new PrismaClient()

export { prisma }