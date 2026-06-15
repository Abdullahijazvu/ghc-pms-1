import Link from 'next/link';
import {
  Building2,
  PanelLeft,
  LayoutDashboard,
  Users,
  Stethoscope,
  Settings,
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { User } from './user';
import Providers from './providers';
import { NavItem } from './nav-item';
import { auth } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role ?? '';

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav role={role} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav role={role} />
            <DashboardBreadcrumb />
            <div className="ml-auto">
              <User />
            </div>
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav({ role }: { role: string }) {
  const isSuperAdmin = role === 'super_admin';
  const isClinicUser = ['business_admin', 'staff'].includes(role);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Building2 className="h-4 w-4" />
          <span className="sr-only">GHC PMS</span>
        </Link>

        {isSuperAdmin && (
          <>
            <NavItem href="/admin/dashboard" label="Dashboard">
              <LayoutDashboard className="h-5 w-5" />
            </NavItem>
            <NavItem href="/admin/businesses" label="Businesses">
              <Building2 className="h-5 w-5" />
            </NavItem>
            <NavItem href="/admin/staff" label="Staff">
              <Users className="h-5 w-5" />
            </NavItem>
            <NavItem href="/clinic/patients" label="Patients">
              <Stethoscope className="h-5 w-5" />
            </NavItem>
          </>
        )}

        {isClinicUser && (
          <>
            <NavItem href="/clinic/dashboard" label="Dashboard">
              <LayoutDashboard className="h-5 w-5" />
            </NavItem>
            <NavItem href="/clinic/patients" label="Patients">
              <Stethoscope className="h-5 w-5" />
            </NavItem>
          </>
        )}

        {role === 'business_admin' && (
          <NavItem href="/clinic/staff" label="Staff">
            <Users className="h-5 w-5" />
          </NavItem>
        )}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav({ role }: { role: string }) {
  const isSuperAdmin = role === 'super_admin';
  const isClinicUser = ['business_admin', 'staff'].includes(role);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Building2 className="h-5 w-5" />
            <span className="sr-only">GHC PMS</span>
          </Link>

          {isSuperAdmin && (
            <>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-4 px-2.5 text-foreground"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/businesses"
                className="flex items-center gap-4 px-2.5 text-foreground"
              >
                <Building2 className="h-5 w-5" />
                Businesses
              </Link>
              <Link
                href="/admin/staff"
                className="flex items-center gap-4 px-2.5 text-foreground"
              >
                <Users className="h-5 w-5" />
                Staff
              </Link>
            </>
          )}

          {isClinicUser && (
            <>
              <Link
                href="/clinic/dashboard"
                className="flex items-center gap-4 px-2.5 text-foreground"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/clinic/patients"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Stethoscope className="h-5 w-5" />
                Patients
              </Link>
            </>
          )}

          {role === 'business_admin' && (
            <Link
              href="/clinic/staff"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Users className="h-5 w-5" />
              Staff
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Home</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
