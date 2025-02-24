"use client";

import { useEffect, useState } from "react";
import { Badge, Divider, Group, Loader, Modal, Paper, RingProgress, Stack, Table, Text } from "@mantine/core";

import { ChatBox, ChatInput } from "./_components";
import { Message, Question } from "./_models";
import { mapping, questions } from "./_libraries";

export default function Page() {
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [questionPointer, setQuestionPointer] = useState<Question>(questions);
    const [messages, setMessages] = useState<Message[]>([]);
    const [answeredQuestions, setAnsweredQuestions] = useState<{ question: string, answer: string }[]>([]);

    // Function to add a new message to the conversation
    function addNewMessage(newMessage: Message) {
        setMessages((prev) => [...prev, newMessage]);
    }

    // Function to make Lua ask a new question
    function askNewQuestion(newQuestion: Question) {
        addNewMessage({
            author: "Lua",
            content: newQuestion.question,
            date: new Date()
        });
    }

    // Function to handle user's response
    function handleUserResponse(question: Question, newMessage: Message, answered: {question: string, answer: string}[]) {
        console.log("Question: ", question);
        console.log("Response: ",newMessage);
        console.log("Answered Questions: ", answeredQuestions);
        console.log("---------------------");


        if (newMessage.author != "REPEAT") {
            addNewMessage(newMessage);
            const newAnswer = { question: question.question, answer: newMessage.content };
            answered.push(newAnswer);
            setAnsweredQuestions((prev) => answered);
        }

        // Check if the answer matches either left or right path
        const nextQuestion =
            question.left?.answer.includes(newMessage.content) ? question.left :
                question.right?.answer.includes(newMessage.content) ? question.right :
                    null;

        if (nextQuestion) {
            const previousAnswer = answered.find((a) => a.question === nextQuestion.question);

            if (previousAnswer) {
                // addNewMessage({ author: "You", content: previousAnswer.answer, date: new Date() });
                addNewMessage({ author: "Lua", content: `${nextQuestion.question} - Wait... ${nextQuestion.fallback}`, date: new Date() });

                setQuestionPointer(nextQuestion);

                handleUserResponse(
                    nextQuestion,
                    {
                        author: "REPEAT",
                        content: previousAnswer.answer,
                        date: new Date()
                    },
                    answered
                );
            } else {
                setQuestionPointer(nextQuestion);
                askNewQuestion(nextQuestion);
            }
        } else {
            setIsDone(true);
        }
    }

    // Initial chatbot introduction sequence
    useEffect(() => {
        const delays = [
            { delay: 0, message: "Hello! I'm Lua. I'll try to predict whether you'll be considering University of the East as your university of choice!" },
            { delay: 0, message: "I'll be asking you some questions, starting with..." },
            { delay: 0, action: () => askNewQuestion(questionPointer) }
        ];

        const timeouts = delays.map(({ delay, message, action }) =>
            setTimeout(() => message ? addNewMessage({ author: "Lua", content: message, date: new Date() }) : action!(), delay)
        );

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <Stack
            p="xl"
            bg="red"
            align="stretch"
            style={{
                minHeight: "100vh"
            }}
        >
            <Paper
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--mantine-spacing-xl)"
                }}
                p="xl"
                radius="xl"
                shadow="xl"
            >
                <ChatBox authorOne="You" authorTwo="Lua" messages={messages} />
                {isLoading ? (
                    <Group justify="center" align="center">
                        <Loader />
                    </Group>
                ) : (
                    <Paper withBorder p="xl" radius="lg" shadow="lg">
                        <ChatInput
                            isLoading={isLoading}
                            type={questionPointer?.type}
                            choices={questionPointer.choices}
                            onSubmit={(newMessage: Message) => handleUserResponse(questionPointer, newMessage, answeredQuestions)}
                        />
                    </Paper>
                )}
            </Paper>

            {
                isDone &&
                <Modal centered opened={isDone} onClose={() => { }} title={<Text size="xl" fw="bold">View Results</Text>} withCloseButton={false}>
                    <Stack align="center">
                        <Text>
                            You are...
                        </Text>
                        <RingProgress
                            label={
                                <Text size="2rem" ta="center" fw="bold">
                                    {(100 * Object.values(questionPointer?.result!).toSorted((a, b) => a - b).toReversed()[0] / Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0)).toFixed(2)}%
                                </Text>
                            }
                            size={200}
                            thickness={16}
                            roundCaps
                            sections={[
                                { value: 100 * questionPointer?.result?.extremely_considered! / Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0), color: 'cyan' },
                                { value: 100 * questionPointer?.result?.high_consideration! / Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0), color: 'orange' },
                                { value: 100 * questionPointer?.result?.moderate_consideration! / Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0), color: 'yellow' },
                                { value: 100 * questionPointer?.result?.neutral! / Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0), color: 'teal' },
                                { value: 100 * questionPointer?.result?.not_at_all_considered! / Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0), color: 'grape' },
                                { value: 100 * questionPointer?.result?.did_not_consider! / Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0), color: 'red' },
                            ]}
                        />  
                        <Text>
                            likely to be <Text component="span" fw="bold">{mapping[(Object.keys(questionPointer?.result ?? {failed: "error"}).reduce((a, b) => (questionPointer?.result?.[a]!) > questionPointer?.result?.[b]! ? a : b))]}</Text> to enroll in University of the East!
                        </Text>
                    </Stack>

                    <Divider my="lg" />

                    <Stack>
                        <Text c="dimmed">
                            This is how many people {" "}<Text component="span" fw="bold" fs="italic">(compared to over a hundred participants!)</Text>{" "} have similar background to you...
                        </Text>

                        <Table highlightOnHover withColumnBorders withRowBorders={false}>
                            <Table.Tbody>
                            <Table.Tr>
                                <Table.Td><Badge color="cyan">Extremely Considered</Badge></Table.Td>
                                <Table.Th>{questionPointer?.result?.extremely_considered!}</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td><Badge color="orange">High Consideration</Badge></Table.Td>
                                <Table.Th>{questionPointer?.result?.high_consideration!}</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td><Badge color="yellow">Moderate Consideration</Badge></Table.Td>
                                <Table.Th>{questionPointer?.result?.moderate_consideration!}</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td><Badge color="teal">Neutral</Badge></Table.Td>
                                <Table.Th>{questionPointer?.result?.neutral!}</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td><Badge color="grape">Not at All Considered</Badge></Table.Td>
                                <Table.Th>{questionPointer?.result?.not_at_all_considered!}</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td><Badge color="red">Did Not Consider</Badge></Table.Td>
                                <Table.Th>{questionPointer?.result?.did_not_consider!}</Table.Th>
                            </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Stack>
                </Modal>
            }
        </Stack>
    );
}
