'use client';

import { motion } from "framer-motion";
import { forwardRef, useState, useId } from "react";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  prefix?: string;
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      className,
      label,
      error,
      icon,
      iconPosition = "left",
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const id = useId();

    return (
      <div className="relative group">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 transition-colors group-hover:text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center border-b border-zinc-200 transition-colors focus-within:border-foreground">
          {icon && iconPosition === "left" && (
            <div className={`mr-2 transition-colors ${isFocused ? 'text-foreground' : 'text-zinc-300'}`}>
              {icon}
            </div>
          )}

          {props.prefix && (
             <span className="mr-0.5 text-xl font-medium text-zinc-400 select-none">
                {props.prefix}
             </span>
          )}
          
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full bg-transparent py-3 text-xl font-medium outline-none transition-all placeholder:text-zinc-500/50",
              error ? "text-red-500" : "text-foreground",
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />

          {icon && iconPosition === "right" && (
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-foreground' : 'text-zinc-300'}`}>
              {icon}
            </div>
          )}
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export default AnimatedInput;
