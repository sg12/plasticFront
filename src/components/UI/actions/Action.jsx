import { useState } from "react";
import styles from "./Action.module.scss";
import FilterModal from "../modals/filterModal/FilterModal";
import ControlModal from "../modals/controlModal/ControlModal";

const Action = ({ onRefresh, onMoreOptions }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isControlOpen, setIsControlOpen] = useState(false);
  const more = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4.98273 13C4.43571 13.0048 4 12.5513 4 12.0022C4 11.4454 4.43921 11.0073 4.96924 11.0001L4.97822 11C5.51861 11 5.95645 11.4476 5.95645 12C5.95645 12.5509 5.52104 12.9975 4.98273 13ZM4.98273 13L4.98721 12.9999M4.98273 13L4.97822 13M11.5045 13C10.9575 13.0048 10.5218 12.5513 10.5218 12.0022C10.5218 11.4454 10.961 11.0073 11.491 11.0001L11.5 11C12.0404 11 12.4782 11.4476 12.4782 12C12.4782 12.5509 12.0428 12.9975 11.5045 13ZM11.5045 13L11.509 12.9999M11.5045 13L11.5 13M18.0263 13C17.4793 13.0048 17.0436 12.5513 17.0436 12.0022C17.0436 11.4454 17.4828 11.0073 18.0128 11.0001L18.0218 11C18.5622 11 19 11.4476 19 12C19 12.5509 18.5646 12.9975 18.0263 13ZM18.0263 13L18.0308 12.9999M18.0263 13L18.0218 13"
        stroke="#3066BE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const refresh = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M19.488 4.63901V8.17501H15.953M19.027 8.175C17.67 5.688 15.032 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20C16.418 20 20 16.418 20 12"
        stroke="#3066BE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const filter = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M19.8705 6.58124C20.3433 5.91937 19.8702 5 19.0568 5H5.94319C5.12982 5 4.65669 5.91937 5.12946 6.58124L10.3522 13.8931C10.4733 14.0627 10.5385 14.2659 10.5385 14.4743V20.1315C10.5385 20.9302 11.4286 21.4066 12.0932 20.9635L14.0162 19.6815C14.2944 19.496 14.4615 19.1838 14.4615 18.8494V14.4743C14.4615 14.2659 14.5267 14.0627 14.6478 13.8931L19.8705 6.58124Z"
        stroke="#3066BE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={styles.action}>
      <button className={styles.button__refresh} onClick={onRefresh}>
        {refresh}
      </button>
      <button
        className={styles.button__filter}
        onClick={() => setIsFilterOpen(true)}
      >
        {filter}
      </button>
      {isFilterOpen && (
        <FilterModal
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          style="right"
          animationEnabled={true}
          animationTime={400}
        ></FilterModal>
      )}
      <button
        className={styles.button__more}
        onClick={() => setIsControlOpen(!isControlOpen)}
      >
        {more}
      </button>
      {isControlOpen && (
        <ControlModal
          onDelete={() => setIsControlOpen(false)}
          onEdit={() => setIsControlOpen(false)}
          onSave={() => setIsControlOpen(false)}
          isControlOpen={isControlOpen}
          setIsControlOpen={setIsControlOpen}
        />
      )}
    </div>
  );
};

export default Action;
