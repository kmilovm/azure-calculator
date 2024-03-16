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
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

const CalculatorForm: React.FC = () => {
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);
  const [operation, setOperation] = useState<string>("add");
  const [result, setResult] = useState<string | null>(null);
  const [signalRConnectionInfo, setSignalRConnectionInfo] =  useState<SignalRConnectionInfo>();

  useEffect(() => {
    
    if (!signalRConnectionInfo) {
      const getSignalRConnectionInfo = async () => {
        const url = process.env.NEXT_PUBLIC_FUNCTION_NEGOCIATE!;
        await getSignalConnectionInfo(url, setSignalRConnectionInfo);
      };
      getSignalRConnectionInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setResult("Sending operation to server, please wait!");
    const signalRMessage: SignalRMessage = {
      userId: "calculator",
      num1: number1,
      num2: number2,
      operation: operation,
    };
    const url = process.env.NEXT_PUBLIC_FUNCTION_API!;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authentication": `Bearer ${process.env.NEXT_PUBLIC_FUNCTION_BEARER}`
      },
      body: JSON.stringify(signalRMessage),
    })
      .then((res) => {})
      .catch((error) => {
        throw new Error(`HTTP error! status: ${error}`);
      });
  };

  async function getSignalConnectionInfo(url: string, setSignalRConnectionInfo: React.Dispatch<React.SetStateAction<SignalRConnectionInfo | undefined>>) {
    await fetch(url, {
      method: "POST",
      headers: {
        "x-ms-client-principal-id": "Calculate",
        "Authentication": `Bearer ${process.env.NEXT_PUBLIC_FUNCTION_BEARER}`
      },
    }).then((res) => {
      res.json().then((result) => {
        setSignalRConnectionInfo(result);
      });
    }).catch((error) => {
      console.log("error", error);
      throw new Error(`HTTP error! status: ${error}`);
    });
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardHeader
          action={<IconButton aria-label="settings"></IconButton>}
          title="Welcome to Azure Calculator"
          subheader={<Box>            
            <Box 
              component="section" 
              height={100}
              width={500}              
              display="flex"
              alignItems="center"
              textAlign="justify"
              gap={2}              
              sx={{ p: 2, border: '1px grey' }}>
              Please use the wheel or arrows to select the numbers
              and the operation and press calculate button
            </Box>            
          </Box>}
        />
        <Divider />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              m: 1,
              p: 1,
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#101010" : "#fff",
              color: (theme) =>
                theme.palette.mode === "dark" ? "grey.300" : "grey.800",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "grey.800" : "grey.300",
              borderRadius: 2,
              fontSize: "0.875rem",
              fontWeight: "700",
            }}
          >
            <input
              type="number"
              title="number1"
              placeholder="Enter number 1"
              className="w-full p-2 mb-2 border rounded text-center"
              value={number1}
              onKeyPress={(event) => { event.preventDefault(); }} onPaste={(event) => { event.preventDefault(); }} 
              onChange={(e) => setNumber1(Number(e.target.value))}
            />
            <select
              title="operation"
              className="w-full p-2 mb-2 border rounded"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="multiply">Multiply</option>
              <option value="divide">Divide</option>
            </select>
            <input
              type="number"
              title="number2"
              placeholder="Enter number 2"
              className="w-full p-2 mb-2 border rounded text-center"
              value={number2}
              onKeyPress={(event) => { event.preventDefault(); }} onPaste={(event) => { event.preventDefault(); }} 
              onChange={(e) => setNumber2(Number(e.target.value))}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Box sx={{display:'flex', justifyContent:'left', alignItems:'center'}}>
            <Button size="small" onClick={handleCalculate}>
              Calculate
            </Button>
          </Box>
        </CardActions>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            Resultant: <b>{result ?? "Not computed yet"}</b>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default CalculatorForm;


