import { Group, Stack } from "@mantine/core";

import ChatMessage from "./ChatBoxMessage";

import classes from "./chat-box.module.css";

interface ChatBoxProps {
    authorOne: string;
    authorTwo: string;
    messages: {
        author: string;
        content: string;
        date: Date;
    }[]
}

export default function ChatBox({ authorOne, authorTwo, messages }: ChatBoxProps) {
    return (
        <Stack className={classes.container}>
            {
                messages.map((message, index) => (
                    <Group justify={message.author === authorOne ? "flex-end" : "flex-start"} key={index}>
                        <ChatMessage
                            background={message.author === authorOne ? "gray" : "red"}
                            author={message.author}
                            content={message.content}
                            date={message.date}
                        />
                    </Group>
                ))
            }
        </Stack>
    );
}