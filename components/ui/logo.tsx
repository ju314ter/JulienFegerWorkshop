import React from "react";

const Logo = ({
  width,
  height,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) => {
  return (
    <svg
      className={className || "logo"}
      data-name="logo-animated"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 587.1 571.32"
      width={width}
      height={height}
    >
      <defs>
        <style>{`.cls-1,.cls-5,.cls-6{fill:none;}.cls-2{fill:grey;}.cls-3{fill:white;}.cls-4{clip-path:url(#clip-path-logo);}.cls-5,.cls-6{stroke:white;stroke-linecap:round;stroke-miterlimit:10;}.cls-5{stroke-width:54px;}.cls-6{stroke-width:52px;}`}</style>
        <clipPath id="clip-path-logo" transform="translate(-14.2 -18)">
          <path
            id="logo-path"
            className="cls-1"
            d="M484.4,237.6c13,0,23.5,11.2,23.5,25.1s-10.5,25.1-23.5,25.1-23.5-11.2-23.5-25.1S471.4,237.6,484.4,237.6Zm92.7-92.8A22.48,22.48,0,0,0,552.2,125L152,170.4a22.52,22.52,0,0,0,2.5,44.9,23.48,23.48,0,0,0,2.6-.1l166.1-18.9c7.1,39.6,14.5,75.4,21.1,107.4,20.3,97.6,33.6,162.1,7.3,193.2-29.2,34.5-114.9,44.9-305.7,37.3a22.52,22.52,0,0,0-1.8,45c40.5,1.6,75.8,2.5,106.8,2.5,49.2,0,87.5-2.1,119-6.3,57.1-7.7,94-23.3,116-49.3,40.6-47.9,25.4-120.9,2.5-231.5-6.4-30.9-13.6-65.4-20.4-103.3l189.3-21.5A22.63,22.63,0,0,0,577.1,144.8Z"
          />
        </clipPath>
      </defs>
      <g className="top-circle">
        <path
          id="top-circle-light"
          className="cls-2"
          d="M371.4,64c0,25.44-23.4,46-51.7,46s-51.3-20.64-51.3-46,23-46,51.3-46S371.4,38.64,371.4,64Z"
          transform="translate(-14.2 -18)"
        />
        <path
          id="top-circle-dark"
          className="cls-3"
          d="M371.4,64c0,25.44-23.4,46-51.7,46s-51.3-20.64-51.3-46,23-46,51.3-46S300.4,104.4,371.4,64Z"
          transform="translate(-14.2 -18)"
        />
      </g>
      <g className="cls-4">
        <path
          id="clipped-stroke-bot"
          className="cls-5"
          d="M41.2,556.2c36.2,1.3,67.6,2.6,92.9,3.8,49.5,2.2,59.8,3,79.5,1.7,21.3-1.5,53.1-3.9,90.4-17.9,31.51-11.83,58.16-22,73.6-47,16.14-26.12,12-55.52,8.62-77-13.17-84.48-27.35-159.4-39.36-218.21"
          transform="translate(-14.2 -18)"
        />
        <polyline
          id="clipped-stroke-top"
          className="cls-6"
          points="137.86 176.44 351.57 149.64 538.46 126.66 470.2 244.7"
        />
      </g>
    </svg>
  );
};

export default Logo;
