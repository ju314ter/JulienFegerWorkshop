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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { cn, shuffleArray } from "@/lib/utils";
import { ButtonSort } from "../ui/button";
import { data, SlideItem } from "@/data/projects";
import { useExtractColors } from "react-extract-colors";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DetailPage } from "./detailPage";

const Workspace = () => {
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

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
  const expandedImageRef = useRef<HTMLImageElement>(null);
  const offset = useTransform(positionPercent, [0, 1], [30, 70]);
  const controls = useAnimation();

  // open detail page
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
      const expandedImage = expandedImageRef.current;

      if (
        detailPageName === "loveOn" ||
        detailPageName === "wikiTft" ||
        detailPageName === "catalogueU"
      ) {
        controls.start({
          top: y,
          left: x,
          height,
          width: width,
          transition: { duration: 0.5, delay: 0.2 },
        });
        if (expandedImage) expandedImageRef.current.style.objectFit = `contain`;
      } else {
        controls.start({
          top: y,
          left: x,
          height,
          width,
          transition: { duration: 0.5, delay: 0.2 },
        });
        if (expandedImage) expandedImageRef.current.style.objectFit = `cover`;
      }
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

  // Memoize slider data transformations
  const sortData = useCallback((sort: string) => {
    const sortFunctions = {
      date: (data: SlideItem[]) =>
        [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      eco: (data: SlideItem[]) =>
        [...data].sort((a, b) => {
          const ecosystemDiff = a.framework.localeCompare(b.framework);
          return ecosystemDiff !== 0
            ? ecosystemDiff
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }),
      role: (data: SlideItem[]) =>
        [...data].sort((a, b) => {
          const roleDiff = b.role.localeCompare(a.role);
          return roleDiff !== 0
            ? roleDiff
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }),
      random: (data: SlideItem[]) => shuffleArray([...data]),
    };

    const sortFunction = sortFunctions[sort as keyof typeof sortFunctions];
    if (sortFunction) {
      setSliderData(sortFunction(data));
    }
  }, []);

  // Debounce drag handling
  const debouncedSetDragging = useCallback((value: boolean) => {
    requestAnimationFrame(() => setIsDragging(value));
  }, []);

  // Initialize state
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout; // for debouncing

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const containerWidth = workspaceSliderRef.current?.offsetWidth || 0;
        const parentWidth =
          workspaceSliderRef.current?.parentElement?.clientWidth || 0;
        setSliderWidth(containerWidth - parentWidth / 2);
      }, 150); // Debounce resize events
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDetailPage();
      }
    };

    handleResize();
    sortData("date");

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeDetailPage, sortData]);

  // update sort slider visibility on slider drag
  useMotionValueEvent(sliderOffset, "change", (x) => {
    return x < -100 ? setHideSortSlider(true) : setHideSortSlider(false);
  });

  return (
    <>
      <div className="relative backdrop-blur-[4px] flex flex-col items-start justify-start pt-24 md:pt-32 gap-10 md:flex-row md:justify-start md:items-end w-full h-[85%] md:h-[75%]">
        {/* Sorting buttons */}
        <motion.div
          variants={{
            visible: { translateX: 0 },
            hidden: { translateX: "-200%" }, // Adjust the translation value as needed
          }}
          animate={hideSortSlider && !isMobile ? "hidden" : "visible"}
          className="h-[75%] w-[60%] mx-auto md:w-full flex flex-col justify-between md:grid-rows-1 gap-2 md:gap-10 text-xl md:ml-[2vw]"
        >
          <div className="flex flex-col flex-1 gap-2 justify-between wrap">
            <ButtonSort
              variant={"projectSort"}
              onClick={() => sortData("date")}
            >
              Date
            </ButtonSort>
            <ButtonSort variant={"projectSort"} onClick={() => sortData("eco")}>
              Ecosystem
            </ButtonSort>
          </div>
          <div className="flex flex-col flex-1 gap-2 justify-between wrap">
            <ButtonSort
              variant={"projectSort"}
              onClick={() => sortData("role")}
            >
              Rôle
            </ButtonSort>
            <ButtonSort
              variant={"projectSort"}
              onClick={() => sortData("random")}
            >
              Random
            </ButtonSort>
          </div>
        </motion.div>

        {/* Slider  */}
        <motion.div
          id="showcase"
          ref={workspaceSliderRef}
          drag="x"
          onDrag={() => debouncedSetDragging(true)}
          onDragEnd={() => debouncedSetDragging(false)}
          dragConstraints={{ left: -sliderWidth, right: 0 }}
          style={{ x: sliderOffset }}
          className="scrollable-projects-wrapper overflow-visible h-[75%] inline-flex items-center"
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
                className={cn(
                  "rounded item group text-white min-w-[170px] bg-transparent h-full cursor-grab flex justify-center",
                  detailPageName === project.name && "z-20"
                )}
              >
                <ProjectCard
                  project={project}
                  positionPercent={positionPercent}
                  onPageSelected={setDetailPageName}
                  isPageSelected={detailPageName === project.name}
                  isDragging={isDragging}
                  isViewportBelowMd={isTablet || isMobile}
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Candles row */}
      <motion.div className="flex justify-between items-end w-full h-[15%] md:h-[25%]">
        {data.map((_, i) => (
          <ProjectCandle
            key={i}
            velocityPercent={velocityPercentSmooth}
            index={i}
            positionPercent={positionPercent}
            totalItems={data.length}
          />
        ))}
      </motion.div>

      <DetailPage
        sliderData={sliderData}
        detailPageName={detailPageName || ""}
        closeDetailPage={closeDetailPage}
        expandedCardRef={expandedCardRef}
        expandedImageRef={expandedImageRef}
        offset={offset}
        controls={controls}
      />
    </>
  );
};

