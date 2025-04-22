import React, { useEffect, useRef } from "react";
import { TextInput } from "./TextInput.js";
import {
  MessagesBody,
  StyledPaper,
} from "components/module-wise-layout/aibot/AIBotCustomStyle";
import { Stack, Typography } from "@mui/material";
import {
  MessageLeft,
  MessageRight,
} from "components/module-wise-layout/aibot/AIMessage";
import { usePostAgentMessage } from "api-manage/hooks/react-query/ai_bot/usePostAgentMessage";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useGetProfile from "api-manage/hooks/react-query/profile/useGetProfile";
import { useGetMessages } from "api-manage/hooks/react-query/ai_bot/useGetMessages";
import { t } from "i18next";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import PushNotificationLayout from "components/PushNotificationLayout";

export default function App(props) {
  const { type } = props;
  const { configData } = useSelector((state) => state.configData);
  const businessLogo = configData?.base_urls?.business_logo_url;
  const agentUrl = configData?.base_urls?.store_image_url;
  const [offset, setOffset] = React.useState(0);
  const page_limit = 10;

  const { ref: topRef, inView: isTopInView } = useInView({
    rootMargin: "100px",
    threshold: 0,
  });

  const userOnSuccessHandler = () => {};
  const { data: userData, refetch: profileRefetch } =
    useGetProfile(userOnSuccessHandler);

  const { mutate } = usePostAgentMessage();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    refetch: messageRefetch,
  } = useGetMessages({
    offset,
    page_limit,
  });

  const messagesEndRef = useRef(null);

  // Scroll to the bottom after render stabilizes
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Scroll to the bottom when the component first renders
    const timeout = setTimeout(scrollToBottom, 0);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch next page when top is in view
  useEffect(() => {
    if (isTopInView && hasNextPage) {
      setOffset((prevOffset) => prevOffset + 1);
      fetchNextPage();
    }
  }, [isTopInView]);
  useEffect(() => {
    messageRefetch();
  }, []);
  useEffect(() => {
    profileRefetch();
  }, []);

  useEffect(() => {
    // Scroll to the bottom after the messages are fetched/updated
    const timeout = setTimeout(scrollToBottom, 0);
    return () => clearTimeout(timeout);
  }, [data]);

  const submitHandler = (text) => {
    const tempData = {
      message: text,
      user_id: userData?.userinfo?.id,
      is_ai: type === "ai" ? 1 : 0,
      receiver_type: "admin",
    };

    mutate(tempData, {
      onSuccess: () => {
        messageRefetch();
      },
      onError: onSingleErrorResponse,
    });
  };

  return (
    <PushNotificationLayout refetch={messageRefetch} pathName="chat">
      <StyledPaper>
        <MessagesBody id="style-1">
          <div ref={topRef}></div>

          {data?.pages
            ?.flatMap((page) => page.messages)
            ?.slice()
            .reverse()
            ?.map((page, index) =>
              page?.message === "assign_new_agent" ? (
                <Stack
                  width="100%"
                  key={index}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography fontSize="16px" fontWeight="600">
                    {t("Agent Assigned")}
                  </Typography>
                  <Typography fontSize="14px" fontWeight="600">
                    {`${page?.agent?.f_name} ${page?.agent?.l_name}`}
                  </Typography>
                  <Typography fontSize="14px">
                    {t("Soon the agent will reply")}
                  </Typography>
                </Stack>
              ) : page?.sender_id === userData?.userinfo?.id &&
                page?.is_ai_response !== 1 ? (
                <MessageRight
                  key={index}
                  message={page.message}
                  timestamp={page?.created_at}
                  photoURL={`${configData?.base_url?.customer_image_url}/${userData?.image}`}
                  displayName="まさりぶ"
                  avatarDisp={true}
                />
              ) : (
                <MessageLeft
                  key={index}
                  message={page.message}
                  timestamp={page?.created_at}
                  photoURL={`${businessLogo}/${configData?.logo}`}
                  displayName={
                    page?.is_ai_response === 1
                      ? "AI"
                      : page?.agent?.f_name + " " + page?.agent?.l_name
                  }
                  avatarDisp={false}
                />
              )
            )}

          <div ref={messagesEndRef} />
        </MessagesBody>
        <TextInput submitHandler={submitHandler} />
      </StyledPaper>
    </PushNotificationLayout>
  );
}
