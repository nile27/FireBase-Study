// pages/register.js
"use client";
import React, { useState } from "react";
import { sendVerificationEmail } from "../lib/sendVerificationEmail";

// http://localhost:3000/finish-signup?email=ddj03104@naver.com&apiKey=AIzaSyCLxJ7uGBO3RsjuAxEaxWXDT44m9mrgCB8&oobCode=8mHeAwghVXP-mm0plB4lfN58cm20i4rEMcqP4StD9fIAAAGQbiU5ag&mode=signIn&lang=en

const Register = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      await sendVerificationEmail(email);
      setMessage(
        `Verification email sent to ${email}. Please check your email to complete the sign-up process.`
      );
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Verification Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
