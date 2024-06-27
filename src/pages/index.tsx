// src/pages/index.js
import React, { useState } from "react";
import styled from "styled-components";

// 一些常見的Solo Jazz步伐
const jazzSteps = [
  "Charleston",
  "Tack Annie",
  "Shorty George",
  "Susie Q",
  "Boogie Back",
  "Boogie Forward",
  "Apple Jack",
  "Fall off the Log",
  "Shim Sham",
  "Camel Walk",
];

const IndexPage = () => {
  const [count, setCount] = useState(0);
  const [steps, setSteps] = useState([]);

  const handleGenerate = () => {
    const newSteps = Array.from({ length: count }, () => {
      const randomIndex = Math.floor(Math.random() * jazzSteps.length);
      return jazzSteps[randomIndex];
    });
    setSteps(newSteps);
  };

  return (
    <Container>
      <h1>Swing Solo Jazz Step Generator</h1>
      <Input
        type="number"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        placeholder="Enter number of steps"
      />
      <Button onClick={handleGenerate}>Generate Steps</Button>
      <StepsContainer>
        {steps.map((step, index) => (
          <Step key={index}>{step}</Step>
        ))}
      </StepsContainer>
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #007acc;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #005fa3;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Step = styled.div`
  border: 1px solid black;
  padding: 20px;
  margin: 10px;
  width: 150px;
  text-align: center;
  background-color: #f0f0f0;
`;

export default IndexPage;
