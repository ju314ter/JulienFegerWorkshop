"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMotionValue, useTransform, motion, useScroll } from "framer-motion";
import { useRef } from "react";
import Workspace from "@/components/section/workspace";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: workspaceRef,
    offset: ["start end", "end end"],
  });

  const handleMouseMoveHero = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = event;

    // Calculate the cursor position relative to the container
    const x = ((clientX - rect.left) / rect.width) * 200 - 100;
    const y = ((clientY - rect.top) / rect.height) * 200 - 100;

    // Ensure the values are within the range of -100 to 100
    const clampedX = Math.max(-100, Math.min(100, x));
    const clampedY = Math.max(-100, Math.min(100, y));

    // Set the motion values
    cursorX.set(clampedX);
    cursorY.set(clampedY);
  };

  // const handleDragWorkspace = (
  //   event: MouseEvent | TouchEvent | PointerEvent,
  //   info: PanInfo
  // ) => {
  //   //const clickedPoint = info.point.x;
  //   // sliderOffset.set(clickedPoint);
  //   console.log("Distance moved:", sliderOffset.get());

  //   // J'ai la taille du slider et l'offset, interpoler sur un range 0,1 pour animer la position
  // };

  const handleScrollToAboutMe = () => {
    aboutMeRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleScrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleScrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero section : TODO => */}
      <motion.div
        ref={heroRef}
        initial={{ filter: "blur(20px)", pointerEvents: "none" }}
        animate={{ filter: "blur(0px)", pointerEvents: "auto" }}
        style={{ opacity: useTransform(scrollYProgress, [0.6, 0.3], [0, 1]) }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onMouseMove={handleMouseMoveHero}
        className="hero-section bg-violet-700 relative overflow-hidden h-[100vh] w-full flex flex-col items-center justify-start perspective-deep"
      >
        <motion.div
          style={{
            rotateX: useTransform(cursorY, [-100, 100], [-2, 2]),
            rotateY: useTransform(cursorX, [-100, 100], [5, -5]),
            translateX: useTransform(cursorX, [-100, 100], [-10, 10]),
            translateY: useTransform(scrollYProgress, [1, 0], ["100%", "0%"]),
            filter: useTransform(
              cursorX,
              [-100, -50, 0, 50, 100],
              [
                "blur(20px)",
                "blur(5px)",
                "blur(0px)",
                "blur(5px)",
                "blur(10px)",
              ]
            ),

            scale: 1.05,
          }}
          className="background z-0 absolute inset-0 m-auto h-full w-full pointer-events-none"
        >
          <Image
            src="/bg.jpg"
            alt="background"
            width={2908}
            height={1638}
            className="h-full w-full object-cover object-bottom"
          />
        </motion.div>
        <motion.div
          style={{
            rotateX: useTransform(cursorY, [-100, 100], [10, -10]),
            rotateY: useTransform(cursorX, [-100, 100], [15, -15]),
            translateX: useTransform(cursorX, [-100, 100], ["0%", "3%"]),
            translateY: useTransform(scrollYProgress, [1, 0], ["100%", "0%"]),

            scale: 1.1,
          }}
          className="rabbit z-30 absolute bottom-0 left-[7vw] h-full w-full pointer-events-none"
        >
          <Image
            src="/rabbit.png"
            alt="rabbit"
            width={2908}
            height={1638}
            className="h-full w-full object-cover"
          />
        </motion.div>
        <motion.div
          style={{
            rotateX: useTransform(cursorY, [-100, 100], [-10, 10]),
            rotateY: useTransform(cursorX, [-100, 0, 100], [10, 0, -10]),
            translateX: useTransform(cursorX, [-100, 100], ["0vw", "-3vw"]),
            translateY: useTransform(
              cursorY,
              [-100, 0, 100],
              ["3vh", "0vh", "3vh"]
            ),
          }}
          className="plant z-10 absolute left-0 h-full w-full pointer-events-none"
        >
          <Image
            src="/plants.png"
            alt="plants"
            width={2908}
            height={1638}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Menu */}
        <motion.div
          style={{
            translateY: useTransform(scrollYProgress, [1, 0], ["100%", "0%"]),
          }}
          className="navigation relative z-40 min-w-[300px] max-w-[1200px] w-[50%] mt-[10vh] flex flex-col gap-[10vh] items-center justify-start"
        >
          <Button
            className="bg-transparent w-full h-24 text-[3rem] md:text-[5rem] lg:text-[8rem] xl:text-[10rem]"
            onClick={handleScrollToAboutMe}
          >
            About me
          </Button>

          <Button
            className="bg-transparent w-full h-24 text-[3rem] md:text-[5rem] lg:text-[8rem] xl:text-[10rem]"
            onClick={handleScrollToWorkspace}
          >
            Workspace
          </Button>
          <Button
            className=" bg-transparent w-full h-24 text-[3rem] md:text-[5rem] lg:text-[8rem] xl:text-[10rem]"
            onClick={handleScrollToContact}
          >
            Contact
          </Button>
        </motion.div>
      </motion.div>

      {/* Workspace section */}
      <div
        className="w-full relative h-[100vh] flex flex-col items-center snap-center overflow-hidden 
        bg-gradient-to-b from-violet-700 to-blue-300"
        id="showcase"
        ref={workspaceRef}
      >
        <Workspace />
      </div>

      {/* About me section */}
      <div
        className="w-full h-[100vh] bg-black snap-center"
        id="aboutme"
        ref={aboutMeRef}
      ></div>

      {/* Contact me section */}
      <div
        className="w-full h-[100vh] bg-gradient-to-b from-blue-300 to-violet-700 snap-center"
        id="contact"
        ref={contactRef}
      ></div>
    </>
  );
}
