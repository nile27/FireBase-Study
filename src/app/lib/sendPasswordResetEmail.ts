// // sendPasswordResetEmail.ts
import { auth } from "../firebase/firebaseConfig";
// import { sendPasswordResetEmail } from "firebase/auth";

// const sendPasswordResetEmailWithCustomRedirect = async (
//   email: string
// ): Promise<void> => {
//   const actionCodeSettings = {
//     url: "http://localhost:3000/pwchange",
//     handleCodeInApp: true,
//   };

//   try {
//     await sendPasswordResetEmail(auth, email, actionCodeSettings);
//     console.log("Password reset email sent");
//   } catch (error) {
//     console.error(
//       "Error sending password reset email:",
//       (error as Error).message
//     );
//     throw error;
//   }
// };

// export { sendPasswordResetEmailWithCustomRedirect };

// sendPasswordResetEmail.ts

import { sendPasswordResetEmail } from "firebase/auth";

const sendPasswordResetEmailWithCustomRedirect = async (
  email: string
): Promise<void> => {
  const actionCodeSettings = {
    url: "http://localhost:3000/redirect?mode=resetPassword",
    handleCodeInApp: true,
  };

  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log("Password reset email sent");
  } catch (error) {
    console.error(
      "Error sending password reset email:",
      (error as Error).message
    );
    throw error;
  }
};

export { sendPasswordResetEmailWithCustomRedirect };
