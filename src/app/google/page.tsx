"use client";
import {
  auth,
  provider,
  signInWithRedirect,
  getRedirectResult,
} from "@/app/firebase/firebaseConfig";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // 로그인 성공
          const user = result.user;
          console.log("Logged in user:", user);
          router.push("/"); // 로그인 후 리다이렉트할 페이지
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  }, [router]);

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
