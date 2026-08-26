import {
  TypingText,
  TypingTextCursor,
} from "@/components/animate-ui/primitives/texts/typing";

interface TypingTextProps {
  delay: number;
  holdDelay: number;
  loop: boolean;
  cursor: boolean;
  text: string;
}

export const TypingTextDemo = ({
  delay,
  holdDelay,
  loop,
  cursor,
  text,
}: TypingTextProps) => {
  return (
    <TypingText
      key={`${delay}-${holdDelay}-${loop}-${cursor}`}
      delay={delay}
      holdDelay={holdDelay}
      className="text-5xl font-semibold"
      text={text}
      loop={loop}
    >
      {cursor && <TypingTextCursor className="!h-8 !w-1 rounded-full ml-1" />}
    </TypingText>
  );
};
