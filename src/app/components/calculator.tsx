"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { SignalRConnectionInfo } from "../models/signalRConnectionInfo";
import { SignalRMessage } from "../models/signalRMessage";

const CalculatorForm: React.FC = () => {
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);
  const [operation, setOperation] = useState<string>("add");
  const [result, setResult] = useState<string | null>(null);
  const [signalRConnectionInfo, setSignalRConnectionInfo] = useState<SignalRConnectionInfo>();

  useEffect(() => {
    if (!signalRConnectionInfo) {
      const getSignalRConnectionInfo = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_FUNCTION_NEGOCIATE, {
          method: "POST",
          headers: {
            "x-ms-client-principal-id": "kmi",
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          response.json().then(result => {
            console.log(result)
            setSignalRConnectionInfo(result)
          });
        }
      };
      getSignalRConnectionInfo();
    }
  }, []);

  useEffect(() => {
    if (signalRConnectionInfo) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(signalRConnectionInfo.url, {
          accessTokenFactory: () => {
            return signalRConnectionInfo.accessToken;
          },
        })
        .configureLogging(signalR.LogLevel.Debug)
        .build();

      connection.on("ReceiveMessage", (res) => {
        setResult(res);
      });

      connection.start().catch((err) => console.error(err.toString()));
    }
  }, [signalRConnectionInfo]);

  const handleCalculate = async () => {
    setResult('Sending operation to server, please wait!');
    const signalRMessage : SignalRMessage = {
      userId:"calculator",
      num1:number1,
      num2:number2,
      operation:operation
    }    
    const response = await fetch(process.env.NEXT_PUBLIC_FUNCTION_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signalRMessage),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }    
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            Welcome to Azure Calculator
          </Typography>
          <input
            type="number"
            title="number1"
            placeholder="Enter number 1"
            className="w-full p-2 mb-2 border rounded"
            value={number1}
            onChange={(e) => setNumber1(Number(e.target.value))}
          />
          <select
            title="operation"
            className="w-full p-2 mb-2 border rounded"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
          >
            <option value="add">Add</option>
            <option value="substract">Subtract</option>
            <option value="multiply">Multiply</option>
            <option value="divide">Divide</option>
          </select>
          <input
            type="number"
            title="number2"
            placeholder="Enter number 2"
            className="w-full p-2 mb-2 border rounded"
            value={number2}
            onChange={(e) => setNumber2(Number(e.target.value))}
          />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleCalculate}>
            Calculate
          </Button>
        </CardActions>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            Resultant:{" "}
            <b>{result != null ? result : "Not computed yet"}</b>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default CalculatorForm;
