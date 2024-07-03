"use client";
import { useState, ChangeEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "./firebase/firebaseConfig";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [data, setData] = useState<User | null | undefined>();
  const [getEmail, setGetEmail] = useState();
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

      <img src={data?.photoURL ? data.photoURL : ""} alt="asddsa" />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
