import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export const DraggableCards = () => {
  const containerRef = useRef(null);

  return (
    <div className="absolute inset-0 z-10 perspective-deep" ref={containerRef}>
      <Card
        containerRef={containerRef}
        src="/img/cliq1-min.jpg"
        alt="Example image"
        top="20%"
        left="25%"
        className="w-[40%] lg:w-[25%]"
      />
      <Card
        containerRef={containerRef}
        src="/img/damepascalecarousel-min.jpg"
        alt="Example image"
        top="45%"
        left="60%"
        className="w-[40%] lg:w-[25%]"
      />
      <Card
        containerRef={containerRef}
        src="/img/poolpulseviewpage-min.jpg"
        alt="Example image"
        top="20%"
        left="40%"
        className="w-[40%] lg:w-[25%]"
      />
      <Card
        containerRef={containerRef}
        src="/img/poolpulselanding-min.jpg"
        alt="Example image"
        top="50%"
        left="40%"
        className="w-[40%] lg:w-[25%]"
      />
      <Card
        containerRef={containerRef}
        src="/img/patisserie1-min.jpg"
        alt="Example image"
        top="20%"
        left="5%"
        className="w-[20%] lg:w-[15%]"
      />
      <Card
        containerRef={containerRef}
        src="/img/tft1-min.jpg"
        alt="Example image"
        top="35%"
        left="55%"
        className="w-[20%] lg:w-[15%]"
      />
    </div>
  );
};

interface CardProps {
  containerRef: React.RefObject<HTMLDivElement>; // or the appropriate type
  src: string;
  alt: string;
  top: string;
  left: string;
  className?: string;
}
const Card = ({ containerRef, src, alt, top, left, className }: CardProps) => {
  const [zIndex, setZIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);

  const dragRef = useRef<HTMLDivElement>(null);

  // const handleCardMoveX = () => {
  //   if (!dragRef.current) return;
  //   const element = dragRef.current;
  //   const elementWidth = element.offsetWidth;
  //   const elementCenter = element.offsetLeft + elementWidth / 2;

  //   const windowWidth = window.innerWidth;
  //   const screenCenter = windowWidth / 2;

  //   const offsetFromCenter = elementCenter - screenCenter;
  //   const offsetPercentage = (offsetFromCenter / windowWidth) * 100;
  //   console.log("card move", offsetPercentage);
  //   offsetPercentageValue.set(offsetPercentage);
  // };

  const updateZIndex = () => {
    const els = document.querySelectorAll(".drag-elements");

    let maxZIndex = -Infinity;

    els.forEach((el) => {
      const zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );

      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });

    setZIndex(maxZIndex + 1);
  };

  return (
    <motion.div
      ref={dragRef}
      onMouseDown={updateZIndex}
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      style={{
        top,
        left,
        zIndex,
        rotate,
        x,
      }}
      transition={{ delay: 0.2 }}
      className={cn(
        "drag-elements absolute example-5 w-48 bg-neutral-200 rounded-md cursor-grab",
        className
      )}
      drag
      dragConstraints={containerRef}
      // Uncomment below and remove dragElastic to remove movement after release
      //   dragMomentum={false}
      dragElastic={0.65}
    >
      <svg
        height="100%"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        className=" rounded-md"
      >
        <rect
          rx="8"
          ry="8"
          className="line"
          height="100%"
          width="100%"
          strokeLinejoin="round"
        />
      </svg>
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full inner rounded-md"
      />
    </motion.div>
  );
};
