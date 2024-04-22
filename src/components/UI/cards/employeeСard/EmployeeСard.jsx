import { useState } from "react";
import OutlineButton from "../../buttons/outlineButton/OutlineButton";
import Tag from "../../tags/Tag";
import styles from "./EmployeeСard.module.scss";
import ContextMenu from "../../contextMenu/ContextMenu";

// Номер, ФИО, Специальность, Статус // Фильтрация, Доп - Удаление, Изменение, Сохранение, Переход в лк врача

const EmployeeСard = ({ userData }) => {
  const [menu, setMenu] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenu({
      xPos: e.pageX + "px",
      yPos: e.pageY + "px",
    });
  };

  const menuItems = [
    {
      label: "Перейти на страницу",
      onClick: () => alert("Переход на страницу"),
    },
    { label: "Удалить", onClick: () => alert("Удалить") },
    { label: "Изменить", onClick: () => alert("Изменить") },
  ];

  const tags = [
    `ID: ${userData.id}`,
    `${userData.isActive}`,
    `${userData.isOnline}`,
    // ...(userData.tags || []),
  ];

  return (
    <div className={styles.employee} onContextMenu={handleContextMenu}>
      {menu && (
        <ContextMenu
          xPos={menu.xPos}
          yPos={menu.yPos}
          onClose={() => setMenu(null)}
          items={menuItems}
        />
      )}
      <div className={styles.employee__avatar}>
        <img
          className={styles.employee__image}
          src={userData?.avatar}
          alt="employee"
        />
      </div>
      <div className={styles.employee__info}>
        <div className={styles.employee__tags}>
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        <span className={styles.employee__name}>
          {userData?.username || "Фио"}
        </span>
        <span className={styles.employee__position}>
          {userData?.specialization || "Специализация"}
        </span>
        <OutlineButton
          onClick={() =>
            alert(
              "TODO: Реализовать переход на страницу врача. Можно сделать в виде модального окна"
            )
          }
        >
          Страница врача
        </OutlineButton>
      </div>
    </div>
  );
};

export default EmployeeСard;
