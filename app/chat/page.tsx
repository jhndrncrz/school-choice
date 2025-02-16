"use client";

import { useEffect, useState } from "react";
import { Group, Loader, Modal, Paper, RingProgress, Stack, Text } from "@mantine/core";

import { ChatBox, ChatInput } from "./_components";
import { Message, Question } from "./_models";
import { questions } from "./_libraries";

export default function Page() {
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [questionPointer, setQuestionPointer] = useState<Question>(questions);
    const [messages, setMessages] = useState<Message[]>([]);
    const [answeredQuestions, setAnsweredQuestions] = useState<{ question: string, answer: string }[]>([]);

    // Function to add a new message to the conversation
    function addNewMessage(newMessage: Message) {
        if (newMessage.author !== "You") {
            setIsLoading(true);

            // Display temporary loading message
            setMessages((prev) => [...prev, { author: newMessage.author, content: "...", date: new Date() }]);

            // Simulate chatbot response delay
            setTimeout(() => {
                setMessages((prev) => prev.filter((msg) => msg.content !== "..."));
                setMessages((prev) => [...prev, newMessage]);
                setIsLoading(false);
            }, 3000);
        } else {
            setMessages((prev) => [...prev, newMessage]);
        }
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
    function handleUserResponse(newMessage: Message) {
        if (newMessage.author != "REPEAT") {
            addNewMessage(newMessage);
            const newAnswer = { question: questionPointer.question, answer: newMessage.content };
            setAnsweredQuestions((prev) => [...prev, newAnswer]);
        }

        console.log("----------------------");
        console.log("QUESTION: ", questionPointer);
        console.log("MESSAGE: ", newMessage);
        console.log("----------------------");

        // Check if the answer matches either left or right path
        const nextQuestion =
            questionPointer.left?.answer.includes(newMessage.content) ? questionPointer.left :
                questionPointer.right?.answer.includes(newMessage.content) ? questionPointer.right :
                    null;

        console.log("NEXT: ", nextQuestion);
        console.log("----------------------");

        if (nextQuestion) {
            const previousAnswer = answeredQuestions.find((a) => a.question === nextQuestion.question);

            if (previousAnswer) {
                // addNewMessage({ author: "You", content: previousAnswer.answer, date: new Date() });
                addNewMessage({ author: "Lua", content: `Next: ${nextQuestion.question} --- Wait... ${nextQuestion.fallback}`, date: new Date() });
                console.log("REPEATING!");

                setQuestionPointer(nextQuestion);
                askNewQuestion(nextQuestion);

                setTimeout(() => {
                    handleUserResponse({
                        author: "REPEAT",
                        content: previousAnswer.answer,
                        date: new Date()
                    });
                }, 3000);
            } else {
                setQuestionPointer(nextQuestion);
                askNewQuestion(nextQuestion);
            }
        } else {
            addNewMessage({ author: "Lua", content: "I have no more questions for you. We're done! View your results now! ", date: new Date() });
            setTimeout(() => {
                setIsDone(true);
            }, 6000);
        }
    }

    // Initial chatbot introduction sequence
    useEffect(() => {
        const delays = [
            { delay: 0, message: "Hello! I'm Lua. I'll try to predict whether you'll be considering University of the East as your university of choice!" },
            { delay: 3100, message: "I'll be asking you some questions, starting with..." },
            { delay: 6100, action: () => askNewQuestion(questionPointer) }
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
                            onSubmit={handleUserResponse}
                        />
                    </Paper>
                )}
            </Paper>

            {
                isDone &&
                <Modal centered opened={isDone} onClose={() => { }} title="View Results" withCloseButton={false}>
                    <RingProgress
                        label={
                            <Text size="xl" ta="center">
                                {Object.values(questionPointer?.result!).toSorted((a, b) => a - b).toReversed()[0] / Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0)}%
                            </Text>
                        }
                        size={Object.values(questionPointer?.result!).reduce((partialSum, a) => partialSum + a, 0)}
                        thickness={12}
                        roundCaps
                        sections={[
                            { value: questionPointer?.result?.extremely_considered!, color: 'cyan' },
                            { value: questionPointer?.result?.high_consideration!, color: 'orange' },
                            { value: questionPointer?.result?.moderate_consideration!, color: 'yellow' },
                            { value: questionPointer?.result?.neutral!, color: 'teal' },
                            { value: questionPointer?.result?.not_at_all_considered!, color: 'grape' },
                            { value: questionPointer?.result?.did_not_consider!, color: 'red' },
                        ]}
                    />
                </Modal>
            }
        </Stack>
    );
}
