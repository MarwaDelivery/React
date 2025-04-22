import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const WrapForm = styled("form")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "95%",
  margin: `${theme.spacing(0)} auto`,
}));

const WrapText = styled(TextField)({
  width: "100%",
});

const StyledButton = styled(Button)({
  marginInlineStart: "10px",
});

export const TextInput = ({ submitHandler }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (message.trim()) {
      submitHandler(message);
      setMessage(""); // Clear the input field
    } else {
      console.error("Message cannot be empty!");
    }
  };

  return (
    <WrapForm noValidate autoComplete="off" onSubmit={handleSubmit}>
      <WrapText
        id="standard-text"
        label="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update state on input change
      />
      <StyledButton type="submit" variant="contained" color="primary">
        <SendIcon />
      </StyledButton>
    </WrapForm>
  );
};
