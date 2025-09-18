"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  animationKey?: string | number;
  staggerDelay?: number;
  duration?: number;
  initialDelay?: number;
}

export const AnimatedText = ({
  text,
  className,
  animationKey = text,
  staggerDelay = 0.05,
  duration = 0.5,
  initialDelay = 0,
}: AnimatedTextProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{
          duration,
          delay: initialDelay,
          ease: [0.25, 0.46, 0.45, 0.94],
          scale: { duration: duration * 0.6 },
        }}
        className={cn("", className)}
      >
        {text.split(" ").map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: duration * 0.6,
              delay: initialDelay + index * staggerDelay,
              ease: "easeOut",
            }}
            className="mr-1 inline-block"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

// Typing effect variant
export const TypingText = ({
  text,
  className,
  speed = 50,
}: {
  text: string;
  className?: string;
  speed?: number;
}) => {
  return (
    <motion.div
      className={cn("", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: index * (speed / 1000),
            duration: 0.1,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Word reveal effect
export const WordReveal = ({
  text,
  className,
  delay = 0.1,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={index}
          className="mr-1 inline-block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{
            delay: index * delay,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
