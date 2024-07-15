import { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../firebase/firebaseAdmin";
import axios from "axios";

interface KakaoAccessTokenInfo {
  id: number; // 예시로 id 필드만 사용한다고 가정
  // 필요한 다른 필드들을 여기에 추가할 수 있음
}

async function verifyKakaoToken(token: string): Promise<number> {
  const url = "https://kapi.kakao.com/v1/user/access_token_info";

  try {
    const response = await axios.get<KakaoAccessTokenInfo>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.id;
  } catch (error: any) {
    throw new Error(`Kakao API request failed: ${error.message}`);
  }
}

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { token } = await req.json();
  // console.log(token);
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const kakaoUserId = await verifyKakaoToken(token);
    const firebaseToken = await adminAuth.createCustomToken(
      String(kakaoUserId)
    );
    return res.status(200).json({ firebaseToken });
  } catch (error) {
    console.error("Error verifying Kakao token:", error);
    return res.status(400).json({ error: "Invalid Kakao token" });
  }
}
