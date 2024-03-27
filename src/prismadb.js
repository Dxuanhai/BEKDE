import { PrismaClient } from "@prisma/client";

export default prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;
