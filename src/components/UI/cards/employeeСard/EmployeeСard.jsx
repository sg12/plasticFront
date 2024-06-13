import { useState } from "react";
import OutlineButton from "../../buttons/outlineButton/OutlineButton";
import Tag from "../../tags/Tag";
import styles from "./EmployeeСard.module.scss";
// import ContextMenu from "../../contextMenu/ContextMenu";
import { Link } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";

// Номер, ФИО, Специальность, Статус // Фильтрация, Доп - Удаление, Изменение, Сохранение, Переход в лк врача

const EmployeeСard = ({ userData, onDelete }) => {
  // Контекстное меню в данный момент не требуется.

  // const [menu, setMenu] = useState(null);

  // const handleContextMenu = (e) => {
  //   e.preventDefault();
  //   setMenu({
  //     xPos: e.pageX + "px",
  //     yPos: e.pageY + "px",
  //   });
  // };

  // const menuItems = [
  //   // {
  //   //   label: "Перейти на страницу",
  //   //   onClick: () => alert("Переход на страницу"),
  //   // },
  //   { label: "Удалить", onClick: onDelete },
  //   // { label: "Изменить", onClick: onEdit },
  // ];

  const tags = [
    `ID: ${userData.id}`,
    `${userData.isActive}`,
    `${userData.isOnline}`,
    // ...(userData.tags || []),
  ];

  return (
    <div className={styles.employee}>
      {/* onContextMenu={handleContextMenu} - вставить в верхний div при необходимости контекстного меню*/}
      {/* {menu && (
        <ContextMenu
          xPos={menu.xPos}
          yPos={menu.yPos}
          onClose={() => setMenu(null)}
          items={menuItems}
        />
      )} */}
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
          {userData?.username || "ФИО"}
        </span>
        <span className={styles.employee__position}>
          {userData?.specialization || "Специализация"}
        </span>
        <div className={styles.employee__buttons}>
          <Link
            style={{ textDecoration: "none", width: "100%" }}
            target="_blank"
            to={"https://t.me/valtrsv"}
          >
            <OutlineButton
              style={{ width: "100%" }}
              onClick={() =>
                console.log(
                  `Переход в телеграм - https://t.me/valtrsv ${"\n"}Изменить на ссылки пользователей`
                )
              }
            >
              Мессенджер
            </OutlineButton>
          </Link>
          <OutlineButton onClick={onDelete}>
            <FaRegTrashCan />
          </OutlineButton>
        </div>
      </div>
    </div>
  );
};

export default EmployeeСard;
