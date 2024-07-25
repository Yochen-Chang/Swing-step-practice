import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "../supabase";
import { Helmet } from "react-helmet";
import { navigate } from "gatsby";

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const Input = styled.input`
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

const SmallButton = styled.button`
  padding: 5px;
  margin: 5px;
  background-color: #007acc;
  color: white;
  border: none;
  cursor: pointer;
  width: 50px;
  height: 50px;
  font-size: 20px;
  box-shadow: rgba(0, 0, 0, 0.5) 3px 3px 5px;

  &:hover {
    background-color: #005fa3;
  }
`;

const Button = styled.button`
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

const LogoutButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
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
  box-shadow: rgba(0, 0, 0, 0.5) 5px 5px 10px;
`;

const Table = styled.table`
  margin: 20px auto;
  border-collapse: collapse;
  width: 80%;
  max-width: 400px;
`;

const Th = styled.th`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  background-color: #007acc;
  color: white;
`;

const Td = styled.td`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.selected ? "#f0e68c" : "white")};
`;

const IndexPage = () => {
  const [count, setCount] = useState(0);
  const [noRepeated, setNoRepeated] = useState(false);
  const [steps, setSteps] = useState([]);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [jazzSteps, setJazzSteps] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchSteps = async () => {
        const { data, error } = await supabase.from("swing-steps").select("*");
        if (error) {
            console.error("Error fetching data from Supabase:", error);
        } else {
            const stepsWithCheck = data.map((step) => ({
                name: step.name,
                checked: true
            }));
            setJazzSteps(stepsWithCheck);
        }
    };
    fetchSteps();

    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        navigate("/login");
      }
    }
  }, []);

  const handleGenerate = () => {
    const selectedSteps = jazzSteps.filter((step) => step.checked);
    let newSteps = [];

    if (noRepeated) {
      if (count > selectedSteps.length) {
        alert("Number of steps requested exceeds available steps.");
        return;
      }
      newSteps = [...selectedSteps]
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
        .map((step) => step.name);
    } else {
      newSteps = Array.from({ length: count }, () => {
        const randomIndex = Math.floor(Math.random() * selectedSteps.length);
        return selectedSteps[randomIndex].name;
      });
    }

    setSteps(newSteps);
    setSelectedSteps(newSteps.map((name) => ({ name, checked: true }))); // Adjust this if needed
  };

  const incrementCount = () => {
    if (noRepeated && count >= jazzSteps.length) {
      alert(`Maximum number of steps is ${jazzSteps.length}`);
      return;
    }
    setCount(count + 1);
  };

  const decrementCount = () => setCount(count > 0 ? count - 1 : 0);

  const handleCheckboxChange = (index) => {
    const updatedJazzSteps = jazzSteps.map((step, idx) => {
      if (idx === index) {
        return { ...step, checked: !step.checked };
      }
      return step;
    });
    setJazzSteps(updatedJazzSteps);
  };

  const handleNoRepeatedChange = (e) => {
    setNoRepeated(e.target.checked);
    if (e.target.checked && count > jazzSteps.length) {
      setCount(jazzSteps.length);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("username");
      setUsername("");
      navigate("/login");
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Swing Solo Jazz Step Generator</title>
        <meta
          name="description"
          content="Generate solo jazz steps for swing dance practice."
        />
      </Helmet>
      <h1>Swing Solo Jazz Step Generator</h1>
      <p>Welcome, {username}</p>
      <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
      <InputContainer>
        <SmallButton onClick={decrementCount}>-</SmallButton>
        <Input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          placeholder="Enter number of steps"
          max={noRepeated ? jazzSteps.length : undefined}
        />
        <SmallButton onClick={incrementCount}>+</SmallButton>
      </InputContainer>
      <Button onClick={handleGenerate}>Generate Steps</Button>
      <CheckboxContainer>
        <label>
          <input
            type="checkbox"
            checked={noRepeated}
            onChange={handleNoRepeatedChange}
          />
          No repeated
        </label>
      </CheckboxContainer>
      <StepsContainer>
        {steps.map((stepName, index) => (
          <Step key={index}>{stepName}</Step>
        ))}
      </StepsContainer>
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>SOLO Step</Th>
            <Th>Select</Th>
          </tr>
        </thead>
        <tbody>
          {jazzSteps.map((step, index) => (
            <TableRow
              key={index}
              selected={selectedSteps.some(
                (s) => s.name === step.name && s.checked
              )}
            >
              <Td>{index + 1}</Td>
              <Td>{step.name}</Td>
              <Td>
                <input
                  type="checkbox"
                  checked={step.checked}
                  onChange={() => handleCheckboxChange(index)}
                />
              </Td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default IndexPage;
