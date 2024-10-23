"use client";

import {
  motion,
  MotionValue,
  useAnimation,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn, shuffleArray } from "@/lib/utils";
import { ButtonSort } from "../ui/button";
import { data, SlideItem } from "@/data/projects";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

const Workspace = () => {
  const workspaceSliderRef = useRef<HTMLDivElement>(null);
  const [sliderData, setSliderData] = useState<SlideItem[]>(data);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderOffset = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const [hideSortSlider, setHideSortSlider] = useState(false);
  const xSmooth = useSpring(sliderOffset, { damping: 50, stiffness: 400 });
  const xVelocity = useVelocity(xSmooth);
  const velocityPercent = useTransform(xVelocity, [-2000, 0, 2000], [1, 0, 1]);
  const velocityPercentSmooth = useSpring(velocityPercent, {
    damping: 50,
    stiffness: 400,
  });

  const positionPercent = useTransform(xSmooth, [0, -sliderWidth], [0, 1]);

  const [detailPageName, setDetailPageName] = useState<string | null>(null);

  const expandedCardRef = useRef<HTMLDivElement>(null);
  const offset = useTransform(positionPercent, [0, 1], [30, 70]);
  const controls = useAnimation();

  useEffect(() => {
    const elFrom = document.querySelector(
      `.card[data-flip-key="${detailPageName}"]`
    );
    if (elFrom) {
      const { x, y, width, height } = elFrom.getBoundingClientRect();
      expandedCardRef.current?.setAttribute(
        "style",
        `top: ${y}px; left: ${x}px; height: ${height}px; width: ${width}px;`
      );
    }
    const elTo = document.querySelector("#target-dimensions");
    if (elTo) {
      const { x, y, width, height } = elTo.getBoundingClientRect();
      controls.start({
        top: y,
        left: x,
        height,
        width,
        transition: { duration: 0.5, delay: 0.2 }, // Adjust the duration as needed
      });
    }
  }, [detailPageName, controls]);

  const closeDetailPage = useCallback(() => {
    controls.start({
      top: "-10%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeOut" }, // Adjust the duration as needed
    });
    setTimeout(() => setDetailPageName(null), 300);
  }, [controls]);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = workspaceSliderRef.current?.offsetWidth || 0;
      const parentWidth =
        workspaceSliderRef.current?.parentElement?.clientWidth || 0;
      setSliderWidth(containerWidth - parentWidth / 2);
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDetailPage();
      }
    };

    handleResize(); // Set initial width
    sortData("date"); // set initial sort to date sorting

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [closeDetailPage]);

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
          onDrag={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
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
              // Flip this li into position
              <motion.li
                key={project.name}
                layout
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn(
                  "rounded item group text-white bg-transparent h-full w-[10vw] cursor-grab flex justify-center",
                  detailPageName === project.name && "z-20"
                )}
              >
                <ProjectCard
                  project={project}
                  positionPercent={positionPercent}
                  onPageSelected={setDetailPageName}
                  isPageSelected={detailPageName === project.name}
                  isDragging={isDragging}
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Candles row */}
      <motion.div className="flex justify-between items-end w-full h-[10%] md:h-[20%]">
        {data.map((project, i) => (
          <ProjectCandle
            key={i}
            velocityPercent={velocityPercentSmooth}
            index={i}
            positionPercent={positionPercent}
            totalItems={data.length}
          />
        ))}
      </motion.div>

      {/* Detail page */}
      <motion.div
        style={{
          backgroundImage: "url('/projectbackground-min1.jpg')",
          backgroundSize: "cover",
        }}
        initial={{ opacity: 0 }}
        animate={detailPageName !== null ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "absolute flex justify-center items-start background-detail-project bg-red-500 inset-0 opacity-1 z-10",
          detailPageName === null && "pointer-events-none"
        )}
      >
        {/* Closing button */}
        <motion.div
          className="absolute z-20 right-[2vw] top-[2vw] cursor-pointer"
          onClick={closeDetailPage}
        >
          <motion.svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <path
              d="M18 6L6 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>

        {/* main content */}
        <div className="w-[100%] md:w-[60%] max-h-10">
          {/* target dimensions */}
          <AspectRatio
            ratio={16 / 9}
            className="md:mt-[2vw] bg-transparent"
            id="target-dimensions"
          >
            <div className="w-full h-full "></div>
          </AspectRatio>

          {/* original dimensions */}
          {detailPageName && (
            <motion.div
              ref={expandedCardRef}
              animate={controls}
              className="absolute bg-black border-2 border-white"
            >
              <Image
                src={
                  detailPageName
                    ? sliderData.filter((el) => el.name === detailPageName)[0]
                        .imgHeroUrl
                    : "/noiseviolet4.png"
                }
                alt={
                  detailPageName
                    ? sliderData.filter((el) => el.name === detailPageName)[0]
                        .description
                    : "description missing"
                }
                width={2000}
                height={1000}
                draggable={false}
                className={`absolute top-0 left-0 h-full object-cover`}
                style={{ objectPosition: `${offset.get()}%` }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

const ProjectCard: React.FC<{
  project: SlideItem;
  positionPercent: MotionValue<number>;
  onPageSelected: (name: string) => void;
  isPageSelected: boolean;
  isDragging: boolean;
}> = ({
  project,
  positionPercent,
  onPageSelected,
  isPageSelected,
  isDragging,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const offset = useTransform(positionPercent, [0, 1], [30, 70]);

  useMotionValueEvent(offset, "change", (x) => {
    if (imageRef.current) {
      imageRef.current.style.objectPosition = `${x}%`;
    }
  });

  const handleProjectSelected = () => {
    onPageSelected(project.name);
  };

  return (
    <div
      className="card relative flex justify-center h-full w-[90%] border-2 border-white"
      onClick={() => (!isDragging ? handleProjectSelected() : null)}
      data-flip-key={project.name}
      // onMouseEnter={() => {
      //   if (imageRef.current) {
      //     const { x, y, width, height } =
      //       imageRef.current.getBoundingClientRect();
      //     onHover({
      //       x,
      //       y,
      //       width,
      //       height,
      //     });
      //   }
      // }}
    >
      <Image
        ref={imageRef}
        src={project.imgHeroUrl}
        alt={project.description}
        width={2000}
        height={1000}
        draggable={false}
        className={`absolute top-0 left-0 h-full object-cover`}
      />
      {!isPageSelected && (
        <>
          <div className="absolute bottom-0 opacity-0 group-hover:translate-y-[200%] group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
            <span className="text-white text-2xl">{project.role}</span>
          </div>
          <div className="absolute top-0 opacity-0 group-hover:translate-y-[-150%] group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
            <span className="text-white text-3xl">{project.titre}</span>
            <span className="text-white text-xl">{project.framework}</span>
          </div>
        </>
      )}
    </div>
  );
};

const ProjectCandle: React.FC<{
  index: number;
  velocityPercent: MotionValue<number>;
  positionPercent: MotionValue<number>;
  totalItems: number;
}> = ({ index, velocityPercent, positionPercent, totalItems }) => {
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
    >
      <span className="relative top-4">{index}</span>
    </motion.div>
  );
};

export default Workspace;
