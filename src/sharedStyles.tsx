// src/sharedStyles.ts
import styled from "styled-components";

export const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

export const Input = styled.input`
  padding: 10px;
  margin: 10px;
  font-size: 24px;
  text-align: center;
  width: 200px;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #007acc;
  font-size: 16px;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.5) 5px 5px 10px;

  &:hover {
    background-color: #005fa3;
  }
`;
