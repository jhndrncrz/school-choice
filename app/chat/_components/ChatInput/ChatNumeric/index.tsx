import { NumberInput } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

interface ChatNumericProps {
    isLoading: boolean;
    value: string | null;
    setValue: Dispatch<SetStateAction<string | null>>;
}

export default function ChatNumeric({ isLoading, value, setValue }: ChatNumericProps) {
    return (
        <NumberInput 
            disabled={isLoading}
            value={parseInt(value!)} 
            onChange={(event) => {
                setValue(event.toString());
            }} 
        />
    );
}