import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

type LocalUser = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
};

// Demo in-memory users. Replace with a proper data source in production.
const USERS: LocalUser[] = [
  {
    id: "user-demo-001",
    username: "demo",
    password: "shopsecure",
    name: "Demo Shopper",
    email: "demo@example.com",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        password: { label: "Password", type: "password", placeholder: "shopsecure" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const matched = USERS.find(
          (user) => user.username.toLowerCase() === credentials.username?.toLowerCase(),
        );

        if (!matched) {
          return null;
        }

        if (matched.password !== credentials.password) {
          return null;
        }

        return {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          username: matched.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.username = (user as { username?: string }).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? "";
        session.user.username = (token.username as string) ?? session.user.email ?? "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "local-dev-secret",
};
