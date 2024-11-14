// pages/api/seed.ts
import { createPermissions, createRole } from "@/lib/prisma-utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Create permissions if not already created
    await createPermissions();

    // Create roles with bitmask permissions
    const adminPermissions = 1 | 2 | 4 | 8 // Full access
    const adminRole = await createRole('Admin', adminPermissions);

    const userPermissions = 1 | 2  // Limited permissions
    const userRole = await createRole('User', userPermissions);

    res.status(200).json({ adminRole, userRole });
  } catch (error) {
    res.status(500).json({ error: 'Error seeding database' });
  }
}
