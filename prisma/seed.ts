import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  const admins = [
    { id: "admin1", username: "principal", name: "John Doe" },
    { id: "admin2", username: "vice_principal", name: "Jane Smith" },
  ];
  await prisma.admin.createMany({ data: admins });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({ data: { level: i } });
  }

  // CLASS
  const sections = ["A", "B"];
  for (let i = 1; i <= 6; i++) {
    for (const section of sections) {
      await prisma.class.create({
        data: {
          name: `${i}${section}`,
          gradeId: i,
          capacity: Math.floor(Math.random() * (25 - 18 + 1)) + 18,
        },
      });
    }
  }

  // SUBJECT
  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
  ];
  await prisma.subject.createMany({
    data: subjects.map((name) => ({ name })),
  });

  // TEACHER
  const teacherNames = ["Alice", "Bob", "Charlie", "David", "Eve"];
  for (let i = 1; i <= 10; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `t_${teacherNames[i % 5].toLowerCase()}${i}`,
        name: teacherNames[i % 5],
        surname: `Surname${i}`,
        email: `teacher${i}@school.com`,
        phone: `+977-98412${10000 + i}`,
        address: `City ${i}`,
        bloodType: i % 2 === 0 ? "A+" : "B-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % subjects.length) + 1 }] },
        classes: { connect: [{ id: (i % 12) + 1 }] },
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - (30 + i))
        ),
      },
    });
  }

  // LESSON
  const lessonTopics = [
    "Algebra Basics",
    "Newton’s Laws",
    "Shakespeare's Works",
    "Climate Change",
    "World War II",
    "DNA and Genetics",
    "Computer Algorithms",
    "Modern Art",
    "Periodic Table",
    "Quantum Physics",
  ];
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: lessonTopics[i % lessonTopics.length],
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ],
        startTime: new Date(new Date().setHours(9 + (i % 3), 0, 0)),
        endTime: new Date(new Date().setHours(11 + (i % 3), 0, 0)),
        subjectId: (i % subjects.length) + 1,
        classId: (i % 12) + 1,
        teacherId: `teacher${(i % 10) + 1}`,
      },
    });
  }

  // PARENT
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parent${i}`,
        username: `p_${i}`,
        name: `ParentName${i}`,
        surname: `ParentSurname${i}`,
        email: `parent${i}@mail.com`,
        phone: `+977-9818${10000 + i}`,
        address: `Neighborhood ${i}`,
      },
    });
  }

  // STUDENT
  const studentNames = ["Aarav", "Sita", "Hari", "Priya", "Rohan"];
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `s_${studentNames[i % 5].toLowerCase()}${i}`,
        name: studentNames[i % 5],
        surname: `S${i}`,
        email: `student${i}@school.com`,
        phone: `+977-9808${10000 + i}`,
        address: `Street ${i}`,
        bloodType: i % 2 === 0 ? "O+" : "AB-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parent${Math.ceil(i / 2)}`,
        gradeId: (i % 6) + 1,
        classId: (i % 12) + 1,
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - (10 + (i % 5)))
        ),
      },
    });
  }

  // ATTENDANCE
  // Create attendance records for the last 2 weeks
  const students = await prisma.student.findMany();
  const lessons = await prisma.lesson.findMany();

  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);

  const attendanceRecords = [];

  // For each day in the last 2 weeks
  for (let d = new Date(twoWeeksAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();

    // Skip Saturday (6) as it's not a working day in Nepal
    if (dayOfWeek !== 6) {
      // For each lesson on this day
      for (const lesson of lessons) {
        const lessonDay = Object.keys(Day)[dayOfWeek];

        // Only create attendance if lesson day matches current day
        if (lesson.day === lessonDay) {
          // For each student in the lesson's class
          for (const student of students.filter(
            (s) => s.classId === lesson.classId
          )) {
            // 90% chance of being present
            const present = Math.random() < 0.9;

            attendanceRecords.push({
              date: new Date(d),
              present,
              studentId: student.id,
              lessonId: lesson.id,
            });
          }
        }
      }
    }
  }

  await prisma.attendance.createMany({
    data: attendanceRecords,
  });

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
