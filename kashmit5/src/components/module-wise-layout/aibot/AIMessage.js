import React from "react";
import { Avatar, Typography, Paper, alpha } from "@mui/material";
import { styled } from "@mui/system";
import { deepOrange } from "@mui/material/colors";
import CustomTimeFormat from "components/date-and-time-formators/CustomTimeFormat";
import moment from "moment";

// Styled components
const MessageRow = styled("div")({
  display: "flex",
});

const MessageRowRight = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
});

const MessageBlue = styled("div")(({ theme }) => ({
  position: "relative",
  marginLeft: "20px",
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: alpha(theme.palette.primary.main, 0.8),
  width: "80%",
  textAlign: "left",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.8)}`,
  borderRadius: "10px",
  minWidth: "150px",
  // "&:after": {
  //   content: "''",
  //   position: "absolute",
  //   width: "0",
  //   height: "0",
  //   borderTop: "15px solid #A8DDFD",
  //   borderLeft: "15px solid transparent",
  //   borderRight: "15px solid transparent",
  //   top: "0",
  //   left: "-15px",
  // },
  // "&:before": {
  //   content: "''",
  //   position: "absolute",
  //   width: "0",
  //   height: "0",
  //   borderTop: "17px solid #97C6E3",
  //   borderLeft: "16px solid transparent",
  //   borderRight: "16px solid transparent",
  //   top: "-1px",
  //   left: "-17px",
  // },
}));

const MessageOrange = styled("div")(({ theme }) => ({
  position: "relative",
  marginRight: "20px",
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: alpha(theme.palette.primary.main, 0.3),
  width: "70%",
  textAlign: "left",

  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  borderRadius: "10px",
  // "&:after": {
  //   content: "''",
  //   position: "absolute",
  //   width: "0",
  //   height: "0",
  //   borderTop: `15px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  //   borderLeft: "15px solid transparent",
  //   borderRight: "15px solid transparent",
  //   top: "0",
  //   right: "-15px",
  // },
  // "&:before": {
  //   content: "''",
  //   position: "absolute",
  //   width: "0",
  //   height: "0",
  //   borderTop: `17px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  //   borderLeft: "16px solid transparent",
  //   borderRight: "16px solid transparent",
  //   top: "-1px",
  //   right: "-17px",
  // },
}));

const MessageContent = styled("p")({
  padding: 0,
  margin: 0,
  paddingBottom: "10px",
});

const MessageTimeStampRight = styled("div")({
  position: "absolute",
  fontSize: ".85em",
  fontWeight: "300",
  marginTop: "10px",
  bottom: "2px",
  right: "5px",
});

const OrangeAvatar = styled(Avatar)(({ theme }) => ({
  color: theme.palette.getContrastText(deepOrange[500]),
  backgroundColor: deepOrange[500],
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

const DisplayName = styled("div")({
  marginLeft: "20px",
});

// Avatar with the left-side message (Others)
export const MessageLeft = ({ message, timestamp, photoURL, displayName }) => {
  // Defaulting missing props
  const messageText = message || "No message";
  const displayTime = timestamp || "";
  const avatarSrc = photoURL || "";
  const displayUserName = displayName || "名無しさん";

  return (
    <MessageRow>
      <OrangeAvatar alt={displayUserName} src={avatarSrc} />
      <div>
        <DisplayName>{displayUserName}</DisplayName>
        <MessageBlue>
          <MessageContent>{messageText}</MessageContent>
          <MessageTimeStampRight>
            {`${moment(displayTime).format("HH:mm")} ${moment(
              displayTime
            ).format("YYYY-MM-DD")}`}
          </MessageTimeStampRight>
        </MessageBlue>
      </div>
    </MessageRow>
  );
};

// Avatar with the right-side message (Self)
export const MessageRight = ({
  message,
  timestamp,
  displayUserName,
  photoURL,
}) => {
  // Defaulting missing props
  const messageText = message || "No message";
  const displayTime = timestamp || "";
  const avatarSrc = photoURL || "";
  return (
    <MessageRowRight>
      <MessageOrange>
        <MessageContent>{messageText}</MessageContent>
        <MessageTimeStampRight>
          {`${moment(displayTime).format("HH:mm")} ${moment(displayTime).format(
            "YYYY-MM-DD"
          )}`}
        </MessageTimeStampRight>
      </MessageOrange>
      <OrangeAvatar alt={displayUserName} src={avatarSrc} />
    </MessageRowRight>
  );
};
