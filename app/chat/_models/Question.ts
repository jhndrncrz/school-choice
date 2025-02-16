import Result from "./Result";

export default interface Question {
    answer: string[];
    question: string;
    type: string;
    choices?: string[]
    parameter: string;
    fallback: string;

    result?: Result;
    left?: Question;
    right?: Question;
}