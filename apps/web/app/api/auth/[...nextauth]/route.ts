import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma  from "../../../../utils/db"
import bcryptjs from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        const user = await prisma.user.findUnique({ where: { email: credentials?.email } });

        if (!user) {
          throw new Error("UserNotFound");
        }

        if (user && credentials?.password && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email
          };
        }
        else {
          throw new Error("InvalidCredentials");
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

  ],

  pages: {
    signIn: "/login", // Custom login page
    error: "/login"   // Redirect to login on error
  },

  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken || null;
      }
      return session;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        let dbUser = await prisma.user.findUnique({ where: { email: user.email } });

        if (!dbUser) {
          const salt = await bcryptjs.genSalt(10)
          const hashedPassword = await bcryptjs.hash(user.password || Math.random().toString(36).slice(-8), salt)
          dbUser = await prisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              password: hashedPassword,
            }
          });
        }

        token.id = dbUser.id;
      }

      // 🆕 Save Google tokens
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      return token;
    },
    async redirect({ url, baseUrl }: any) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }