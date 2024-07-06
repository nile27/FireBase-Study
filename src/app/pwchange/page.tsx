"use client";
import { useState, useEffect } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig"; // 적절한 경로로 변경

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // URL에서 oobCode를 추출합니다.

  const [oobCode, setOobCode] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트 측에서만 실행
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("oobCode");
    if (code) {
      setOobCode(code);
    } else {
      setMessage("유효하지 않은 요청입니다.");
    }
  }, []);

  const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (oobCode) {
      try {
        await confirmPasswordReset(auth, oobCode, newPassword);
        setMessage("비밀번호가 성공적으로 재설정되었습니다.");
      } catch (error) {
        setMessage("비밀번호 재설정 중 오류가 발생했습니다.");
        console.error("Error resetting password:", error);
      }
    } else {
      setMessage("유효하지 않은 요청입니다.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h1>비밀번호 재설정</h1>
      <input
        type="password"
        placeholder="새 비밀번호 입력"
        value={newPassword}
        onChange={handleChangeNewPassword}
        style={{
          marginBottom: "10px",
          padding: "10px",
          width: "300px",
          fontSize: "16px",
        }}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={handleChangeConfirmPassword}
        style={{
          marginBottom: "10px",
          padding: "10px",
          width: "300px",
          fontSize: "16px",
        }}
      />
      <button
        onClick={handleResetPassword}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        비밀번호 재설정
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
