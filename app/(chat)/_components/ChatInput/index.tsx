"use client";

import { useState } from "react";

import { Button, Group, Stack, TextInput } from "@mantine/core";

import { IconSend, IconSettings } from "@tabler/icons-react";

import { Message } from "(chat)/_models";

import ChatNumeric from "./ChatNumeric";
import ChatChoices from "./ChatChoices";

import classes from "./chat-input.module.css";

interface ChatInputProps {
    isLoading: boolean;
    type: string;
    choices?: string[];
    onSubmit: (newMessage: Message) => void;
}

export default function ChatInput({ isLoading, type, choices, onSubmit }: ChatInputProps) {
    const [value, setValue] = useState<string | null>(null);

    const ChatOptions = (
        <Group justify="stretch" align="center">
            <Button
                size="lg"
                onClick={() => {
                    if (type === "numeric") {
                        onSubmit({
                            author: "You",
                            content: parseInt(value ?? "") <= 16 ? "<= 16" : "> 16",
                            date: new Date()
                        })
                    } else {
                        onSubmit({
                            author: "You",
                            content: value ?? "",
                            date: new Date()
                        })
                    }
                }}
            >
                <IconSend />
            </Button>
        </Group>
    );

    if (type == "numeric") {
        return (
            <Group align="stretch">
                <ChatNumeric
                    isLoading={isLoading}
                    value={value}
                    setValue={setValue}
                />
                {ChatOptions}
            </Group>

        );
    }

    if (type == "choice") {
        return (
            <Group align="stretch">
                <ChatChoices
                    isLoading={isLoading}
                    choices={choices!}
                    value={value}
                    setValue={setValue}
                />
                {ChatOptions}
            </Group>
        );
    }

    return (
        <TextInput
            disabled={isLoading}
            onChange={(event) => {
                setValue(event.target.value);
            }}
            rightSection={ChatOptions}
        />
    );
}

