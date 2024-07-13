"use client";
import { useState, ChangeEvent, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, firestore } from "./firebase/firebaseConfig";
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

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [data, setData] = useState<User | null | undefined>();
  const [providers, setProviders] = useState(null);
  const [goo, setGoo] = useState<string | null>("");

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const getUserEmailByUserId = async (userId: string) => {
    try {
      // Firestore에서 users 컬렉션에서 userId 필드가 userId인 문서 조회
      // const userDocRef = doc(
      //   firestore,
      //   "users",
      //   "UsnYz9q1QHZtnbFJCsg8C3FNiRE2"
      // );
      const usersCollectionRef = collection(firestore, "users");
      const q = query(usersCollectionRef, where("userId", "==", userId));
      const userDocSnap = await getDocs(q);
      console.log(userDocSnap.docs[0].data());
      if (!userDocSnap.empty) {
        // 사용자 문서가 존재하면 첫 번째 문서의 이메일 필드 값을 반환
        const userDoc = userDocSnap.docs[0];
        console.log(userDoc.data().email);
        return userDoc.data().email;
      } else {
        console.log("사용자 문서가 존재하지 않습니다.");
        return null;
      }
    } catch (error) {
      console.error(
        "Firestore에서 사용자 정보를 가져오는 중 오류 발생:",
        error
      );
      throw error;
    }
  };

  const handleLogin = async () => {
    try {
      const userEmail = await getUserEmailByUserId(email);
      console.log(userEmail);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      const user = userCredential.user;

      setData(user);
      console.log("Login successful:", data);
      // 로그인 성공 후 리다이렉션 또는 다른 작업 수행
    } catch (error) {
      console.error("Error logging in:", error);
      // 에러 처리 로직 추가
    }
  };

  const google = async () => {
    const provider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, provider);
    if (data.user) {
      setGoo(data.user.photoURL);
    }

    console.log(data);
  };

  useEffect(() => {
    // const script = document.createElement("script");
    // script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    // script.onload = () => {
    //   window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
    //   console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
    // };
    // document.head.appendChild(script);
    (async () => {
      const res: any = await getProviders();
      console.log(res);
      setProviders(res);
    })();
  }, []);

  const handleKakaoLogin = async () => {
    const handle = await signIn("kakao", {
      redirect: true,
      callbackUrl: "/",
    });

    console.log("Kakao login result:", handle);
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChangeEmail}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChangePassword}
      />

      <img src={goo ? goo : ""} alt="asddsa" />

      <button onClick={handleLogin}>Login</button>

      <button onClick={google}>google login</button>
      <div>
        <button onClick={handleKakaoLogin}>Kakao 로그인</button>
        <button onClick={() => signOut()}>Kakao 로그 아웃</button>
      </div>
    </div>
  );
};

export default LoginPage;
