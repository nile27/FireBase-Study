import { auth } from "../firebase/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";

const sendVerificationEmail = async (email: any) => {
  //`${process.env.NEXT_PUBLIC_BASE_URL}/signup`,\
  //"https://example.page.link/summer-sale",
  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    console.log("Verification email sent");
  } catch (error: any) {
    console.error("Error sending verification email:", error.message);
    throw error;
  }
};

export { sendVerificationEmail };
