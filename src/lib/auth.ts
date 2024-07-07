import { NextAuthOptions, User, DefaultSession } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import { updateProfile } from "firebase/auth";
import { JWT } from "next-auth/jwt";
import { auth, db } from "../app/firebaseAdming";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    birth?: string;
    nickname?: string;
    profile_image?: string;
    firebaseToken?: string;
  }
}
declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email?: string;
    birth?: string;
    nickname?: string;
    profile_image?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      birth?: string;
      nickname?: string;
      profile_image?: string;
      firebaseToken?: string;
    } & DefaultSession["user"];
  }
}

// export const authConfig: NextAuthOptions = {
//   providers: [
//     NaverProvider({
//       clientId: process.env.NAVER_CLIENT_ID as string,
//       clientSecret: process.env.NAVER_CLIENT_SECRET as string,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       return { ...token, ...user };
//     },

//     async session({ session, token }) {
//       session.user = token as any;
//       console.log("sesson:", session);
//       return session;
//     },
//   },
// };

export const authConfig: NextAuthOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string,
      profile(profile) {
        // console.log("Naver profile data:", profile);
        return {
          id: profile.response.id,
          name: profile.response.name,
          email: profile.response.email,
          birth: profile.response.birthyear + profile.response.birthday,
          profile_image: profile.response.profile_image,
        };
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_REST_API as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      profile(profile) {
        console.log(profile);
        return {
          id: profile.id.toString(),
          name: profile.kakao_account.profile.nickname,
          email: profile.kakao_account.email,
          birth: "991231",
          profile_image: profile.kakao_account.profile.profile_image_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.birth = user.birth;

        token.profile_image = user.profile_image;
        const firebaseToken = await auth.createCustomToken(user.id, {
          name: user.name,
          email: user.email,
          birth: user.birth,
          profile_image: user.profile_image,
        });

        token.firebaseToken = firebaseToken;
        const userDoc = db.collection("users").doc(user.id);
        const userSnapshot = await userDoc.get();
        if (!userSnapshot.exists) {
          await userDoc.set({
            id: user.id,
            name: user.name,
            email: user.email,
            birth: user.birth,
            profile_image: user.profile_image,
          });
        }
        try {
          await auth.getUser(user.id);
        } catch (error: any) {
          if (error.code === "auth/user-not-found") {
            await auth.createUser({
              uid: user.id,
              email: user.email,
              displayName: user.name,
              photoURL: user.profile_image,
            });
          } else {
            throw error;
          }
        }

        await auth.updateUser(user.id, {
          displayName: user.name,
          email: user.email,
          photoURL: user.profile_image,
        });
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        birth: token.birth,
        firebaseToken: token.firebaseToken,
        profile_image: token.profile_image,
      };
      // console.log("session:", session);
      return session;
    },
  },
};
