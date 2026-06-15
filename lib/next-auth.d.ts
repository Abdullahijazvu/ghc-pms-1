import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    businessId?: number | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      businessId?: number | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    businessId?: number | null;
  }
}
