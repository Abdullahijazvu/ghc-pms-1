import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    const role = session.user.role;
    if (role === 'super_admin') redirect('/admin/dashboard');
    if (role === 'business_admin') redirect('/clinic/dashboard');
    redirect('/clinic/patients');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-foreground/5 via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-foreground/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          Multi-tenant clinic management platform
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Patient{' '}
          <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Management
          </span>{' '}
          System
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Manage patients, track diagnoses with interactive body maps, and streamline your clinic workflow — all in one secure platform.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-8 text-sm font-medium text-background shadow-lg shadow-foreground/25 transition-all hover:shadow-xl hover:shadow-foreground/30 hover:bg-foreground/90 active:scale-[0.97]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:shadow-md active:scale-[0.97]"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} GHC PMS. All rights reserved.
      </footer>
    </div>
  );
}
