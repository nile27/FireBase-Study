"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const oobCode = urlParams.get("oobCode");
    const continueUrl = urlParams.get("continueUrl");
    const lang = urlParams.get("lang") || "en";

    if (mode && oobCode) {
      // 비밀번호 재설정 또는 이메일 인증 후 리디렉션 로직
      switch (mode) {
        case "resetPassword":
          router.push(`/pwchange?oobCode=${oobCode}&lang=${lang}`);
          break;
        case "signIn":
          router.push(`/signup?oobCode=${oobCode}&lang=${lang}`);
          break;
        default:
        // router.push("/");
      }
    } else {
      // router.push("/");
    }
  }, [router]);

  return <p>Redirecting...</p>;
};

export default RedirectPage;
