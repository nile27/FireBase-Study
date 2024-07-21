"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { signInWithCustomToken } from "firebase/auth";
import { app, auth } from "../firebase/firebaseConfig";
import { UserCredential } from "firebase/auth";

export default function LoginNaver() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<UserCredential | null>(null);
  const loading = status === "loading";

  // useEffect(() => {
  //   const signInToFirebase = async () => {
  //     console.log("Session: ", session);
  //     if (session?.user?.firebaseToken) {
  //       console.log("Firebase token found, attempting to sign in...");
  //       try {
  //         const userCredential = await signInWithCustomToken(
  //           auth,
  //           session.user.firebaseToken
  //         );
  //         console.log("Firebase login successful:", userCredential);
  //         setData(userCredential);
  //       } catch (error) {
  //         console.error("Firebase login error:", error);
  //       }
  //     }
  //   };

  //   if (session) {
  //     signInToFirebase();
  //   }
  // }, [session]);

  // useEffect(() => {
  //   if (data) {
  //     console.log("UserCredential data:", data);
  //   }
  // }, [data]);
  const handleNaver = async () => {
    const back = await fetch("/api/oauth")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching user data:", error));

    signIn("naver");
  };

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div>
      {!session && (
        <>
          <button onClick={handleNaver}>Sign in with Naver</button>
        </>
      )}
      {session && (
        <>
          <button onClick={() => signOut()}>Sign out</button>
          <p>Welcome, {session.user.name}</p>
          {data && (
            <>
              <p>Signed in as: {data.user.displayName}</p>
              <p>Email: {data.user.email}</p>
              {data.user.photoURL && (
                <img
                  src={data.user.photoURL}
                  alt="Profile"
                  width={50}
                  height={50}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
