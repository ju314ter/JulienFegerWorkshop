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
import { SlideItem } from "../ui/carousel";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { shuffleArray } from "@/lib/utils";

const data: SlideItem[] = [
  {
    name: "cliqDigital",
    titre: "Cliq Digital",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: [
      "/img/cliq2-min.jpg",
      "/img/cliq3-min.jpg",
      "/img/cliq4-min.jpg",
      "/img/cliq5-min.jpg",
    ],
    description:
      "Cliq est la plateforme de distribution multimedia en full branding de la société Cliq Digital.",
    tags: ["react", "nextJS"],
    websiteUrl: "https://www.cliqdigital.com",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "loveOn",
    titre: "Cliq Digital",
    imgHeroUrl: "/img/matcher-min.jpg",
    imgUrl: [
      "/img/itsamatch-min.jpg",
      "/img/maquette-min.jpg",
      "/img/mobilerendu0-min.jpg",
    ],
    description: "Concept et MVP d'une application de rencontre gamifiée",
    tags: ["React-Native", "Heroku", "Postgres", "NodeJS"],
    websiteUrl: null,
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "mixr",
    titre: "Mixr",
    imgHeroUrl: "/img/mixr-min.jpg",
    imgUrl: ["/img/mixr-min.jpg"],
    description:
      "Plateforme de création de repas chez l'habitant dans le cadre de la lutte contre l'isolement social.",
    tags: ["Wordpress", "Javascript", "BuddyPress"],
    websiteUrl: null,
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "catalogueU",
    titre: "Catalogue U",
    imgHeroUrl: "/img/patisserie1-min.jpg",
    imgUrl: ["/img/patisserie1-min.jpg", "/img/patisserie2-min.jpg"],
    description:
      "Application présentoir pour tablette à destination des usagers d'une boulangerie U.",
    tags: ["React-Native", "DatoCMS"],
    websiteUrl: "https://www.cliqdigital.com",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "wikiTft",
    titre: "Wiki TFT",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description:
      "Application de documentation sur la meta de l'autobattler de Riot Games, TeamFight Tactics.",
    tags: ["React-Native", "Expo"],
    websiteUrl: "https://www.cliqdigital.com",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "landingPageBuilder",
    titre: "Landing page builder",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description:
      "Outil de tooling pour la création de landing page pour les entitées de Cliq Digital & co.",
    tags: ["Angular", "Angular Material"],
    websiteUrl: "https://www.cliqdigital.com",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "primezy",
    titre: "Primezy",
    imgHeroUrl: "/img/primezy-min.jpg",
    imgUrl: ["/img/primezy1-min.jpg"],
    description:
      "Solution en white branding de distribution multimedia pour Cliq Digital.",
    tags: ["Angular", "NgRx", "RxJS", "SCSS", "NodeJS"],
    websiteUrl: "https://www.cliqdigital.com",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "JFW2019",
    titre: "Julien FEGER Alternant Workshop",
    imgHeroUrl: "/img/JFWP-min.jpg",
    imgUrl: [
      "/img/JFWP-min.jpg",
      "/img/JFWP1-min.jpg",
      "/img/JFWP2-min.jpg",
      "/img/JFWP3-min.jpg",
      "/img/JFWP4-min.jpg",
    ],
    description: "Mon premier portfolio.",
    tags: ["react", "nextJS"],
    websiteUrl: "https://www.cliqdigital.com",
    githubUrl: null,
    date: "2019-06-01",
  },
  {
    name: "JFW2021",
    titre: "Julien FEGER Junior Workshop",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description:
      "Cliq est la plateforme de distribution multimedia en full branding de la société Cliq Digital.",
    tags: ["react", "nextJS"],
    websiteUrl: "https://www.cliqdigital.com",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "puissance4",
    titre: "Puissance 4",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description: "Jeux web de puissance 4 en versus deux joueurs.",
    tags: ["react", "nextJS", "websockets", "socket.io", "nodeJS"],
    websiteUrl: "https://www.cliqdigital.com",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "poolPulse",
    titre: "Pool Pulse",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description:
      "SaSS de monitoring des pools de liquidité dans la finance décentralisée.",
    tags: [
      "React",
      "NextJS",
      "Zustand",
      "Tailwindcss",
      "Prisma",
      "Postgres",
      "Framer-motion",
      "NodeMailer",
    ],
    websiteUrl: "https://poolpulse.vercel.app",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "damePascale",
    titre: "Dame Pascale",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description:
      "E-commerce artisanal de peluches crochetées et de bijou floraux",
    tags: [
      "React",
      "NextJS",
      "Zustand",
      "Tailwindcss",
      "Sanity",
      "Stripe",
      "Framer-motion",
      "NodeMailer",
    ],
    websiteUrl: "https://damepascale.fr",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "eptm",
    titre: "EPTM",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description:
      "Solution de tri mutualisée pour les différents acteurs de la distribution des colis à La Poste.",
    tags: ["Angular", "SonarQube", "Jasmine/Karma", "NgRx", "RxJS"],
    websiteUrl: "https://eptm.laposte.fr",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "maxeem",
    titre: "Maxeem",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description:
      "Plateforme de gestion des demandes de prime MaPrimeRenov' pour les rénovations énergétiques des particuliers et des proffessionnels.",
    tags: ["Angular", "Cypress", "NgRx", "RxJS"],
    websiteUrl: "https://www.maxeem.com",
    githubUrl: null,
    date: "2022-06-01",
  },
  {
    name: "adm",
    titre: "Aile du Maine",
    imgHeroUrl: "/img/cliq1-min.jpg",
    imgUrl: ["/img/cliq2-min.jpg", "/img/cliq3-min.jpg", "/img/cliq4-min.jpg"],
    description:
      "Site vitrine pour l'association de planneur du Mans, Les Ailes du Maine.",
    tags: ["Angular", "Cypress", "NgRx", "RxJS"],
    websiteUrl: "https://www.maxeem.com",
    githubUrl: null,
    date: "2022-06-01",
  },
];

