"use client";
import { useState, useEffect } from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Regi = () => {
  const [email, setEmail] = useState<string>("");
  const sendVerificationEmail = async () => {
    try {
      const response = await fetch("/api/sendVerificationEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  const verifyEmailLink = async () => {
    const isSignInLink = isSignInWithEmailLink(auth, window.location.href);
    if (isSignInLink) {
      const email =
        window.localStorage.getItem("emailForSignIn") ||
        window.prompt("확인을 위해 이메일을 입력해주세요");
      try {
        const response = await fetch("/api/verifyEmailLink", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, link: window.location.href }),
        });
        const data = await response.json();
        if (data.error) {
          console.error(data.error);
        } else {
          await signInWithEmailLink(
            auth,
            email as string,
            window.location.href
          );
          console.log("성공적으로 로그인했습니다!", data.message);
        }
      } catch (error) {
        console.error("이메일 링크 인증 중 오류 발생:", error);
      }
    }
  };

  useEffect(() => {
    verifyEmailLink();
  }, []);

  return (
    <div>
      <h1>Firebase 이메일 인증</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
      />
      <button onClick={sendVerificationEmail}>인증 이메일 보내기</button>
    </div>
  );
};

export default Regi;
