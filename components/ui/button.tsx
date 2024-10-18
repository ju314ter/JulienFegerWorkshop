import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black text-primary-foreground",
        projectSort:
          "cursor-pointer bg-transparent text-white hover:text-black duration-300 h-[5rem] rounded-none text-xl md:text-3xl font-bold text-center border-2 border-white p-4",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2 w-full",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  emphaseLetter?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const ButtonSort = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const [yMockTop, setYMockTop] = React.useState("-100%");
    const [yReal, setYReal] = React.useState("0%");
    const [yMockBot, setYMockBot] = React.useState("100%");
    const [direction, setDirection] = React.useState(true);
    const [isAnimating, setIsAnimating] = React.useState(false);

    const animationDuration = 0.35;

    const onMouseEnter = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      // animate according to direction
      setYMockTop(() => (direction ? "-200%" : "0%"));
      setYReal(() => (direction ? "-100%" : "100%"));
      setYMockBot(() => (direction ? "0%" : "200%"));
    };

    const onMouseLeave = () => {
      // Go back to initial state
      setYMockTop("-100%");
      setYReal("0%");
      setYMockBot("100%");

      // change direction for next animation
      setDirection(!direction);
      setTimeout(() => setIsAnimating(false), animationDuration * 1000);
    };

    const Comp = asChild ? Slot : "button";
    return (
      <div
        className="relative overflow-hidden group bg-transparent"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <motion.div
            animate={{ y: yReal }}
            transition={{
              duration: animationDuration,
              ease: "easeInOut",
              delay: 0.1,
            }}
            className="w-full h-full flex justify-center items-center text-white"
          >
            {props.children}
          </motion.div>
        </Comp>
        <motion.div
          animate={{ y: yMockTop }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            delay: 0.1,
          }}
          className={cn(
            buttonVariants({ variant, size, className }),
            "absolute flex justify-center z-20 inset-0 translate-y-full bg-black/0 border border-white pointer-events-none border-none"
          )}
        >
          {props.children}
        </motion.div>
        <motion.div
          animate={{ y: yMockBot }}
          transition={{
            duration: animationDuration,
            ease: "easeInOut",
            delay: 0.1,
          }}
          className={cn(
            buttonVariants({ variant, size, className }),
            "absolute flex justify-center z-20 inset-0 -translate-y-full bg-black/0 border border-white pointer-events-none border-none"
          )}
        >
          {props.children}
        </motion.div>
      </div>
    );
  }
);
ButtonSort.displayName = "ButtonSort";

const ButtonLink = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, emphaseLetter, ...props },
    ref
  ) => {
    const [hovered, setHovered] = React.useState(false);

    const onMouseEnter = () => {
      setHovered(true);
    };
    const onMouseLeave = () => {
      setHovered(false);
    };

    const Comp = asChild ? Slot : "button";
    return (
      <div
        className="relative overflow-hidden group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Comp
          className={cn("group", buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <div className="relative left-1">
            <span className="relative z-10 group-hover:text-purple-200">
              {emphaseLetter}
            </span>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-purple-700 z-0"
              />
            )}
          </div>
          <div className="group-hover:text-purple-700">{props.children}</div>
        </Comp>
      </div>
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { Button, ButtonSort, ButtonLink, buttonVariants };
