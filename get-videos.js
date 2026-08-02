const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.video.findMany().then((v) => {
	console.log(v);
	process.exit(0);
});
