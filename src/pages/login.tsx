// src/pages/login.tsx
import React, { useState } from "react";
import { navigate } from "gatsby";
import { supabase } from "../supabase";
import bcrypt from "bcryptjs";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Container, InputContainer, Input, Button } from "../sharedStyles";

const SignupButton = styled(Button)`
  background-color: #6c757d;

  &:hover {
    background-color: #5a6268;
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Query user information
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        setMessage("Login failed: " + error.message);
        return;
      }

      const user = data;

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        setMessage("Login successful!");
        localStorage.setItem("username", username); // Store username in localStorage
        navigate("/");
      } else {
        setMessage("Invalid password.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  const handleNavigateSignup = () => {
    navigate("/signup");
  };

  return (
    <Container>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login to your account." />
      </Helmet>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <Button type="submit">Log In</Button>
        <SignupButton type="button" onClick={handleNavigateSignup}>
          Go Sign Up
        </SignupButton>
      </form>
      {message && <p>{message}</p>}
    </Container>
  );
};

export default Login;
