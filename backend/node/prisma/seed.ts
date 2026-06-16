import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "./dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.widget.deleteMany();
  await prisma.widget.createMany({
    data: [
      { name: "alpha", count: 1 },
      { name: "beta", count: 2 },
      { name: "gamma", count: 3 },
    ],
  });
  const total = await prisma.widget.count();
  console.log(`Seeded ${total} widgets.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
