import OutlineButton from "../../buttons/outlineButton/OutlineButton";
import Tag from "../../tags/Tag";
import styles from "./EmployeeСard.module.scss";
import { FaRegTrashCan } from "react-icons/fa6";

const EmployeeСard = ({ userData, onDelete }) => {
  const tags = [
    `ID: ${userData?.id}`,
    `${userData?.isActive}`,
    `${userData?.isOnline}`,
    // ...(userData.tags || []),
  ];

  return (
    <div className={styles.employee}>
      <div className={styles.employee__avatar}>
        <img
          className={styles.employee__image}
          src={userData?.avatar}
          alt="employee"
        />
      </div>
      <div className={styles.employee__info}>
        <div className={styles.employee__tags}>
          {tags.map((tag, index) => (
            <Tag key={index} label={tag} />
          ))}
        </div>
        <span className={styles.employee__name}>
          {userData?.username || "ФИО"}
        </span>
        <span className={styles.employee__position}>
          {userData?.specialization || "Специализация"}
        </span>
        <div className={styles.employee__buttons}>
          <OutlineButton onClick={onDelete}>
            <FaRegTrashCan />
          </OutlineButton>
        </div>
      </div>
    </div>
  );
};

export default EmployeeСard;
