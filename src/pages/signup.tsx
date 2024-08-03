// src/pages/signup.tsx

import React, { useState } from "react";
import { navigate } from "gatsby";
import { supabase } from "../supabase";
import bcrypt from "bcryptjs";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Container, InputContainer, Input } from "../sharedStyles";

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  background-color: #4caf50;
  &:hover {
    background-color: #388e3c;
  }
`;

const LoginButton = styled(Button)`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #6c757d;

  &:hover {
    background-color: #5a6268;
  }
`;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 新增的狀態
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證密碼與確認密碼是否一致
    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    try {
      // Check if the username already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        setMessage("Username already registered. Please log in.");
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into users table
      const { data, error } = await supabase
        .from("users")
        .insert([{ username, password: hashedPassword }]);

      if (error) {
        setMessage("Signup failed: " + error.message);
      } else {
        setMessage("Signup successful! Please log in.");
        if (typeof window !== "undefined") {
          localStorage.setItem("username", username); // Store username in localStorage
        }
        navigate("/");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  const handleNavigateLogin = () => {
    navigate("/login");
  };

  return (
    <Container>
      <Helmet>
        <title>Sign Up</title>
        <meta name="description" content="Sign up for an account." />
      </Helmet>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <InputContainer>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </InputContainer>
        <InputContainer>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputContainer>
        <InputContainer>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // 新增的輸入欄位
            required
          />
        </InputContainer>
        <Button type="submit">Sign Up</Button>
        <LoginButton type="button" onClick={handleNavigateLogin}>
          Go Log In
        </LoginButton>
      </form>
      {message && <p>{message}</p>}
    </Container>
  );
};

export default Signup;
