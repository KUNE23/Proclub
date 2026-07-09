import prisma from '../config/prisma.js'

export const notifyAdmins = async ({ title, message, type = 'INFO', link = null }, client = prisma) => {
  const admins = await client.user.findMany({
    where: {
      role: 'admin',
      isActive: true
    },
    select: { id: true }
  })

  if (admins.length === 0) return

  await client.notification.createMany({
  data: admins.map((admin) => ({
      userId: admin.id,
      title,
      message,
      type,
      link
    }))
  })
}
