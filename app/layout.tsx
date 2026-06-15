import './globals.css';

export const metadata = {
  title: 'GHC PMS - Patient Management System',
  description: 'Multi-tenant patient management system for clinics.',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">{children}</body>
    </html>
  );
}
