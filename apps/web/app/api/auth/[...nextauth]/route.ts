import bcryptjs from "bcryptjs";
import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import prisma from "../../../../utils/db";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string | null;
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("InvalidCredentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("UserNotFound");
        }

        const passwordMatches = await bcryptjs.compare(
          credentials.password,
          user.password,
        );

        if (!passwordMatches) {
          throw new Error("InvalidCredentials");
        }

        return { id: user.id, email: user.email };
      },
    }),

    GoogleProvider({
      // eslint-disable-next-line turbo/no-undeclared-env-vars -- runtime-only secret
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      // eslint-disable-next-line turbo/no-undeclared-env-vars -- runtime-only secret
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken ?? null;

      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (!user.email) {
          throw new Error("EmailRequired");
        }

        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          const generatedPassword = Math.random().toString(36).slice(2);
          const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              password: hashedPassword,
            },
          });
        }

        token.id = dbUser.id;
      }

      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token ?? token.refreshToken ?? null;
      }

      return token;
    },
    
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  // eslint-disable-next-line turbo/no-undeclared-env-vars -- runtime-only secret
  secret: process.env.NEXTAUTH_SECRET,
  // eslint-disable-next-line turbo/no-undeclared-env-vars -- provided by Next.js
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
