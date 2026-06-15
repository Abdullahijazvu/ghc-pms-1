import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { businesses } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { BusinessForm } from '../../../../business-form';

export const dynamic = 'force-dynamic';

export default async function EditBusinessPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const session = await auth();
  if (!session?.user) return notFound();

  const [business] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.id, Number(id)))
    .limit(1);

  if (!business) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <BusinessForm business={business} />
    </div>
  );
}
