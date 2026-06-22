import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'mock@creatorverse.ai' },
    update: {},
    create: {
      name: 'Mock Creator',
      email: 'mock@creatorverse.ai',
      creatorProfile: {
        create: {
          niche: 'AI Education',
          contentStyle: 'Professional',
          expertise: 'AI Tools & Strategy',
          personality: 'Analytical',
          audienceType: 'Students & Professionals'
        }
      }
    }
  })

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: user.id }
  });

  if (profile) {
    await prisma.audiencePersona.createMany({
      data: [
        {
          creatorProfileId: profile.id,
          name: 'Student Persona',
          goals: JSON.stringify(['Get Job', 'Learn AI']),
          painPoints: JSON.stringify(['Interview Anxiety', 'Lack of experience'])
        },
        {
          creatorProfileId: profile.id,
          name: 'Professional Persona',
          goals: JSON.stringify(['Upskill', 'Increase Salary']),
          painPoints: JSON.stringify(['Time constraints', 'Fast changing tech'])
        }
      ]
    })

    await prisma.opportunity.createMany({
      data: [
        {
          creatorProfileId: profile.id,
          title: 'AI Interview Course',
          description: 'A comprehensive guide to cracking AI interviews',
          demandScore: 92,
          type: 'course'
        },
        {
          creatorProfileId: profile.id,
          title: 'Community Membership',
          description: 'Exclusive discord for AI enthusiasts',
          demandScore: 85,
          type: 'community'
        }
      ]
    })
  }
  
  console.log('Database seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
