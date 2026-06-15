import { db } from '@/lib/db';
import { users, businesses, bodyPointConfig } from '@/lib/schema';
import { getDefaultBodyPoints } from '@/lib/body-points-defaults';
import { imageConfigs } from '@/lib/body-points-defaults';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.delete(businesses);
    await db.delete(users);

    const password = await bcrypt.hash('password123', 12);

    const [superAdmin] = await db.insert(users).values({
      name: 'Super Admin',
      email: 'admin@clinic.com',
      password,
      role: 'super_admin',
    });

    const superAdminId = Number(superAdmin.insertId);

    const businessData = [
      {
        name: 'Sunrise Wellness Clinic',
        description: 'A holistic wellness center offering chiropractic care, physiotherapy, and massage therapy.',
        address: '123 Health Avenue, Suite 100, New York, NY 10001',
        phone: '+1-212-555-0100',
        email: 'info@sunrisewellness.com',
      },
      {
        name: 'Downtown Medical Center',
        description: 'Multi-specialty clinic serving the downtown community with modern diagnostic facilities.',
        address: '456 Medical Plaza, Floor 3, New York, NY 10002',
        phone: '+1-212-555-0200',
        email: 'contact@downtownmed.com',
      },
      {
        name: 'Pediatric Care Partners',
        description: 'Dedicated children\'s clinic specializing in pediatric primary care and developmental screenings.',
        address: '789 Child Street, Building B, New York, NY 10003',
        phone: '+1-212-555-0300',
        email: 'hello@pediatricpartners.com',
      },
    ];

    const clinics = [
      { adminName: 'Sarah Johnson', adminEmail: 'sarah@sunrise.com', ...businessData[0] },
      { adminName: 'Michael Chen', adminEmail: 'michael@downtownmed.com', ...businessData[1] },
      { adminName: 'Emily Davis', adminEmail: 'emily@pediatric.com', ...businessData[2] },
    ];

    for (const clinic of clinics) {
      const [business] = await db.insert(businesses).values({
        name: clinic.name,
        description: clinic.description,
        address: clinic.address,
        phone: clinic.phone,
        email: clinic.email,
        userId: superAdminId,
      });

      const businessId = Number(business.insertId);

      await db.insert(users).values({
        name: clinic.adminName,
        email: clinic.adminEmail,
        password,
        role: 'business_admin',
        businessId,
      });

      await db.insert(users).values({
        name: `${clinic.adminName} - Staff`,
        email: `staff.${clinic.adminEmail}`,
        password,
        role: 'staff',
        businessId,
      });


    }

    await db.delete(bodyPointConfig);
    for (const imageKey of Object.keys(imageConfigs)) {
      await db.insert(bodyPointConfig).values({
        imageKey,
        points: JSON.stringify(getDefaultBodyPoints(imageKey)),
      });
    }

    return Response.json({
      message: 'Seed successful',
      accounts: [
        { role: 'super_admin', email: 'admin@clinic.com', password: 'password123' },
        { role: 'business_admin', email: 'sarah@sunrise.com', password: 'password123' },
        { role: 'business_admin', email: 'michael@downtownmed.com', password: 'password123' },
        { role: 'business_admin', email: 'emily@pediatric.com', password: 'password123' },
      ],
    });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: 'Seed failed' }, { status: 500 });
  }
}
