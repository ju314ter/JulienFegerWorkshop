"use client";

import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { shuffleArray } from "@/lib/utils";
import { ButtonSort } from "../ui/button";
import { data, SlideItem } from "@/data/projects";

const Workspace = () => {
  const workspaceSliderRef = useRef<HTMLDivElement>(null);
  const [sliderData, setSliderData] = useState<SlideItem[]>(data);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderOffset = useMotionValue(0);
  const [hideSortSlider, setHideSortSlider] = useState(false);
  const xSmooth = useSpring(sliderOffset, { damping: 50, stiffness: 400 });
  const xVelocity = useVelocity(xSmooth);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = workspaceSliderRef.current?.offsetWidth || 0;
      const parentWidth =
        workspaceSliderRef.current?.parentElement?.clientWidth || 0;
      setSliderWidth(containerWidth - parentWidth / 2);
    };

    handleResize(); // Set initial width
    sortData("date"); // set initial sort to date sorting
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // update sort slider visibility on slider drag
  useMotionValueEvent(sliderOffset, "change", (x) => {
    return x < -100 ? setHideSortSlider(true) : setHideSortSlider(false);
  });

  const sortData = (sort: string) => {
    switch (sort) {
      case "date":
        setSliderData(
          [...data].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
        break;
      case "eco":
        setSliderData(
          [...data].sort((a, b) => {
            const tagsDiff = a.tags.length - b.tags.length;
            if (tagsDiff !== 0) {
              return tagsDiff;
            } else {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
          })
        );
        break;
      case "role":
        setSliderData(
          [...data].sort((a, b) => {
            const roleDiff = b.role.localeCompare(a.role);
            if (roleDiff !== 0) {
              return roleDiff;
            } else {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
          })
        );
        break;
      case "random":
        setSliderData(shuffleArray([...data]));
        break;
      default:
        break;
    }
  };

  const velocityPercent = useTransform(xVelocity, [-2000, 0, 2000], [1, 0, 1]);
  const velocityPercentSmooth = useSpring(velocityPercent, {
    damping: 50,
    stiffness: 400,
  });

  const positionPercent = useTransform(xSmooth, [0, -sliderWidth], [0, 1]);

  return (
    <>
      <div className="relative flex items-end w-full h-[80%]">
        <motion.div
          variants={{
            visible: { translateX: 0 },
            hidden: { translateX: "-200%" }, // Adjust the translation value as needed
          }}
          animate={hideSortSlider ? "hidden" : "visible"}
          className="absolute left-[2vw] flex flex-col gap-10 text-xl"
        >
          <ButtonSort variant={"projectSort"} onClick={() => sortData("date")}>
            Date
          </ButtonSort>
          <ButtonSort variant={"projectSort"} onClick={() => sortData("eco")}>
            Ecosystem
          </ButtonSort>
          <ButtonSort variant={"projectSort"} onClick={() => sortData("role")}>
            Rôle
          </ButtonSort>
          <ButtonSort
            variant={"projectSort"}
            onClick={() => sortData("random")}
          >
            Random
          </ButtonSort>
        </motion.div>
        <motion.div
          id="showcase"
          ref={workspaceSliderRef}
          drag="x"
          dragConstraints={{ left: -sliderWidth, right: 0 }}
          style={{ x: sliderOffset }}
          className="scrollable-projects-wrapper overflow-visible h-[70%] ml-[20vw] inline-flex items-center"
        >
          <motion.ul
            initial={{ opacity: 0, y: "20%" }}
            whileInView={{ opacity: 1, y: 0 }}
            className="w-full h-full flex"
          >
            <AnimatePresence>
              {sliderData.map((project) => (
                <motion.li
                  key={project.name}
                  layout
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded item group text-white bg-transparent h-full w-[10vw] cursor-grab flex justify-center"
                >
                  <ProjectCard
                    project={project}
                    positionPercent={positionPercent}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </motion.div>
      </div>
      <div className="flex justify-between items-end w-full h-[20%]">
        {data.map((project, i) => (
          <ProjectCandle
            key={i}
            velocityPercent={velocityPercentSmooth}
            index={i}
            positionPercent={positionPercent}
            totalItems={data.length}
            onClick={(indexPercent: number) => {
              const targetX = indexPercent * sliderWidth;
              console.log(positionPercent.get() * sliderWidth, -targetX);
              // animate("#showcase", { translateX: -targetX }, { duration: 0.5 });
            }}
          />
        ))}
      </div>
    </>
  );
};

const ProjectCard: React.FC<{
  project: SlideItem;
  positionPercent: MotionValue<number>;
}> = ({ project, positionPercent }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const offset = useTransform(positionPercent, [0, 1], [30, 70]);

  useMotionValueEvent(offset, "change", (x) => {
    if (imageRef.current) {
      imageRef.current.style.objectPosition = `${x}%`;
    }
  });

  return (
    <div className="relative flex justify-center h-full w-[70%] border-4 border-black">
      <Image
        ref={imageRef}
        src={project.imgHeroUrl}
        alt={project.description}
        width={2000}
        height={1000}
        draggable={false}
        className={`absolute top-0 left-0 h-full object-cover`}
      />
      {/* <div className="absolute bottom-0 opacity-0 group-hover:translate-y-full group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
        {project.tags.map((tag) => (
          <span key={project.name + tag} className="text-white text-xl">
            {tag}
          </span>
        ))}
      </div> */}
    </div>
  );
};

const ProjectCandle: React.FC<{
  index: number;
  velocityPercent: MotionValue<number>;
  positionPercent: MotionValue<number>;
  totalItems: number;
  onClick: (indexPercent: number) => void;
}> = ({ index, velocityPercent, positionPercent, totalItems, onClick }) => {
  const scaleY = useMotionValue(0.2);
  const minScale = 0.2; // Minimum scale value
  const maxScale = 2; // Maximum scale value

  const motionIndex = useMotionValue(index);
  const indexPercent = useTransform(motionIndex, [0, totalItems], [0, 1]);

  const scalingFactor = useMotionValue(
    minScale +
      (maxScale - minScale) *
        (1 - Math.abs(indexPercent.get() - positionPercent.get()))
  );

  const violet = (saturation: number) => `hsl(262, ${saturation}%, 75%)`;
  const backgroundColor = useTransform(
    scalingFactor,
    [minScale, maxScale],
    [violet(0), violet(100)]
  );
  const opacity = useTransform(scalingFactor, [minScale, maxScale], [0, 1]);

  useMotionValueEvent(velocityPercent, "change", (x) => {
    // Apply the scaling factor to the range
    const scale =
      minScale +
      (maxScale - minScale) *
        (1 - Math.abs(indexPercent.get() - positionPercent.get()));

    scalingFactor.set(scale);

    scaleY.set(0.2 + x * scale);
  });

  return (
    <motion.div
      style={{
        scaleY: scaleY,
        transformOrigin: "center bottom",
        backgroundColor,
        opacity,
      }}
      className="text-white  flex grow w-12 h-12 overflow-hidden"
      onClick={() => onClick(indexPercent.get())}
    ></motion.div>
  );
};

export default Workspace;
