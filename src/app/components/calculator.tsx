"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { SignalRConnectionInfo } from "../models/signalRConnectionInfo";
import { SignalRMessage } from "../models/signalRMessage";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { LinearProgress } from "@mui/material";

const CalculatorForm: React.FC = () => {
  const [number1, setNumber1] = useState<string>("");
  const [number2, setNumber2] = useState<string>("");
  const number1AsNumber = Number(number1);
  const number2AsNumber = Number(number2);
  const [operation, setOperation] = useState<string>("add");
  const [result, setResult] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [signalRConnectionInfo, setSignalRConnectionInfo] =
    useState<SignalRConnectionInfo>();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  const handleCalculate = useCallback(async () => {
    setResult("Sending operation to server, please wait!");
    setShowProgress(true);
    const signalRMessage: SignalRMessage = {
      userId: "calculator",
      num1: number1AsNumber,
      num2: number2AsNumber,
      operation: operation,
    };
    const url = process.env.NEXT_PUBLIC_FUNCTION_API!;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${process.env.NEXT_PUBLIC_FUNCTION_BEARER}`,
      },
      body: JSON.stringify(signalRMessage),
    })
      .then((res) => {})
      .catch((error) => {
        throw new Error(`HTTP error! status: ${error}`);
      });
  }, [number1AsNumber, number2AsNumber, operation]);

  useEffect(() => {
    if (!signalRConnectionInfo) {
      const getSignalRConnectionInfo = async () => {
        const url = process.env.NEXT_PUBLIC_FUNCTION_NEGOCIATE!;
        await getSignalConnectionInfo(url, setSignalRConnectionInfo);
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
        setShowProgress(false);
        setResult(`Result: ${res}`);
      });

      connection.start().catch((err) => console.error(err.toString()));
      setConnection(connection);
    }
    return () => {
      connection?.stop();
    };
  }, [signalRConnectionInfo]);

  async function getSignalConnectionInfo(
    url: string,
    setSignalRConnectionInfo: React.Dispatch<
      React.SetStateAction<SignalRConnectionInfo | undefined>
    >
  ) {
    await fetch(url, {
      method: "POST",
      headers: {
        "x-ms-client-principal-id": "Calculate",
        Authentication: `Bearer ${process.env.NEXT_PUBLIC_FUNCTION_BEARER}`,
      },
    })
      .then((res) => {
        res.json().then((result) => {
          setSignalRConnectionInfo(result);
        });
      })
      .catch((error) => {
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
          subheader={
            <Box>
              <Box
                component="section"
                display="flex"
                alignItems="center"
                textAlign="justify"
                gap={2}
                sx={{ p: 2, border: "1px grey" }}
              >
                Please provide the numbers and the operation and press calculate
                button
              </Box>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              m: 1,
              p: 1,
              bgcolor: "#fff",
              color: "grey.800",
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 2,
              textAlign: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: "700",
            }}
          >
            <TextField
              id="number1"
              label="Number 1"
              variant="outlined"
              value={number1}
              onChange={(e) => setNumber1(e.target.value)}
            ></TextField>
            <Select
              labelId="operation"
              id="operation"
              value={operation}
              label="Operation"
              onChange={(e) => setOperation(e.target.value)}
            >
              <MenuItem value={"add"}>Add</MenuItem>
              <MenuItem value={"subtract"}>Subtract</MenuItem>
              <MenuItem value={"multiply"}>Multiply</MenuItem>
              <MenuItem value={"divide"}>Divide</MenuItem>
            </Select>
            <TextField
              id="number2"
              label="Number 2"
              variant="outlined"
              value={number2}
              onChange={(e) => setNumber2(e.target.value)}
            ></TextField>
          </Box>
        </CardContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ m: 1, p: 1 }}
        >
          { result && (
          <Stack direction="column">
            <Box
              sx={{
                display: "flex",
                m: 1,
                p: 1,
                bgcolor: "#fff",
                color: "grey.800",
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
                textAlign: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                fontWeight: "700",
                width: "60vh"
              }}>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.secondary"
                gutterBottom>
                {result ?? ""}
              </Typography>
            </Box>
            {showProgress && <LinearProgress></LinearProgress>}
          </Stack>)}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            m: 1,
            p: 1,
          }}
        >
          {(number2AsNumber !== 0 ||
            (number2AsNumber === 0 && operation !== "divide")) && (
            <Button size="small" onClick={handleCalculate} variant="outlined">
              Calculate
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default CalculatorForm;
