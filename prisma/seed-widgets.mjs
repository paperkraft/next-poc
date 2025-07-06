import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Default Widgets
  await prisma.widget.createMany({
    data: [
      {
        key: "TIMETABLE",
        name: "Class Schedule",
        component: "TimetableWidget",
        category: "organization",
        isDefault: true,
      },
      {
        key: "ATTENDANCE",
        name: "Attendance Tracker",
        component: "AttendanceWidget",
        category: "management",
        isDefault: true,
      },
      {
        key: "ASSIGNMENTS",
        name: "Assignments",
        component: "AssignmentsWidget",
        category: "academics",
        isDefault: true,
      },
      {
        key: "GRADES",
        name: "Gradebook",
        component: "GradesWidget",
        category: "academics",
        isDefault: true,
      },
      {
        key: "NOTICES",
        name: "Announcements",
        component: "NoticesWidget",
        category: "communication",
        isDefault: true,
      },
    ],
  });

  console.log("Widgets seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
