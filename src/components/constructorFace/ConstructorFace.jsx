import "./ConstructorFace.scss";
import SvgLine from "./SvgLine";
import facesConfig from "./FacesConfig";
import { useEffect, useRef } from "react";

const ConstructorFace = ({
  activeFace = "woman", // woman or man
  activeFaceStyle = "european", // asian or european
  activeLine,
  setActiveLine,
}) => {
  console.log(activeFace, activeFaceStyle, activeLine);

  const handleMouseEnter = (lineId, groupId) => {
    const activeId = groupId || lineId;
    setActiveLine(activeId);
  };

  const getLineClassName = (lineId, groupId) => {
    const isActive = groupId ? activeLine === groupId : activeLine === lineId;
    return `constructor-face__line ${lineId} ${isActive ? "active" : ""}`;
  };

  const getGroupClassName = (groupId) => {
    return `constructor-face__group ${groupId} ${
      activeLine === groupId ? "active" : ""
    }`;
  };

  const renderLineGroup = (groupId, group) => {
    return (
      <div key={groupId} className={getGroupClassName(groupId)}>
        {Object.entries(group).map(([subLineId, subLineProps]) => (
          <div
            key={subLineId}
            className={getLineClassName(subLineId, groupId)}
            onClick={() => handleMouseEnter(subLineId, groupId)}
          >
            <SvgLine
              {...subLineProps}
              svgClassNames="sgv-line"
              pathClassNames="svg-line-path"
              stroke="#000"
              strokeOpacity={0.5}
              strokeDasharray={3}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderLines = (linesConfig) => {
    return Object.entries(linesConfig).map(([lineId, lineProps]) => {
      // Группа линий
      if (typeof lineProps === "object" && !lineProps.pathD) {
        return renderLineGroup(lineId, lineProps);
      } else {
        // Одиночная линия
        return (
          <div
            key={lineId}
            className={getLineClassName(lineId)}
            onClick={() => handleMouseEnter(lineId)}
          >
            <SvgLine
              {...lineProps}
              svgClassNames="sgv-line"
              pathClassNames="svg-line-path"
              stroke="#000"
              strokeOpacity={0.5}
              strokeDasharray={3}
            />
          </div>
        );
      }
    });
  };

  const currentFaceConfig = facesConfig[activeFace][activeFaceStyle];

  const containerRef = useRef(null);

  useEffect(() => {
    // Обработчик клика на всей странице
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveLine(null); // Убираем активный класс
      }
    };
    // Добавляем обработчик события клика при монтировании компонента
    document.addEventListener("mousedown", handleClickOutside);
    // Очищаем обработчик события клика при размонтировании компонента
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef, setActiveLine]);

  return (
    <div className="constructor-face__container">
      <div className="constructor-face__wrapper">
        <div className="constructor-face__image">
          <img
            src={currentFaceConfig.image}
            className="constructor-face__img"
            alt="face"
          />
        </div>
        <div ref={containerRef} className="constructor-face__lines">
          {renderLines(currentFaceConfig.lines)}
        </div>
      </div>
    </div>
  );
};

export default ConstructorFace;
