import NextAuth, { NextAuthOptions } from "next-auth";
import { prisma } from "../../../lib/prisma";
import GoogleProvider from "next-auth/providers/google";


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile}){
        if(!profile?.email){
          throw new Error("No profile provided")
        }
        const user = await prisma.users.findUnique({
          where: {
            email: profile.email
          }
        })
        return user ? true : false
    }
  },
};

export default authOptions;