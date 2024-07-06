"use client";
import { useState, ChangeEvent, useEffect } from "react";

import { signIn, useSession, getProviders, signOut } from "next-auth/react";

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

  const handleNaverLogin = async () => {
    const handle = await signIn("naver", {
      redirect: false,
    });

    console.log("Kakao login result:", handle);
    console.log(session);
  };

  return (
    <>
      {session ? (
        <>
          <button onClick={() => signOut()}>네이버 로그 아웃</button>
        </>
      ) : (
        <button onClick={handleNaverLogin}>네버 로그인</button>
      )}
    </>
  );
}
