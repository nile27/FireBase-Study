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

const IdFind = () => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const checkEmail = async () => {
    try {
      const usersCollectionRef = collection(firestore, "users");
      const q = query(
        usersCollectionRef,
        where("name", "==", name),
        where("phone", "==", phone)
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs[0].data());
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

  return (
    <div>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={handleChangeEmail}
      />
      <input
        type="text"
        placeholder="phone"
        value={phone}
        onChange={handleChangePassword}
      />

      <button onClick={checkEmail}>Sign Up</button>
    </div>
  );
};

export default IdFind;
