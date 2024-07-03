// api/verifyEmailLink.ts

import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { firestore } from "../firebase/firebaseConfig"; // Firebase 설정 임포트

export async function verifyEmailLink(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, link } = req.body;

    try {
      const firestore = admin.firestore();
      const snapshot = await firestore
        .collection("emailLinks")
        .where("email", "==", email)
        .where("link", "==", link)
        .get();

      if (snapshot.empty) {
        res.status(400).json({ error: "유효하지 않거나 만료된 링크입니다." });
        return;
      }

      const doc = snapshot.docs[0];
      if (doc.data().used) {
        res.status(400).json({ error: "이 링크는 이미 사용되었습니다." });
        return;
      }

      await doc.ref.update({ used: true });
      res.status(200).json({ message: "이메일이 성공적으로 인증되었습니다!" });
    } catch (error: any) {
      console.error("Error verifying email link:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "허용되지 않은 메소드입니다" });
  }
}
