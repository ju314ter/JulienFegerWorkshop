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
import { Button, ButtonSort } from "../ui/button";
import { data, SlideItem } from "@/data/projects";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Link from "next/link";
import { useExtractColors } from "react-extract-colors";

const Workspace = () => {
  const workspaceSliderRef = useRef<HTMLDivElement>(null);
  const [viewportBelowMd, isViewportBelowMd] = useState(false);
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
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const containerWidth = workspaceSliderRef.current?.offsetWidth || 0;
        const parentWidth =
          workspaceSliderRef.current?.parentElement?.clientWidth || 0;
        setSliderWidth(containerWidth - parentWidth / 2);
        isViewportBelowMd(window.innerWidth < 600);
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
        <motion.div
          variants={{
            visible: { translateX: 0 },
            hidden: { translateX: "-200%" }, // Adjust the translation value as needed
          }}
          animate={hideSortSlider && !viewportBelowMd ? "hidden" : "visible"}
          className="h-[90%] w-[60%] mx-auto md:w-full flex flex-col justify-between md:grid-rows-1 gap-2 md:gap-10 text-xl md:ml-[2vw]"
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

        <motion.div
          id="showcase"
          ref={workspaceSliderRef}
          drag="x"
          onDrag={() => debouncedSetDragging(true)}
          onDragEnd={() => debouncedSetDragging(false)}
          dragConstraints={{ left: -sliderWidth, right: 0 }}
          style={{ x: sliderOffset }}
          className="scrollable-projects-wrapper overflow-visible h-[90%] inline-flex items-center"
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
                  "rounded item group text-white min-w-[250px] bg-transparent h-full cursor-grab flex justify-center",
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
      <motion.div className="flex justify-between items-end w-full h-[15%] md:h-[25%]">
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
          className="absolute z-20 right-[2vw] top-[2vw] cursor-pointer border border-white bg-black"
          onClick={closeDetailPage}
        >
          <motion.svg
            width="64"
            height="64"
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
        <div className="w-[100%] md:w-[75%]  max-w-[1000px]">
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
              className="absolute bg-black border-1 border-white cursor-pointer"
            >
              {/* Image */}
              <Image
                ref={expandedImageRef}
                onClick={closeDetailPage}
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
              {/* Content hiden at first */}
              <motion.div
                initial={{ y: "160%", opacity: 0 }}
                animate={{ y: "120%", opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute w-[100%] gap-10 flex flex-col justify-center items-start bottom-0 left-0 right-0 cursor-auto"
              >
                <div className="w-full flex justify-between items-center px-4 md:p-0">
                  {sliderData.find((item) => item.name === detailPageName)
                    ?.githubUrl && (
                    <Button className="w-[30%] h-10 bg-red-300  text-black">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          sliderData.find(
                            (item) => item.name === detailPageName
                          )?.githubUrl || ""
                        }
                        className="flex justify-center items-center w-full h-full"
                      >
                        <span>Github</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-[24px] h-[24px] ml-2"
                        >
                          <path d="M5.88401 18.6533C5.58404 18.4526 5.32587 18.1975 5.0239 17.8369C4.91473 17.7065 4.47283 17.1524 4.55811 17.2583C4.09533 16.6833 3.80296 16.417 3.50156 16.3089C2.9817 16.1225 2.7114 15.5499 2.89784 15.0301C3.08428 14.5102 3.65685 14.2399 4.17672 14.4263C4.92936 14.6963 5.43847 15.1611 6.12425 16.0143C6.03025 15.8974 6.46364 16.441 6.55731 16.5529C6.74784 16.7804 6.88732 16.9182 6.99629 16.9911C7.20118 17.1283 7.58451 17.1874 8.14709 17.1311C8.17065 16.7489 8.24136 16.3783 8.34919 16.0358C5.38097 15.3104 3.70116 13.3952 3.70116 9.63971C3.70116 8.40085 4.0704 7.28393 4.75917 6.3478C4.5415 5.45392 4.57433 4.37284 5.06092 3.15636C5.1725 2.87739 5.40361 2.66338 5.69031 2.57352C5.77242 2.54973 5.81791 2.53915 5.89878 2.52673C6.70167 2.40343 7.83573 2.69705 9.31449 3.62336C10.181 3.41879 11.0885 3.315 12.0012 3.315C12.9129 3.315 13.8196 3.4186 14.6854 3.62277C16.1619 2.69 17.2986 2.39649 18.1072 2.52651C18.1919 2.54013 18.2645 2.55783 18.3249 2.57766C18.6059 2.66991 18.8316 2.88179 18.9414 3.15636C19.4279 4.37256 19.4608 5.45344 19.2433 6.3472C19.9342 7.28337 20.3012 8.39208 20.3012 9.63971C20.3012 13.3968 18.627 15.3048 15.6588 16.032C15.7837 16.447 15.8496 16.9105 15.8496 17.4121C15.8496 18.0765 15.8471 18.711 15.8424 19.4225C15.8412 19.6127 15.8397 19.8159 15.8375 20.1281C16.2129 20.2109 16.5229 20.5077 16.6031 20.9089C16.7114 21.4504 16.3602 21.9773 15.8186 22.0856C14.6794 22.3134 13.8353 21.5538 13.8353 20.5611C13.8353 20.4708 13.836 20.3417 13.8375 20.1145C13.8398 19.8015 13.8412 19.599 13.8425 19.4094C13.8471 18.7019 13.8496 18.0716 13.8496 17.4121C13.8496 16.7148 13.6664 16.2602 13.4237 16.051C12.7627 15.4812 13.0977 14.3973 13.965 14.2999C16.9314 13.9666 18.3012 12.8177 18.3012 9.63971C18.3012 8.68508 17.9893 7.89571 17.3881 7.23559C17.1301 6.95233 17.0567 6.54659 17.199 6.19087C17.3647 5.77663 17.4354 5.23384 17.2941 4.57702L17.2847 4.57968C16.7928 4.71886 16.1744 5.0198 15.4261 5.5285C15.182 5.69438 14.8772 5.74401 14.5932 5.66413C13.7729 5.43343 12.8913 5.315 12.0012 5.315C11.111 5.315 10.2294 5.43343 9.40916 5.66413C9.12662 5.74359 8.82344 5.69492 8.57997 5.53101C7.8274 5.02439 7.2056 4.72379 6.71079 4.58376C6.56735 5.23696 6.63814 5.77782 6.80336 6.19087C6.94565 6.54659 6.87219 6.95233 6.61423 7.23559C6.01715 7.8912 5.70116 8.69376 5.70116 9.63971C5.70116 12.8116 7.07225 13.9683 10.023 14.2999C10.8883 14.3971 11.2246 15.4769 10.5675 16.0482C10.3751 16.2156 10.1384 16.7802 10.1384 17.4121V20.5611C10.1384 21.5474 9.30356 22.2869 8.17878 22.09C7.63476 21.9948 7.27093 21.4766 7.36613 20.9326C7.43827 20.5204 7.75331 20.2116 8.13841 20.1276V19.1381C7.22829 19.1994 6.47656 19.0498 5.88401 18.6533Z"></path>
                        </svg>
                      </Link>
                    </Button>
                  )}

                  {sliderData.find((item) => item.name === detailPageName)
                    ?.websiteUrl && (
                    <Button className="w-[30%] h-10 bg-red-300 text-black">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          sliderData.find(
                            (item) => item.name === detailPageName
                          )?.websiteUrl || ""
                        }
                        className="flex justify-center items-center w-full h-full"
                      >
                        <span>Visiter l&apos;appli</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-[24px] h-[24px] ml-2"
                        >
                          <path d="M20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3ZM5 19V5H19V19H5ZM16 8V16H14V11.4142L8.70711 16.7071L7.29289 15.2929L12.5858 10H8V8H16Z"></path>
                        </svg>
                      </Link>
                    </Button>
                  )}
                </div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative w-[100%] text-2xl text-white my-4 px-4 md:p-0 bg-transparent"
                >
                  {detailPageName &&
                    sliderData.find((item) => item.name === detailPageName)
                      ?.description}
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="relative w-[100%] text-2xl text-neutral-400 h-40 bg-transparent px-4 md:p-0"
                >
                  <span className="underline mb-2">Ce projet utilise :</span>
                  <ul className="flex flex-wrap gap-2">
                    {detailPageName &&
                      sliderData
                        .find((item) => item.name === detailPageName)
                        ?.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border border-white text-white p-1"
                          >
                            {tag}
                          </li>
                        ))}
                  </ul>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

