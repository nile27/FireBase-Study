// import NextAuth from "next-auth";
// import { NextAuthOptions } from "next-auth";
// import KakaoProvider from "next-auth/providers/kakao";
// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface User {
//     id: string;
//   }

//   interface Session extends DefaultSession {
//     user?: User;
//     accessToken: any;
//   }
// }
// export const authOptions: NextAuthOptions = {
//   providers: [
//     KakaoProvider({
//       clientId: process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY!,
//       clientSecret: process.env.KAKAO_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.accessToken = token.accessToken;
//       }
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// import KakaoProvider from "next-auth/providers/kakao";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. "Sign in with...")
//       name: "Credentials",
//       // `credentials` is used to generate a form on the sign in page.
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       // You can pass any HTML attribute to the <input> tag through the object.
//       credentials: {
//         username: {
//           label: "이메일",
//           type: "text",
//           placeholder: "이메일 주소 입력 요망",
//         },
//         password: { label: "비밀번호", type: "password" },
//       },

//       async authorize(credentials, req) {
//         const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username: credentials?.username,
//             password: credentials?.password,
//           }),
//         });
//         const user = await res.json();
//         console.log(user);

//         if (user) {
//           // Any object returned will be saved in `user` property of the JWT
//           return user;
//         } else {
//           // If you return null then an error will be displayed advising the user to check their details.
//           return null;

//           // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//         }
//       },
//     }),
//     KakaoProvider({
//       clientId: process.env.KAKAO_CLIENT_ID!,
//       clientSecret: process.env.KAKAO_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       return { ...token, ...user };
//     },

//     async session({ session, token }) {
//       session.user = token as any;
//       return session;
//     },
//   },

//   // 이 부분은 잠시만 주석처리 하겠습니다.
//   // 강의 마지막 부분에 다시 논의하겠습니다.
//   // pages: {
//   //   signIn: "/signin",
//   // },
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { Session, DefaultSession } from "next-auth";

interface User {
  id: string;
  email?: string; // 이메일은 있을 수도 있고 없을 수도 있으므로 옵셔널로 정의
  // 필요에 따라 다른 사용자 정보 추가
}

// next-auth 모듈의 세션 타입을 확장하여 사용자 정보를 포함시킴
declare module "next-auth" {
  interface Session {
    user: User;
  }
}

export const authOptions = {
  secret:
    "8C0zN61_8VR6ZVGmv2T7N8J3zQ3OJc2DDcXexQb2Qeo5eFh0-2tcddFf8B6cQ4zhzFRK44SSP0wI_9-BOIiW4A",
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_REST_API!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: any;
      user: User;
    }) {
      if (user) {
        session.user = {
          id: user.id.toString(),
          email: user.email ?? "",
          // 필요한 사용자 정보 추가
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
console.log("sadasldkhjaslkjdlkasjd");
export { handler as GET, handler as POST };
