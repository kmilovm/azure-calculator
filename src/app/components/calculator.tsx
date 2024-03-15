"use client";

import React, { useState } from "react";
import * as signalR from "@microsoft/signalr";

const  Calculator =() => {
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState(0);

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.NEXT_PUBLIC_SIGNALR_HUB_URL)
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveResult", (res) => {
    setResult(res);
  });

  connection.start().catch((err) => console.error(err.toString()));

  const calculate = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_FUNCTION_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        num1: number1,
        num2: number2,
        operation: operation,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-around">
      <label htmlFor="number1">Provide Number 1:</label>
      <input
        className="text-black"
        id="number1"
        type="number"
        title="number 1"
        alt="number 1"
        value={number1}
        onChange={e => setNumber1(Number(e.target.value))}
      />
      <label htmlFor="operation">Select Operation:</label>
      <select
        id="operation"
        className="text-black"
        value={operation}
        title="operation"
        onChange={(e) => setOperation(e.target.value)}
      >
        <option value="add">Add</option>
        <option value="subtract">Subtract</option>
        <option value="multiply">Multiply</option>
        <option value="divide">Divide</option>
      </select>
      <label htmlFor="number2">Provide Number 2:</label>
      <input
        id="number2"
        className="text-black"
        type="number"
        title="number 2"
        alt="number 2"
        value={number2}
        onChange={(e) => setNumber2(Number(e.target.value))}
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={calculate}>Calculate</button>
      <p>Result: {result}</p>
    </div>
  );  
}
export default Calculator;
