const svg = ({
  svgClassNames,
  pathClassNames,
  stroke,
  strokeOpacity,
  strokeDasharray,
}) => {
  const lineForehead = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="175"
      height="67"
      viewBox="0 0 175 67"
      fill="none"
      className={svgClassNames}
    >
      <path
        className={pathClassNames}
        d="M174.5 51.5c0 3.501-.603 6.212-1.718 8.295-1.111 2.075-2.748 3.557-4.875 4.58-4.292 2.064-10.573 2.254-18.49 1.538-5.274-.477-11.211-1.348-17.696-2.3a944.26 944.26 0 0 0-10.095-1.445C111.149 60.741 99.614 59.49 87.5 59.49c-12.114 0-23.65 1.25-34.126 2.678-3.492.476-6.861.97-10.095 1.445-6.485.952-12.422 1.823-17.696 2.3-7.917.716-14.198.526-18.49-1.538-2.127-1.023-3.764-2.505-4.875-4.58C1.103 57.712.5 55 .5 51.5c0-13.972 9.625-26.711 25.382-35.985C41.627 6.248 63.41.5 87.5.5s45.873 5.748 61.618 15.015C164.875 24.789 174.5 37.528 174.5 51.5Z"
        strokeLinecap="round"
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeOpacity={strokeOpacity}
      />
    </svg>
  );

  const lineEyes = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="63"
      height="33"
      viewBox="0 0 63 33"
      fill="none"
      className={svgClassNames}
    >
      <path
        className={pathClassNames}
        d="M26.7386 30.773C15.2838 27.9869 7.02081 22.1226 1.00015 14.9998C12.3266 7.58846 19.9681 -0.336699 33.5601 1.67148C48.0065 3.80589 53.353 14.1906 61.6825 26.3175C48.8316 30.7033 40.1058 34.0242 26.7386 30.773Z"
        strokeLinecap="round"
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeOpacity={strokeOpacity}
      />
    </svg>
  );

  const lineNose = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="57"
      height="80"
      viewBox="0 0 57 80"
      fill="none"
      className={svgClassNames}
    >
      <path
        className={pathClassNames}
        d="M1.65029 61.4893C0.899112 65.867 1.18912 68.5412 2.7474 71.5103C3.44366 72.8369 4.57355 73.881 5.89725 74.5827C12.0373 77.8379 18.0439 78.9256 30.6798 78.9996C36.9941 79.0366 49.5955 79.6357 54.5 71C56.6243 67.2597 55.9741 63.3779 55.6417 62.012C55.5577 61.6668 55.4256 61.3383 55.2771 61.0156L44.7919 38.2314L37.9576 18.0989L34.2325 5.19258C33.8159 3.74916 33.1676 2.30017 31.9287 1.45035C30.7438 0.637534 29.6562 0.622687 28.2641 1.4643C26.862 2.31195 26.0144 3.80741 25.4679 5.35197L20.9576 18.0989L14.9596 37.1562C14.7347 37.8707 14.4302 38.5577 14.0519 39.2043L2.78741 58.4556C2.23786 59.3947 1.83432 60.4169 1.65029 61.4893Z"
        strokeLinecap="round"
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeOpacity={strokeOpacity}
      />
    </svg>
  );

  const lineLips = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="86"
      height="42"
      viewBox="0 0 86 42"
      fill="none"
      className={svgClassNames}
    >
      <path
        className={pathClassNames}
        d="M85 20.8879C74.434 31.474 64.6748 41 42.2083 41C19.7418 41 8.39623 28.2976 1 19.3C13.6792 8.71466 24.7736 -4.51726 43.2642 3.4216C62.283 -4.51731 72.8491 11.8903 85 20.8879Z"
        strokeLinecap="round"
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeOpacity={strokeOpacity}
      />
    </svg>
  );

  const lineCheekbones = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="56"
      height="72"
      viewBox="0 0 56 72"
      fill="none"
      className={svgClassNames}
    >
      <path
        className={pathClassNames}
        d="M36.4937 34.6173C48.8947 51.6857 59.6386 64.4317 53 69.2549C46.3614 74.0781 24.8542 69.1521 12.4532 52.0837C0.0522724 35.0152 -1.63941 6.57841 4.99917 1.75519C11.6378 -3.06802 24.0927 17.5488 36.4937 34.6173Z"
        strokeLinecap="round"
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeOpacity={strokeOpacity}
      />
    </svg>
  );

  const lineEars = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="61"
      height="92"
      viewBox="0 0 61 92"
      fill="none"
      className={svgClassNames}
    >
      <path
        className={pathClassNames}
        d="M52.1717 59.7238C37.4994 82.804 21.2849 95.9484 7.375 89.0371C-6.53494 82.1258 3.60798 59.0827 10.8832 45.531C13.0042 7.78447 33.4668 -3.87474 47.3768 3.03659C61.2867 9.94791 64.2083 20.3708 52.1717 59.7238Z"
        strokeLinecap="round"
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeOpacity={strokeOpacity}
      />
    </svg>
  );

  return;
  <>
    {lineForehead}
    {lineEyes}
    {lineNose}
    {lineLips}
    {lineCheekbones}
    {lineEars}
  </>;
};

export default svg;
