"use client";

import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FormEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <InputGroup size="lg">
            <Input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Ask for deals, compare products, or build a cart..."
              pr="6.5rem"
              bg="white"
              color="gray.900"
              borderColor="gray.200"
              _placeholder={{ color: "gray.500" }}
              _focusVisible={{ borderColor: "purple.500", boxShadow: "none" }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSubmit();
                }
              }}
            />
            <InputRightElement width="6.5rem">
              <Button
                type="submit"
                colorScheme="purple"
                width="100%"
                isLoading={isLoading}
                loadingText="Sending"
                isDisabled={!value.trim()}
              >
                Send
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </div>
  );
}
