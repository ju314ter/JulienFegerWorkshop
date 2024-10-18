"use client";

import { ButtonLink } from "@/components/ui/button";
import Image from "next/image";
import { useMotionValue, useTransform, motion, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Workspace from "@/components/section/workspace";
import Logo from "@/components/ui/logo";
import { LenisRef, ReactLenis, useLenis } from "lenis/react";
import Snap from "lenis/snap";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<LenisRef>(null);

  const lenis = useLenis();

  useEffect(() => {
    if (
      lenisRef.current &&
      lenis &&
      heroRef.current &&
      workspaceRef.current &&
      aboutMeRef.current &&
      contactRef.current
    ) {
      const snap = new Snap(lenis, {
        type: "proximity", // 'mandatory' or 'proximity'
        velocityThreshold: 0.5, // increase this to require more deliberate scrolling
        lerp: 0.05, // lower value = smoother snap animation
        duration: 1, // duration of snap animation in seconds
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // custom easing
      });

      snap.addElement(heroRef.current);
      snap.addElement(workspaceRef.current);
      snap.addElement(aboutMeRef.current);
      snap.addElement(contactRef.current);

      // For finer control, you can also track scroll position and enable/disable snap
      const handleScroll = () => {
        const scrollPos = window.scrollY;
        const workspacePos = workspaceRef.current?.offsetTop || 0;
        const aboutmePos = aboutMeRef.current?.offsetTop || 0;
        const contactPos = contactRef.current?.offsetTop || 0;
        const heroPos = heroRef.current?.offsetTop || 0;

        if (
          Math.abs(scrollPos - heroPos) > 300 &&
          Math.abs(scrollPos - workspacePos) > 300 &&
          Math.abs(scrollPos - aboutmePos) > 300 &&
          Math.abs(scrollPos - contactPos) > 300
        ) {
          snap.stop();
        } else {
          console.log("snapping");
          snap.start();
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lenis]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const { scrollYProgress: scrollYProgressWorkspace } = useScroll({
    target: workspaceRef,
    offset: ["start end", "end end"],
  });

  const { scrollYProgress: scrollYProgressAboutme } = useScroll({
    target: aboutMeRef,
    offset: ["start end", "end end"],
  });

  const { scrollYProgress: scrollYProgressContact } = useScroll({
    target: contactRef,
    offset: ["start end", "end end"],
  });

  // useMotionValueEvent(scrollYProgressContact, "change", (x) => {
  //   console.log(x);
  // });

  const handleMouseScreen = (event: React.MouseEvent<HTMLDivElement>) => {
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

  const scrollToSection = (scrollref: string) => () => {
    switch (scrollref) {
      case "aboutme":
        aboutMeRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "workspace":
        workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "contact":
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "hero":
        heroRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  return (
    <ReactLenis ref={lenisRef} root>
      {/* Logo */}
      <div
        className="fixed w-20 h-20 top-[2vw] left-[2vw] bg-black z-50 flex justify-center items-center p-2 cursor-pointer"
        onClick={scrollToSection("hero")}
      >
        <Logo className="w-full h-full" />
      </div>

      {/* Hero section */}
      <motion.div
        ref={heroRef}
        initial={{ filter: "blur(20px)", pointerEvents: "none" }}
        animate={{ filter: "blur(0px)", pointerEvents: "auto" }}
        style={{
          opacity: useTransform(scrollYProgressWorkspace, [0.8, 0.1], [0, 1]),
        }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onMouseMove={handleMouseScreen}
        className="hero-section bg-violet-700 relative overflow-hidden h-[100vh] w-full flex flex-col items-center justify-start perspective-deep"
      >
        <motion.div
          style={{
            rotateX: useTransform(cursorY, [-100, 100], [-2, 2]),
            rotateY: useTransform(cursorX, [-100, 100], [5, -5]),
            translateX: useTransform(cursorX, [-100, 100], [-10, 10]),
            translateY: useTransform(
              scrollYProgressWorkspace,
              [1, 0],
              ["100%", "0%"]
            ),
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
            translateY: useTransform(
              scrollYProgressWorkspace,
              [1, 0],
              ["100%", "0%"]
            ),

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
            translateY: useTransform(
              scrollYProgressWorkspace,
              [1, 0],
              ["100%", "0%"]
            ),
            opacity: useTransform(scrollYProgressWorkspace, [0.4, 0], [0, 1]),
          }}
          className="navigation relative z-40 min-w-[300px] max-w-[1200px] w-[50%] mt-[10vh] flex flex-col items-center justify-start"
        >
          {[
            { title: "bout me", scrollref: "aboutme" },
            { title: "orkspace", scrollref: "workspace" },
            { title: "ontact", scrollref: "contact" },
          ].map((item, i) => (
            <ButtonLink
              key={i}
              className="bg-transparent my-12 w-full h-24 text-[3rem] md:text-[5rem] lg:text-[8rem] xl:text-[10rem] menu-button"
              onClick={scrollToSection(item.scrollref)}
              emphaseLetter={item.scrollref[0].toUpperCase()}
            >
              {item.title}
            </ButtonLink>
          ))}
        </motion.div>
      </motion.div>

      {/* Workspace section */}
      <motion.div
        className="w-full relative h-[100vh] flex flex-col items-center overflow-hidden border-t-2 border-white"
        style={{
          backgroundImage: "url('/projectbackground-min1.jpg')",
          backgroundSize: "cover",
        }}
        id="showcase"
        ref={workspaceRef}
      >
        <Workspace />
        <motion.div
          style={{
            opacity: useTransform(scrollYProgressAboutme, [0, 0.2], [0, 1]),
          }}
          className="absolute inset-0 bg-black pointer-events-none"
        ></motion.div>
      </motion.div>

      {/* About me section */}
      <motion.div
        className="w-full h-[200vh] bg-purple-300 relative"
        id="aboutme"
        ref={aboutMeRef}
      >
        <div className="w-full h-full text-white bg-black flex flex-col items-center justify-start">
          <h1 className="mt-[10vh]">About me...</h1>
          <div>
            Hello ! I&apos;m a french JS developper based in Nantes, France.
          </div>
          <div className="m-w-[500px] align-left">
            Hello, I&apos;m a french JS developper with a <b>strong</b> passion
            to design, code and create stuff. Not only am I passionate about new
            tech, but also favor all kinds of arts and am well versed with
            socials problematics.
          </div>
        </div>
      </motion.div>

      {/* Contact me section */}
      <motion.div
        id="contact"
        ref={contactRef}
        onMouseMove={handleMouseScreen}
        className="contact-section bg-violet-700 relative overflow-hidden h-[100vh] w-full flex items-center justify-center perspective-deep"
      >
        <motion.div
          style={{
            rotateX: useTransform(cursorY, [-100, 100], [-2, 2]),
            rotateY: useTransform(cursorX, [-100, 100], [5, -5]),
            translateX: useTransform(cursorX, [-100, 100], [-10, 10]),
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
            src="/emptyoffice-min.jpg"
            alt="background"
            width={2908}
            height={1638}
            className="h-full w-full object-cover object-bottom"
          />
        </motion.div>

        <motion.div
          style={{
            opacity: useTransform(scrollYProgressContact, [1, 0], [0, 1]),
          }}
          className="absolute z-30 inset-0 bg-black pointer-events-none"
        ></motion.div>

        <div className="w-[60%] h-[60%] bg-black/50 backdrop-blur-xl flex flex-col rounded-tl-md rounded-tr-md shadow-xl">
          <div className="relative h-10 w-full bg-[#121728] rounded-tl-md rounded-tr-md flex justify-center">
            <div className="absolute top-0 left-0 w-24 h-full flex justify-center items-center gap-2 rounded-tl-md">
              <div
                className="w-4 h-4 rounded-full bg-red-500 cursor-pointer"
                onClick={scrollToSection("hero")}
              ></div>
              <div
                className="w-4 h-4 rounded-full bg-orange-500 cursor-pointer"
                onClick={scrollToSection("workspace")}
              ></div>
              <div
                className="w-4 h-4 rounded-full bg-green-500 cursor-pointer"
                onClick={() => alert("Call me baby")}
              ></div>
            </div>
            <div className="h-full flex justify-center items-center text-white">
              julien.feger@gmail.com
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2 w-full text-white">
            <span>Salut ! Je m&apos;apelle ...</span>
            <span>Je suis ...</span>
            <span>J&apos;aimerais te parler de ...</span>
            <span>A bientôt !</span>
          </div>
        </div>
      </motion.div>
    </ReactLenis>
  );
}
