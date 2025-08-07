import { BillingCycle, PrismaClient, TenantType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Masters, SystemAdminMenus, TenantMenus, Widgets } from "./menus";

const prisma = new PrismaClient();
// await bcrypt.hash('SuperAdmin123', 12),

// const hashedSuperAdmin = await bcrypt.hash("105105", 10);

async function main() {
  // 1. Create Roles
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'System super administrator with full access',
        permissionMask: 2147483647 // All permissions
      }
    }),
    prisma.role.create({
      data: {
        name: 'SCHOOL_ADMIN',
        description: 'School administrator with full school access',
        permissionMask: 1073741823
      }
    }),
    prisma.role.create({
      data: {
        name: 'TEACHER',
        description: 'Teaching staff with classroom access',
        permissionMask: 1048575
      }
    }),
    prisma.role.create({
      data: {
        name: 'STUDENT',
        description: 'Student access to their own data',
        permissionMask: 65535
      }
    })
  ]);

  console.log('Created roles:', roles);

  // 2. Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@schoolsystem.com',
      password: await bcrypt.hash('SuperAdmin123', 12),
      userType: 'SYSTEM_ADMIN',
      isActive: true,
      profile: {
        create: {
          firstName: 'System',
          lastName: 'Admin',
          phone: '+1234567890'
        }
      },
      roles: {
        create: {
          roleId: roles.find(r => r.name === 'SUPER_ADMIN')!.id
        }
      }
    },
    include: {
      profile: true,
      roles: true
    }
  });

  console.log('Created super admin:', superAdmin);

  // 3. Create a School
  const school = await prisma.school.create({
    data: {
      slug: 'premier-academy',
      name: 'Premier Academy',
      description: 'A premier educational institution',
      website: 'https://premieracademy.edu',
      establishedYear: 1995,
      contactEmail: 'info@premieracademy.edu',
      contactPhone: '+18005551234',
      address: {
        street: '123 Education Blvd',
        city: 'Metropolis',
        state: 'CA',
        country: 'USA',
        zipCode: '12345'
      },
      isActive: true,
      subscriptionType: 'PREMIUM',
      subscriptionStatus: 'ACTIVE',
      trialStartsAt: new Date(),
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      maxStudents: 1000,
      maxStaff: 100
    }
  });

  console.log('Created school:', school);

  // 4. Create School Admin
  const schoolAdmin = await prisma.user.create({
    data: {
      email: 'admin@premieracademy.edu',
      password: await bcrypt.hash('Admin123', 12),
      userType: 'SCHOOL_ADMIN',
      isActive: true,
      school: {
        connect: { id: school.id }
      },
      profile: {
        create: {
          firstName: 'School',
          lastName: 'Principal',
          phone: '+18005551235'
        }
      },
      roles: {
        create: {
          roleId: roles.find(r => r.name === 'SCHOOL_ADMIN')!.id
        }
      }
    },
    include: {
      profile: true,
      roles: true
    }
  });

  console.log('Created school admin:', schoolAdmin);

  // 5. Create Academic Year
  const currentYear = new Date().getFullYear();
  const academicYear = await prisma.academicYear.create({
    data: {
      name: `${currentYear}-${currentYear + 1}`,
      code: `AY${currentYear}`,
      startDate: new Date(`${currentYear}-09-01`),
      endDate: new Date(`${currentYear + 1}-06-30`),
      isCurrent: true,
      school: {
        connect: { id: school.id }
      }
    }
  });

  console.log('Created academic year:', academicYear);

  // 6. Create Grades (9th to 12th)
  const grades = await Promise.all(
    Array.from({ length: 4 }, (_, i) => i + 9).map(gradeNum =>
      prisma.grade.create({
        data: {
          name: `Grade ${gradeNum}`,
          code: `G${gradeNum}`,
          school: { connect: { id: school.id } },
          academicYear: { connect: { id: academicYear.id } }
        }
      })
    )
  );

  console.log('Created grades:', grades);

  // 7. Create Sections for each Grade (A, B)
  const sections = [];
  for (const grade of grades) {
    for (const sectionName of ['A', 'B']) {
      const section = await prisma.section.create({
        data: {
          name: sectionName,
          grade: { connect: { id: grade.id } }
        }
      });
      sections.push(section);
    }
  }

  console.log('Created sections:', sections);

  // 8. Create Subjects for each Grade
  const subjectNames = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const subjects = [];

  for (const grade of grades) {
    for (const subjectName of subjectNames) {
      const subjectCode = `${subjectName.substring(0, 3).toUpperCase()}${grade.code}`;
      const subject = await prisma.subject.create({
        data: {
          name: `${subjectName} ${grade.name}`,
          code: subjectCode,
          grade: { connect: { id: grade.id } },
          school: { connect: { id: school.id } }
        }
      });
      subjects.push(subject);
    }
  }

  console.log('Created subjects:', subjects);

  // 9. Create Teachers (Staff)
  const teacherData = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@premieracademy.edu',
      staffId: 'T101',
      position: 'Math Teacher',
      isTeacher: true
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sjohnson@premieracademy.edu',
      staffId: 'T102',
      position: 'Science Teacher',
      isTeacher: true
    }
  ];

  const teachers = [];
  for (const [i, teacher] of teacherData.entries()) {
    // Create user account for teacher
    const teacherUser = await prisma.user.create({
      data: {
        email: teacher.email,
        password: await bcrypt.hash(`Teacher123`, 12),
        userType: 'SCHOOL_STAFF',
        isActive: true,
        school: { connect: { id: school.id } },
        profile: {
          create: {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            phone: `+1800555${1000 + i}`
          }
        },
        roles: {
          create: {
            roleId: roles.find(r => r.name === 'TEACHER')!.id
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Create staff record
    const teacherStaff = await prisma.staff.create({
      data: {
        staffId: teacher.staffId,
        profile: { connect: { id: teacherUser.profile!.id } },
        school: { connect: { id: school.id } },
        position: teacher.position,
        isTeacher: teacher.isTeacher,
        user: { connect: { id: teacherUser.id } }
      }
    });

    // Assign subjects to teachers
    const subjectStartIdx = i * (subjects.length / teacherData.length);
    const subjectEndIdx = subjectStartIdx + (subjects.length / teacherData.length);
    for (const subject of subjects.slice(subjectStartIdx, subjectEndIdx)) {
      await prisma.subject.update({
        where: { id: subject.id },
        data: {
          teacher: { connect: { id: teacherStaff.id } }
        }
      });
    }

    // Assign teachers to sections
    const section = sections[i % sections.length];
    await prisma.staff.update({
      where: { id: teacherStaff.id },
      data: {
        sections: { connect: { id: section.id } }
      }
    });

    teachers.push(teacherStaff);
  }

  console.log('Created teachers:', teachers);

  // 10. Create Students with User Accounts
  const studentData = [
    {
      firstName: 'Emma',
      lastName: 'Williams',
      email: 'emma.w@premieracademy.edu',
      studentId: 'S1001',
      gradeIdx: 0,
      sectionIdx: 0
    },
    {
      firstName: 'Noah',
      lastName: 'Brown',
      email: 'noah.b@premieracademy.edu',
      studentId: 'S1002',
      gradeIdx: 0,
      sectionIdx: 1
    },
    {
      firstName: 'Olivia',
      lastName: 'Jones',
      email: 'olivia.j@premieracademy.edu',
      studentId: 'S1003',
      gradeIdx: 1,
      sectionIdx: 0
    },
    {
      firstName: 'Liam',
      lastName: 'Garcia',
      email: 'liam.g@premieracademy.edu',
      studentId: 'S1004',
      gradeIdx: 1,
      sectionIdx: 1
    },
    {
      firstName: 'Ava',
      lastName: 'Miller',
      email: 'ava.m@premieracademy.edu',
      studentId: 'S1005',
      gradeIdx: 2,
      sectionIdx: 0
    }
  ];

  const students = [];
  for (const [i, student] of studentData.entries()) {
    const grade = grades[student.gradeIdx];
    const section = sections[student.sectionIdx + student.gradeIdx * 2];

    // Create user account for student
    const studentUser = await prisma.user.create({
      data: {
        email: student.email,
        password: await bcrypt.hash(`Student123`, 12),
        userType: 'SCHOOL_STUDENT',
        isActive: true,
        school: { connect: { id: school.id } },
        profile: {
          create: {
            firstName: student.firstName,
            lastName: student.lastName,
            dateOfBirth: new Date(2005 + student.gradeIdx, 1, 1),
            phone: `+1800555${2000 + i}`
          }
        },
        roles: {
          create: {
            roleId: roles.find(r => r.name === 'STUDENT')!.id
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Create student record
    const studentRecord = await prisma.student.create({
      data: {
        studentId: student.studentId,
        profile: { connect: { id: studentUser.profile!.id } },
        school: { connect: { id: school.id } },
        grade: { connect: { id: grade.id } },
        section: { connect: { id: section.id } },
        academicYear: { connect: { id: academicYear.id } },
        status: 'ACTIVE',
        user: { connect: { id: studentUser.id } }
      }
    });

    students.push(studentRecord);
  }

  console.log('Created students:', students);

  // 11. Create Enrollments for Students
  for (const student of students) {
    // Get all subjects for student's grade
    const gradeSubjects = await prisma.subject.findMany({
      where: { gradeId: student.gradeId! }
    });

    // Enroll student in all subjects for their grade
    for (const subject of gradeSubjects) {
      await prisma.enrollment.create({
        data: {
          student: { connect: { id: student.id } },
          subject: { connect: { id: subject.id } },
          section: { connect: { id: student.sectionId! } },
          grade: { connect: { id: student.gradeId! } },
          school: { connect: { id: school.id } },
          academicYear: { connect: { id: academicYear.id } },
          status: 'ACTIVE'
        }
      });
    }
  }

  console.log('Created enrollments for all students');

  // 12. Print login credentials for testing
  console.log('\n=== TEST CREDENTIALS ===');
  console.log('Super Admin:', {
    email: 'superadmin@schoolsystem.com',
    password: 'SuperAdmin123!'
  });
  console.log('School Admin:', {
    email: 'admin@premieracademy.edu',
    password: 'SchoolAdmin123!'
  });
  console.log('Teachers:');
  teacherData.forEach((teacher, i) => {
    console.log({
      email: teacher.email,
      password: `Teacher${i + 1}123!`
    });
  });
  console.log('Students:');
  studentData.forEach((student, i) => {
    console.log({
      email: student.email,
      password: `Student${i + 1}123!`
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });