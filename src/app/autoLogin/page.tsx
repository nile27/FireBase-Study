"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebaseConfig"; // firebase 설정 파일에서 가져옵니다.

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navi = useRouter();

  const handleSignIn = async () => {
    try {
      const persistence = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("로그인 성공");
      navi.push("/loginAuto");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <div>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        <label>자동 로그인</label>
      </div>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default SignIn;
