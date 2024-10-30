"use client";

import { ButtonLink } from "@/components/ui/button";
import Image from "next/image";
import { useMotionValue, useTransform, motion, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Workspace from "@/components/section/workspace";
import Logo from "@/components/ui/logo";
import { LenisRef, ReactLenis, useLenis } from "lenis/react";
import Snap from "lenis/snap";
import ContactForm from "@/components/ui/contact-form";
import { DraggableCards } from "@/components/ui/draggableCards";
import { useMediaQuery } from "@/hooks/use-media-query";

const cursorHeroAnimationConfig = {
  rotateX: [-2, 2],
  rotateY: [5, -5],
  translateX: [-10, 10],
  blur: ["blur(20px)", "blur(5px)", "blur(0px)", "blur(5px)", "blur(10px)"],
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

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
        type: "proximity",
        velocityThreshold: isMobile ? 0.3 : 0.5,
        lerp: isMobile ? 0.1 : 0.05,
        duration: isMobile ? 0.8 : 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      // snap.addElement(heroRef.current);
      // snap.addElement(aboutMeRef.current);
      // snap.add(aboutMeRef.current.offsetTop + 100);
      snap.addElement(workspaceRef.current);
      snap.addElement(contactRef.current);

      // Optimize scroll handler
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollPos = window.scrollY;
            const workspacePos = workspaceRef.current?.offsetTop || 0;
            const contactPos = contactRef.current?.offsetTop || 0;
            // const aboutmePos = aboutMeRef.current?.offsetTop || 0;
            // const heroPos = heroRef.current?.offsetTop || 0;

            if (
              Math.abs(scrollPos - workspacePos) > 400 &&
              Math.abs(scrollPos - contactPos) > 400
            ) {
              snap.stop();
            } else {
              snap.start();
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lenis, isMobile]);

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

  const handleMouseScreen = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Disable on mobile

    const rect = event.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = event;

    // Throttle calculations
    requestAnimationFrame(() => {
      const x = ((clientX - rect.left) / rect.width) * 200 - 100;
      const y = ((clientY - rect.top) / rect.height) * 200 - 100;

      const clampedX = Math.max(-100, Math.min(100, x));
      const clampedY = Math.max(-100, Math.min(100, y));

      cursorX.set(clampedX);
      cursorY.set(clampedY);
    });
  };

  const scrollToSection = (scrollref: string) => () => {
    const ref = {
      aboutme: aboutMeRef,
      workspace: workspaceRef,
      contact: contactRef,
      hero: heroRef,
    }[scrollref];

    ref?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ReactLenis ref={lenisRef} root>
      {/* Logo */}
      <div
        className="fixed w-10 h-10 md:w-16 md:h-16 top-[2vw] left-[2vw] bg-neutral-950 z-50 flex justify-center items-center p-2 cursor-pointer"
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
        className="hero-section relative overflow-hidden h-[100vh] w-full flex flex-col items-center justify-start perspective-deep"
      >
        <motion.div
          style={{
            rotateX: useTransform(
              cursorY,
              [-100, 100],
              cursorHeroAnimationConfig.rotateX
            ),
            rotateY: useTransform(
              cursorX,
              [-100, 100],
              cursorHeroAnimationConfig.rotateY
            ),
            translateX: useTransform(
              cursorX,
              [-100, 100],
              cursorHeroAnimationConfig.translateX
            ),
            translateY: useTransform(
              scrollYProgressWorkspace,
              [isTablet || isMobile ? 0 : 1, 0],
              ["100%", "0%"]
            ),
            filter: useTransform(
              cursorX,
              [-100, -50, 0, 50, 100],
              cursorHeroAnimationConfig.blur
            ),

            scale: 1.05,
          }}
          className="background z-0 absolute inset-0 m-auto h-full w-full pointer-events-none"
        >
          <Image
            src="/bg.jpg"
            alt="background"
            width={isMobile ? 1454 : 2908}
            height={isMobile ? 819 : 1638}
            className="h-full w-full object-cover object-bottom"
            priority
            quality={isMobile ? 75 : 90}
          />
        </motion.div>
        <motion.div
          style={{
            rotateX: useTransform(cursorY, [-100, 100], [10, -10]),
            rotateY: useTransform(cursorX, [-100, 100], [15, -15]),
            translateX: useTransform(cursorX, [-100, 100], ["0%", "3%"]),
            translateY: useTransform(
              scrollYProgressWorkspace,
              [isTablet || isMobile ? 0 : 1, 0],
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
            display: isMobile || isTablet ? "none" : "block",
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
              [isTablet || isMobile ? 0 : 1, 0],
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
          background:
            "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url('/projectbackground-min1.jpg')",
          backgroundSize: "cover",
          filter: "brigthness(0.1)",
        }}
        id="showcase"
        ref={workspaceRef}
      >
        <Workspace />
        <motion.div
          style={{
            opacity: useTransform(scrollYProgressAboutme, [0, 0.2], [0, 1]),
          }}
          className="absolute inset-0 z-20 bg-neutral-950 pointer-events-none"
        ></motion.div>
      </motion.div>

      {/* About me section */}
      <motion.div
        className="w-full min-h-[100vh] mt-[5vh] bg-neutral-950"
        id="aboutme"
        ref={aboutMeRef}
      >
        <div className="w-full h-full text-white flex flex-col items-center justify-start">
          <div className="relative example-5 mt-[5vh] max-w-[60vw]">
            <motion.div
              style={{
                opacity: useTransform(
                  scrollYProgressAboutme,
                  [0.3, 0.4],
                  [1, 0]
                ),
              }}
            >
              <Image
                src="/aboutme-min.jpg"
                alt="background"
                width={2908}
                height={1638}
                className="h-full w-full object-cover object-bottom rounded-xl"
              />
            </motion.div>

            <motion.svg
              style={{
                opacity: useTransform(
                  scrollYProgressAboutme,
                  [0.3, 0.4],
                  [0, 1]
                ),
              }}
              height="100%"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                rx="8"
                ry="8"
                className="line translate-y-[25%]"
                height="50%"
                width="100%"
                strokeLinejoin="round"
              />
            </motion.svg>

            <div
              style={{
                backgroundImage: "url('/aboutme-min.jpg')",
                backgroundSize: "cover",
                backgroundClip: "text",
              }}
              className="absolute font-black text-transparent inset-0 text-[calc(10vw)] flex justify-center items-center"
            >
              About me
            </div>
          </div>

          <div className="col mt-[5vh] w-full max-w-[60vw] mx-auto">
            <div className="w-full align-left text-4xl mb-10">
              Je suis un développeur français basé à Nantes, France.
            </div>
            <div className="w-full align-left text-2xl leading-10">
              En tant que développeur, cela fait plus de 4ans que je pratique le
              design, tant graphique que technique, ainsi que le clean-code afin
              de produire une solution élégante et créative.
            </div>
            <div className="w-full align-left text-2xl leading-10">
              Je suis passionné de nouvelles technologies, mais également très
              familier des problématiques sociales.
            </div>
          </div>
        </div>

        <section className="relative grid min-h-screen w-[80vw] mx-auto place-content-center">
          <DraggableCards />
        </section>

        {/* <div className="text-white mt-[5vh] w-full max-w-[60vw] mx-auto">
          tech i use for work/fun
        </div> */}
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
          className="absolute z-30 inset-0 bg-neutral-950 pointer-events-none"
        ></motion.div>

        <ContactForm />
      </motion.div>
    </ReactLenis>
  );
}
