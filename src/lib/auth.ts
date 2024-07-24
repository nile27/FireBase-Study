import { NextAuthOptions, User, DefaultSession } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import { JWT } from "next-auth/jwt";
import { adminauth as adminAuth } from "@/app/firebase/firebaseAdmin";
import { firestore } from "@/app/firebase/firebaseConfig";
import { Timestamp } from "firebase-admin/firestore";
import {
  collection,
  query,
  getDocs,
  getDoc,
  where,
  doc,
} from "firebase/firestore";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    birth?: string;
    nickname?: string;
    profile_image?: string;
    firebaseToken?: string;
    phone?: string;
    createTime?: Timestamp;
    stock?: string[];
    logintype?: string;
    language: string;
    isNewUser?: boolean;
  }
}
declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email?: string;
    birth?: string;
    nickname?: string;
    logintype?: string;
    language?: string;
    profile_image?: string;
  }
  interface Session {
    isNewUser?: boolean;
    user: {
      id?: string;
      name?: string;
      email?: string;
      birth?: string;
      nickname?: string;
      profile_image?: string;
      firebaseToken?: string;
      phone?: string;
      language: string;
      createTime?: Timestamp;
      stock?: string[];
      logintype?: string;
    } & DefaultSession["user"];
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.response.id,
          name: profile.response.name,
          email: profile.response.email,
          birth: "",
          profile_image: profile.response.profile_image,
          logintype: "naver",
        };
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_REST_API as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,

      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.kakao_account.profile.nickname,
          email: profile.kakao_account.email,
          birth: "",
          profile_image: profile.kakao_account.profile.profile_image_url,
          logintype: "kakao",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1,
  },
  callbacks: {
    async signIn({ user }: { user: User }) {
      try {
        if (user && user.email) {
          const usersCollectionRef = collection(firestore, "users");
          const q = query(usersCollectionRef, where("email", "==", user.email));
          const userDocSnap = await getDocs(q);

          if (userDocSnap.empty) {
            throw Error("no user");
          }

          return true;
        }
      } catch (err: any) {
        const redirectPath = `/signup?type=${encodeURIComponent(
          user.logintype || ""
        )}&name=${encodeURIComponent(
          user.name || ""
        )}&email=${encodeURIComponent(
          user.email || ""
        )}&profile_image=${encodeURIComponent(user.profile_image || "")}`;

        return redirectPath;
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        console.log("jwttuser", user);
        token.id = "";
        token.name = user.name;
        token.email = user.email;
        token.birth = "";
        token.phone = "";
        token.nickname = "";
        token.stock = [];
        token.logintype = user.logintype;
        token.language = "KO";
        token.profile_image = user.profile_image;
        token.isNewUser = false;

        try {
          const existUser = await adminAuth.getUserByEmail(
            user.email as string
          );

          if (existUser) {
            const userRef = doc(firestore, "users", existUser.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            const customToken = await adminAuth.createCustomToken(userDoc.id);
            console.log(userDoc.id);
            if (userData) {
              token.id = userData.userId;
              token.name = userData.name;
              token.email = userData.email;
              token.birth = userData.birth;
              token.phone = userData.phone;
              token.createTime = userData.createTime;
              token.nickname = userData.nickname;
              token.stock = userData.stock;
              token.logintype = userData.logintype;
              token.language = userData.language;
              token.profile_image = existUser.photoURL;
              token.isNewUser = false;
              token.firebaseToken = customToken;
              return token;
            }
          }
        } catch (error: any) {
          console.log("jwt", error);
          token.isNewUser = true;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        birth: token.birth,
        language: token.language,
        firebaseToken: token.firebaseToken,
        profile_image: token.profile_image,
        phone: token.phone,
        createTime: token.createTime,
        nickname: token.nickname,
        stock: token.stock,
        logintype: token.logintype,
      };

      session.isNewUser = token.isNewUser ? true : false;

      return session;
    },
  },
};
