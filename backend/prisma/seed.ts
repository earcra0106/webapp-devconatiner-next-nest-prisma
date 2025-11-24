import { prisma } from '../lib/prisma.js';
async function main() {
  // Clear existing data
  await prisma.pomodoroNoteStat.deleteMany();
  await prisma.pomodoroSession.deleteMany();
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      password: 'alicepassword',
      notes: {
        
      },
    },
  });

  const aliceNote1 = await prisma.note.create({
    data: {
      authorId: alice.id,
      title: 'note1',
      content: 'content1',
    },
  });

  const aliceNote2 = await prisma.note.create({
    data: {
      authorId: alice.id,
      title: 'note2',
      content: 'content2',
    },
  });

  const alicePomodoroSession1 = await prisma.pomodoroSession.create({
    data: {
      userId: alice.id,
      duration: 25,
      startedAt: new Date(),
      endedAt: new Date(new Date().getTime() + 25 * 60000),
      charaCount: 1000,
      pomodoroNoteStats: {
        create: [
          {
            noteId: aliceNote1.id,
            charaCount: 600,
          },
          {
            noteId: aliceNote2.id,
            charaCount: 400,
          },
        ],
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      password: 'bobpassword',
      notes: {
        create: [
          {
            title: 'ノート1',
            content: '本文1',
          },
          {
            title: 'ノート2',
            content: '本文2',
          },
        ],
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })