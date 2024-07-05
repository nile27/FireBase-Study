"use client";
import { useState, ChangeEvent, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { signIn, useSession, getProviders, signOut } from "next-auth/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { SessionProvider } from "next-auth/react";
export default function Login() {
  const { data: session } = useSession();
  const [data, setData] = useState();
  // useEffect(() => {
  //   // const script = document.createElement("script");
  //   // script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
  //   // script.onload = () => {
  //   //   window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
  //   //   console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
  //   // };
  //   // document.head.appendChild(script);
  //   // (async () => {
  //   //   const res: any = await getProviders();
  //   //   console.log(res);
  //   // })();

  //   console.log(session);
  // }, []);

  const handleKakaoLogin = async () => {
    const handle = await signIn("kakao", {
      redirect: false,
    });

    console.log("Kakao login result:", handle);
    console.log(session);
  };

  return (
    <>
      {session ? (
        <>
          <button onClick={() => signOut()}>Kakao 로그 아웃</button>
        </>
      ) : (
        <button onClick={handleKakaoLogin}>Kakao 로그인</button>
      )}
    </>
  );
}
