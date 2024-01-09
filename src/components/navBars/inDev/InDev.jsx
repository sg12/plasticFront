import styles from "./InDev.module.scss";

const InDev = ({ children }) => {
  return (
    <div className={styles.inDev}>
      <div className={styles.watermark}>В разработке</div>
      <div className={styles.blur}>{children}</div>
    </div>
  );
};

export default InDev;