const ProjectCard = React.memo<{
  project: SlideItem;
  positionPercent: MotionValue<number>;
  onPageSelected: (name: string) => void;
  isPageSelected: boolean;
  isDragging: boolean;
}>(
  ({
    project,
    positionPercent,
    onPageSelected,
    isPageSelected,
    isDragging,
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

// const ProjectCard: React.FC<{
//   project: SlideItem;
//   positionPercent: MotionValue<number>;
//   onPageSelected: (name: string) => void;
//   isPageSelected: boolean;
//   isDragging: boolean;
// }> = ({
//   project,
//   positionPercent,
//   onPageSelected,
//   isPageSelected,
//   isDragging,
// }) => {
//   const imageRef = useRef<HTMLImageElement>(null);
//   const offset = useTransform(positionPercent, [0, 1], [30, 70]);
//   const { dominantColor, lighterColor } = useExtractColors(project.imgHeroUrl, {
//     format: "hex",
//   });

//   useMotionValueEvent(offset, "change", (x) => {
//     if (imageRef.current) {
//       imageRef.current.style.objectPosition = `${x}%`;
//     }
//   });

//   const handleProjectSelected = () => {
//     onPageSelected(project.name);
//   };

//   return (
//     <div
//       className="card group relative flex justify-center h-full w-[90%] rounded-md"
//       onClick={() => (!isDragging ? handleProjectSelected() : null)}
//       data-flip-key={project.name}
//     >
//       <Image
//         ref={imageRef}
//         src={project.imgHeroUrl}
//         alt={project.description}
//         width={1200}
//         height={800}
//         draggable={false}
//         className={`absolute z-10 top-0 left-0 h-full object-cover rounded-md`}
//       />
//       {!isPageSelected && (
//         <>
//           <div
//             style={{ backgroundColor: dominantColor + "44 " || "" }}
//             className={`absolute rounded-tl-md z-0 py-5 w-full border-md top-0 opacity-0 scale-50 group-hover:translate-y-[-105%] group-hover:scale-100 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300`}
//           >
//             <span className="text-white text-3xl flex justify-center items-center text-center">
//               {project.titre}
//             </span>
//             <span className="text-white text-xl">{project.framework}</span>
//           </div>
//           <div
//             style={{ backgroundColor: dominantColor + "44" || "" }}
//             className="absolute rounded-tl-md z-0 py-5 w-full border-md bottom-0 opacity-0 scale-50 group-hover:translate-y-[105%] group-hover:scale-100 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300"
//           >
//             <span className="text-white text-2xl">{project.role}</span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const ProjectCandle: React.FC<{
//   index: number;
//   velocityPercent: MotionValue<number>;
//   positionPercent: MotionValue<number>;
//   totalItems: number;
// }> = ({ index, velocityPercent, positionPercent, totalItems }) => {
//   const baseHeight = 16;
//   const height = useMotionValue(baseHeight);
//   const minScale = 1; // Minimum scale value
//   const maxScale = 10; // Maximum scale value

//   const motionIndex = useMotionValue(index);
//   const indexPercent = useTransform(motionIndex, [0, totalItems], [0, 1]);

//   const scalingFactor = useMotionValue(
//     minScale +
//       (maxScale - minScale) *
//         (1 - Math.abs(indexPercent.get() - positionPercent.get()))
//   );

//   const violet = (saturation: number) => `hsl(340, ${saturation}%, 75%)`;
//   const backgroundColor = useTransform(
//     scalingFactor,
//     [minScale, maxScale],
//     [violet(0), violet(100)]
//   );
//   const opacity = useTransform(scalingFactor, [minScale, maxScale], [0, 0.5]);

//   useMotionValueEvent(velocityPercent, "change", (x) => {
//     // Apply the scaling factor to the range
//     const scale =
//       minScale +
//       (maxScale - minScale) *
//         (1 - Math.abs(indexPercent.get() - positionPercent.get()));

//     scalingFactor.set(scale);
//     height.set(baseHeight + x * scale * scale);
//   });

//   return (
//     <motion.div
//       style={{
//         height,
//         transformOrigin: "center bottom",
//         backgroundColor,
//         opacity,
//       }}
//       className="text-white flex grow w-12 overflow-hidden p-2 border-t-2 border-white"
//     >
//       <span className="relative top-4">{index}</span>
//     </motion.div>
//   );
// };

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
