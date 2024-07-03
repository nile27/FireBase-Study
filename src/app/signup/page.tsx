"use client";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { auth, firestore, storage } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const SignUpPage = () => {
  const [userId, setuserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [birth, setBirth] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const localEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("emailForSignIn") || ""
      : "";

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [labelImg, setLabelImg] = useState<string | null>("");
  const imgRef = useRef<HTMLInputElement>(null);

  const saveImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    setImgFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setLabelImg(reader.result as string);
    };
  };

  const handleSignUp = async () => {
    try {
      if (!localEmail) {
        throw new Error("Local email not found");
      }

      const authResult = await createUserWithEmailAndPassword(
        auth,
        localEmail,
        password
      );
      const user = authResult.user;

      let photoURL = "";
      if (imgFile) {
        const storageRef = ref(
          storage,
          `profile_images/${user.uid}/${imgFile.name}`
        );
        await uploadBytes(storageRef, imgFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: "new dis",
        photoURL: photoURL,
        // photoURL: "<사용자의 프로필 사진 URL>", // 필요에 따라 프로필 사진 업데이트 가능
      });

      // 회원가입 후 추가적인 사용자 정보 저장 등의 작업을 수행할 수 있음
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, {
        userId: userId,
        email: localEmail, // userId를 이메일로 사용
        phone: phone,
        birth: birth,

        // 추가 필드 추가 가능
      });

      // 회원가입 성공 후 리다이렉션 또는 다른 작업 수행
    } catch (error) {
      console.error("Error signing up:", error);
      // 에러 처리 로직 추가
    }
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setuserId(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const checkIfEmailExists = async (email: string) => {
    console.log(email, "asd");
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      console.log(signInMethods);
      return signInMethods.length;
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    }
  };

  useEffect(() => {
    // const checkEmail = async () => {
    //   console.log(localEmail);
    //   try {
    //     if (localEmail) {
    //       const emailExists = await checkIfEmailExists(localEmail);
    //       console.log(emailExists);
    //     }
    //   } catch (error) {
    //     console.error("Error checking email:", error);
    //   }
    // };
    // checkEmail();

    const checkEmail = async () => {
      try {
        const usersCollectionRef = collection(firestore, "users");
        const q = query(usersCollectionRef, where("email", "==", localEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          console.log("이미 이메일이 있습니다.");
          return; // 이메일이 중복되었으므로 함수 종료
        }

        // 이메일이 중복되지 않은 경우, 추가적인 로직을 여기에 추가할 수 있음
      } catch (error) {
        console.log("회원가입 진행");
        // 에러 처리 로직 추가
      }
    };
    checkEmail();
  }, []);

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={userId}
        onChange={handleChangeEmail}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChangePassword}
      />
      <input
        type="text"
        placeholder="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="birth"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
      />

      <div className="   pb-5 w-full h-auto flex justify-center items-center">
        <label
          htmlFor="profileImg"
          style={{
            backgroundImage: labelImg ? `url(${labelImg})` : "red",
          }}
          className={` bg-red-400 relative w-[140px] h-[140px] bg-cover bg-center cursor-pointer rounded-full`}
        >
          <div className="bg-[#9F9F9F] rounded-full absolute bottom-0 right-0"></div>
        </label>

        <input
          type="file"
          accept="image/*"
          id="profileImg"
          onChange={saveImgFile}
          ref={imgRef}
          className="hidden w-full h-full "
        />
      </div>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUpPage;
