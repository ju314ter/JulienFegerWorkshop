"use client";

import {
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
            const ecosystemDiff = a.framework.localeCompare(b.framework);
            if (ecosystemDiff !== 0) {
              return ecosystemDiff;
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
      <div className="relative backdrop-blur-[4px] flex flex-col items-start justify-start pt-32 gap-10 md:flex-row md:justify-start md:items-end w-full h-[90%] md:h-[80%]">
        <motion.div
          variants={{
            visible: { translateX: 0 },
            hidden: { translateX: "-200%" }, // Adjust the translation value as needed
          }}
          animate={hideSortSlider ? "hidden" : "visible"}
          className="md:pl-[2vw] pl-0 flex md:flex-col justify-center w-full gap-2 md:gap-10 text-xl"
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
          className="scrollable-projects-wrapper overflow-visible h-[80%] inline-flex items-center"
        >
          <motion.ul
            initial={{ opacity: 0, y: "20%" }}
            whileInView={{ opacity: 1, y: 0 }}
            className="w-full h-full flex"
          >
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
          </motion.ul>
        </motion.div>
      </div>
      <motion.div className="flex justify-between items-end w-full h-[10%] md:h-[20%]">
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
            }}
          />
        ))}
      </motion.div>
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
    <div className="relative flex justify-center h-full w-[70%] border-2 border-white">
      <Image
        ref={imageRef}
        src={project.imgHeroUrl}
        alt={project.description}
        width={2000}
        height={1000}
        draggable={false}
        className={`absolute top-0 left-0 h-full object-cover`}
      />
      <div className="absolute bottom-0 opacity-0 group-hover:translate-y-[200%] group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
        <span className="text-white text-2xl">{project.role}</span>
      </div>
      <div className="absolute top-0 opacity-0 group-hover:translate-y-[-150%] group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
        <span className="text-white text-3xl">{project.titre}</span>
        <span className="text-white text-xl">{project.framework}</span>
      </div>
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
  const baseHeight = 16;
  const height = useMotionValue(baseHeight);
  const minScale = 1; // Minimum scale value
  const maxScale = 10; // Maximum scale value

  const motionIndex = useMotionValue(index);
  const indexPercent = useTransform(motionIndex, [0, totalItems], [0, 1]);

  const scalingFactor = useMotionValue(
    minScale +
      (maxScale - minScale) *
        (1 - Math.abs(indexPercent.get() - positionPercent.get()))
  );

  const violet = (saturation: number) => `hsl(340, ${saturation}%, 75%)`;
  const backgroundColor = useTransform(
    scalingFactor,
    [minScale, maxScale],
    [violet(0), violet(100)]
  );
  const opacity = useTransform(scalingFactor, [minScale, maxScale], [0, 0.5]);

  useMotionValueEvent(velocityPercent, "change", (x) => {
    // Apply the scaling factor to the range
    const scale =
      minScale +
      (maxScale - minScale) *
        (1 - Math.abs(indexPercent.get() - positionPercent.get()));

    scalingFactor.set(scale);
    height.set(baseHeight + x * scale * scale);
  });

  return (
    <motion.div
      style={{
        height,
        transformOrigin: "center bottom",
        backgroundColor,
        opacity,
      }}
      className="text-white flex grow w-12 overflow-hidden p-2 border-t-2 border-white"
      onClick={() => onClick(indexPercent.get())}
    >
      <span className="relative top-4">{index}</span>
    </motion.div>
  );
};

export default Workspace;