const ProjectCard = React.memo<{
  project: SlideItem;
  positionPercent: MotionValue<number>;
  onPageSelected: (name: string) => void;
  isPageSelected: boolean;
  isDragging: boolean;
  isViewportBelowMd: boolean;
}>(
  ({
    project,
    positionPercent,
    onPageSelected,
    isPageSelected,
    isDragging,
    isViewportBelowMd,
  }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const offset = useTransform(positionPercent, [0, 1], [30, 70]);
    const { dominantColor, lighterColor } = useExtractColors(
      project.imgHeroUrl,
      {
        format: "hex",
      }
    );

    useMotionValueEvent(offset, "change", (x) => {
      if (isViewportBelowMd) return;
      if (imageRef.current) {
        requestAnimationFrame(() => {
          imageRef.current!.style.objectPosition = `${x}%`;
        });
      }
    });

    const handleProjectSelected = useCallback(() => {
      if (!isDragging) {
        onPageSelected(project.name);
      }
    }, [isDragging, onPageSelected, project.name]);

    // Memoize static JSX elements
    const cardDecorations = useMemo(
      () => (
        <>
          <span
            style={{ backgroundColor: lighterColor || "" }}
            className="absolute left-[1px] top-[1px] z-10 h-3 w-[1px] transition-all duration-500 scale-0 group-hover:scale-100 origin-top"
          />
          <span
            style={{ backgroundColor: lighterColor || "" }}
            className="absolute left-[1px] top-[1px] z-10 h-[1px] w-3 transition-all duration-500 scale-0 group-hover:scale-100 origin-left"
          />
          <span
            style={{ backgroundColor: lighterColor || "" }}
            className="absolute right-[1px] top-[1px] z-10 h-3 w-[1px] transition-all duration-500 scale-0 group-hover:scale-100 origin-top"
          />
          <span
            style={{ backgroundColor: lighterColor || "" }}
            className="absolute right-[1px] top-[1px] z-10 h-[1px] w-3 transition-all duration-500 scale-0 group-hover:scale-100 origin-right"
          />
          <span
            style={{ backgroundColor: lighterColor || "" }}
            className="absolute left-[1px] bottom-[1px] z-10 h-3 w-[1px] transition-all duration-500 scale-0 group-hover:scale-100 origin-bottom"
          />
          <span
            style={{ backgroundColor: lighterColor || "" }}
            className="absolute left-[1px] bottom-[1px] z-10 h-[1px] w-3 transition-all duration-500 scale-0 group-hover:scale-100 origin-left"
          />
          <span
            style={{ backgroundColor: lighterColor || "" }}
            className="absolute right-[1px] bottom-[1px] z-10 h-3 w-[1px] transition-all duration-500 scale-0 group-hover:scale-100 origin-bottom"
          />
          <span
            style={{ backgroundColor: lighterColor || "" }}
            className="absolute right-[1px] bottom-[1px] z-10 h-[1px] w-3 transition-all duration-500 scale-0 group-hover:scale-100 origin-right"
          />
        </>
      ),
      [lighterColor]
    );

    return (
      <div
        className="card group relative flex justify-center h-full w-[90%] rounded-md"
        onClick={handleProjectSelected}
        data-flip-key={project.name}
      >
        <Image
          ref={imageRef}
          src={project.imgHeroUrl}
          alt={project.description}
          width={1200}
          height={800}
          draggable={false}
          loading="lazy"
          className="absolute z-10 top-0 left-0 h-full object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!isPageSelected && (
          <>
            <div
              style={{ backgroundColor: dominantColor + "44 " || "" }}
              className="absolute rounded-tl-md z-0 py-5 w-full border-md top-0 opacity-0 scale-50 group-hover:translate-y-[-105%] group-hover:scale-100 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300"
            >
              {cardDecorations}
              <span className="text-white text-3xl flex justify-center items-center text-center">
                {project.titre}
              </span>
              <span className="text-white text-xl">{project.framework}</span>
            </div>
            <div
              style={{ backgroundColor: dominantColor + "44" || "" }}
              className="absolute rounded-tl-md z-0 py-5 w-full border-md bottom-0 opacity-0 scale-50 group-hover:translate-y-[105%] group-hover:scale-100 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300"
            >
              {cardDecorations}
              <span className="text-white text-2xl">{project.role}</span>
            </div>
          </>
        )}
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

const ProjectCandle = React.memo<{
  index: number;
  velocityPercent: MotionValue<number>;
  positionPercent: MotionValue<number>;
  totalItems: number;
}>(({ index, velocityPercent, positionPercent, totalItems }) => {
  const baseHeight = 16;
  const height = useMotionValue(baseHeight);
  const minScale = 1;
  const maxScale = 10;

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
    requestAnimationFrame(() => {
      const scale =
        minScale +
        (maxScale - minScale) *
          (1 - Math.abs(indexPercent.get() - positionPercent.get()));
      scalingFactor.set(scale);
      height.set(baseHeight + x * scale * scale);
    });
  });

  return (
    <motion.div
      style={{
        height,
        transformOrigin: "center bottom",
        backgroundColor,
        opacity,
        willChange: "transform",
      }}
      className="text-white flex grow w-12 overflow-hidden p-2 border-t-2 border-white"
    >
      <span className="relative top-4">{index}</span>
    </motion.div>
  );
});
ProjectCandle.displayName = "ProjectCandle";

export default Workspace;
