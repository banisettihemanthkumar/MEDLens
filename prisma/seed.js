const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding MedLens database with realistic clinical demo data...");
  const { seedDemoData } = require("../src/lib/demo");
  // We can call directly or run seeding
  console.log("Demo seed helper ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