const Workspace = () => {
  const workspaceSliderRef = useRef<HTMLDivElement>(null);
  const [sliderData, setSliderData] = useState<SlideItem[]>(data);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderOffset = useMotionValue(0);
  const [hideSortSlider, setHideSortSlider] = useState(false);
  const [sliderDirection, setSliderDirection] = useState<
    "left" | "right" | "immobile"
  >("immobile");
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // update sort slider visibility on slider drag
  useMotionValueEvent(sliderOffset, "change", (x) => {
    return x < -100 ? setHideSortSlider(true) : setHideSortSlider(false);
  });

  // Update slider direction on velocity change
  useMotionValueEvent(xVelocity, "change", (x) => {
    return x > 0
      ? setSliderDirection("left")
      : x < 0
      ? setSliderDirection("right")
      : setSliderDirection("immobile");
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
        setSliderData([...data].sort((a, b) => a.tags.length - b.tags.length));
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
      <div className="flex justify-center items-center w-full gap-2 h-[30%] p-2">
        {data.map((project, i) => (
          <ProjectCandle
            key={i}
            velocityPercent={velocityPercentSmooth}
            index={i}
            positionPercent={positionPercent}
            totalItems={data.length}
          />
        ))}
      </div>
      <div className="relative flex items-start w-full h-[70%]">
        <motion.div
          variants={{
            visible: { translateX: 0 },
            hidden: { translateX: "-200%" }, // Adjust the translation value as needed
          }}
          animate={hideSortSlider ? "hidden" : "visible"}
          className="absolute left-[5vw] text-white flex flex-col gap-10 text-xl"
        >
          <span className="cursor-pointer" onClick={() => sortData("date")}>
            Date
          </span>
          <span className="cursor-pointer" onClick={() => sortData("eco")}>
            Ecosystem
          </span>
          <span className="cursor-pointer" onClick={() => sortData("random")}>
            Random
          </span>
        </motion.div>
        <motion.div
          ref={workspaceSliderRef}
          drag="x"
          dragConstraints={{ left: -sliderWidth, right: 0 }}
          // onDrag={handleDragWorkspace}
          style={{ x: sliderOffset }}
          className="scrollable-projects-wrapper overflow-visible h-[70%] ml-[30vw] inline-flex items-center"
        >
          <ul className="w-full h-full flex">
            <AnimatePresence>
              {sliderData.map((project, i) => (
                <motion.li
                  key={project.name}
                  style={{ z: i }}
                  layout
                  initial={{
                    opacity: 0,
                    y:
                      sliderDirection === "left"
                        ? "20%"
                        : sliderDirection === "right"
                        ? "-20%"
                        : "20%",
                  }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-2 p-2 rounded item group text-white bg-transparent h-full w-[10vw] cursor-grab flex justify-center"
                >
                  <ProjectCard project={project} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>
    </>
  );
};

const ProjectCard: React.FC<{ project: SlideItem }> = ({ project }) => {
  return (
    <div className="relative h-full w-[90%]">
      <Image
        src={project.imgHeroUrl}
        alt={project.description}
        width={2000}
        height={1000}
        draggable={false}
        className="absolute top-0 left-0 h-full object-cover object-[50%_50%]"
      />
      <div className="absolute bottom-0 left-0 opacity-0 group-hover:translate-y-full group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
        <span className="text-white text-xl">{project.name}</span>
        <span className="text-white text-lg">{project.titre}</span>
      </div>
    </div>
  );
};

const ProjectCandle: React.FC<{
  index: number;
  velocityPercent: MotionValue<number>;
  positionPercent: MotionValue<number>;
  totalItems: number;
}> = ({ index, velocityPercent, positionPercent, totalItems }) => {
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

  const violet = (saturation: number) => `hsl(262, ${saturation}%, 56%)`;
  const backgroundColor = useTransform(
    scalingFactor,
    [minScale, maxScale],
    [violet(0), violet(100)]
  );

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
      }}
      className="text-white w-4 h-12 overflow-hidden"
    ></motion.div>
  );
};

export default Workspace;
