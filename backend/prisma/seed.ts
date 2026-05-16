import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main() {
  const senhaHash = await bcrypt.hash('admin123', 10)
  await prisma.usuario.upsert({
    where: { email: 'admin@ufpe.br' },
    update: {},
    create: {
      nome: 'Coordenador UFPE',
      email: 'admin@ufpe.br',
      senha: senhaHash,
      perfil: 'ADMIN',
      nacionalidade: 'Brasileira'
    }
  })

  console.log('Admin criado com sucesso!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())