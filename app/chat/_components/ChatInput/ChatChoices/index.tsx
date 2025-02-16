"use client";

import { Dispatch, SetStateAction } from "react";

import { Group, Radio, Stack, Text } from "@mantine/core";

import classes from "./chat-choices.module.css";

interface ChatChoicesProps {
    isLoading: boolean;
    choices: string[];
    value: string | null;
    setValue: Dispatch<SetStateAction<string | null>>;
}

export default function ChatChoices({ isLoading, choices, value, setValue }: ChatChoicesProps) {
    const cards = choices.map((choice) => (
        <Radio.Card disabled={isLoading} className={classes.root} radius="md" value={choice} key={choice}>
            <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator />

                <div>
                    <Text className={classes.label}>{choice}</Text>
                </div>
            </Group>
        </Radio.Card>
    ));

    return (
        <Radio.Group
            className={classes.container}
            value={value}
            onChange={setValue}
            label="Select from the following choices"
        >
            <Group pt="md" gap="xs" align="stretch">
                {cards}
            </Group>
        </Radio.Group>
    );
}