import { useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";

declare global {
  interface Window {
    Kakao: any;
  }
}

const KakaoLoginButton = () => {
  useEffect(() => {
    const checkKakaoSDK = setInterval(() => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        clearInterval(checkKakaoSDK);
      }
    }, 100);
    return () => clearInterval(checkKakaoSDK);
  }, []);

  const kakaoLogin = () => {
    if (!window.Kakao.isInitialized()) {
      console.error("Kakao SDK is not initialized");
      return;
    }

    window.Kakao.Auth.login({
      success: function (authObj: any) {
        console.log("Kakao login successful:", authObj);
        fetch("http://localhost:3000/api/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: authObj.access_token }),
        })
          .then((response) => {
            console.log("qwdjihjqkswdhjk");
            return response.json();
          })
          .then((data) => {
            return signInWithCustomToken(auth, data.firebaseToken);
          })
          .then((userCredential) => {
            console.log("Firebase login successful:", userCredential.user);
          })
          .catch((error) => {
            console.error("Error logging in with Firebase:", error.message);
          });
      },
      fail: function (err: any) {
        console.error("Kakao login failed:", err);
      },
    });
  };

  return <button onClick={kakaoLogin}>카카오 로그인</button>;
};

export default KakaoLoginButton;
