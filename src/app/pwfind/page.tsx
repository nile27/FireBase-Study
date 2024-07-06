"use client";
import React, { useState } from "react";
import { auth, app } from "../firebase/firebaseConfig";
import firebase from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { sendPasswordResetEmailWithCustomRedirect } from "../lib/sendPasswordResetEmail";
const PasswordResetRequestPage = () => {
  const [email, setEmail] = useState<string>("");
  const [resetRequested, setResetRequested] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetRequest = async (): Promise<void> => {
    try {
      await sendPasswordResetEmailWithCustomRedirect(email);
      setResetRequested(true);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div>
      <h2>비밀번호 재설정 요청</h2>
      {resetRequested ? (
        <p>
          이메일을 통해 비밀번호 재설정 링크를 전송했습니다. 이메일을
          확인해주세요.
        </p>
      ) : (
        <>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handleResetRequest}>재설정 이메일 전송</button>
        </>
      )}
    </div>
  );
};

export default PasswordResetRequestPage;
