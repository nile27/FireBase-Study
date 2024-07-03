// api/sendVerificationEmail.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from 'firebase-admin/firestore';
import { firestore, auth } from '../firebase/firebaseConfig'; // Firebase 설정 임포트

export async function sendVerificationEmail(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    const actionCodeSettings = {
      url: `https://localhost:3000/signup?email=${email}`,
      handleCodeInApp: true,
    };

    try {
      const link = await auth.generateSignInWithEmailLink(email, actionCodeSettings);
      await firestore.collection('emailLinks').add({ email, link, used: false });

      res.status(200).json({ message: 'Verification email sent!' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
