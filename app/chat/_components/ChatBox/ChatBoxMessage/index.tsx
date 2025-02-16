"use client";

import { Card, Divider, Group, Text } from "@mantine/core";

interface ChatMessageProps {
    background: "red" | "gray";
    author: string;
    content: string;
    date: Date;
}

export default function ChatMessage({ background, author, content, date }: ChatMessageProps) {
    return (
        <Card bg={`${background}.1`} radius="lg" shadow="md">
            <Text size="xl" c="bright">
                {content}
            </Text>

            <Divider my="xs" />

            <Group justify="space-between">
                <Text c="dimmed" tt="uppercase">
                    {author}
                </Text>

                <Divider />

                <Text c="dimmed" tt="uppercase">
                    {date.toUTCString()}
                </Text>
            </Group>
        </Card>
    );
}