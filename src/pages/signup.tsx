// src/pages/signup.tsx
import React, { useState } from "react";
import { navigate } from "gatsby";
import { supabase } from "../supabase";
import bcrypt from "bcryptjs";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Container, InputContainer, Input, Button } from "../sharedStyles";

const LoginButton = styled(Button)`
  background-color: #6c757d;

  &:hover {
    background-color: #5a6268;
  }
`;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

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
        localStorage.setItem("username", username); // Store username in localStorage
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
