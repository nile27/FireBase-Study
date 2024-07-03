"use client";
import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const PasswordResetRequestPage = () => {
  const [email, setEmail] = useState("");
  const [resetRequested, setResetRequested] = useState(false);
  const [error, setError] = useState(null);

  const handleResetRequest = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetRequested(true);
    } catch (error: any) {
      setError(error.message);
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
