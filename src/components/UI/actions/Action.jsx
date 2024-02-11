import { useState } from "react";
import styles from "./Action.module.scss";
import FilterModal from "../modals/filterModal/FilterModal";
import ControlModal from "../modals/controlModal/ControlModal";

const Action = ({ onRefresh, onMoreOptions, actionType }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isControlOpen, setIsControlOpen] = useState(false);

  const getIcon = () => {
    switch (actionType) {
      case "refresh":
        return (
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
      case "filter":
        return (
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
      case "more":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M11 4.98273C10.9952 4.43571 11.4487 4 11.9978 4C12.5546 4 12.9927 4.43921 12.9999 4.96924L13 4.97822C13 5.51861 12.5524 5.95645 12 5.95645C11.4491 5.95645 11.0025 5.52104 11 4.98273ZM11 4.98273L11.0001 4.98721M11 4.98273L11 4.97822M11 11.5045C10.9952 10.9575 11.4487 10.5218 11.9978 10.5218C12.5546 10.5218 12.9927 10.961 12.9999 11.491L13 11.5C13 12.0404 12.5524 12.4782 12 12.4782C11.4491 12.4782 11.0025 12.0428 11 11.5045ZM11 11.5045L11.0001 11.509M11 11.5045L11 11.5M11 18.0263C10.9952 17.4793 11.4487 17.0436 11.9978 17.0436C12.5546 17.0436 12.9927 17.4828 12.9999 18.0128L13 18.0218C13 18.5622 12.5524 19 12 19C11.4491 19 11.0025 18.5646 11 18.0263ZM11 18.0263L11.0001 18.0308M11 18.0263L11 18.0218"
              stroke="#3066BE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      // case "add":
        return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11 4.98273C10.9952 4.43571 11.4487 4 11.9978 4C12.5546 4 12.9927 4.43921 12.9999 4.96924L13 4.97822C13 5.51861 12.5524 5.95645 12 5.95645C11.4491 5.95645 11.0025 5.52104 11 4.98273ZM11 4.98273L11.0001 4.98721M11 4.98273L11 4.97822M11 11.5045C10.9952 10.9575 11.4487 10.5218 11.9978 10.5218C12.5546 10.5218 12.9927 10.961 12.9999 11.491L13 11.5C13 12.0404 12.5524 12.4782 12 12.4782C11.4491 12.4782 11.0025 12.0428 11 11.5045ZM11 11.5045L11.0001 11.509M11 11.5045L11 11.5M11 18.0263C10.9952 17.4793 11.4487 17.0436 11.9978 17.0436C12.5546 17.0436 12.9927 17.4828 12.9999 18.0128L13 18.0218C13 18.5622 12.5524 19 12 19C11.4491 19 11.0025 18.5646 11 18.0263ZM11 18.0263L11.0001 18.0308M11 18.0263L11 18.0218"
                stroke="#3066BE"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
        );
      default:
        return null;
    }
  };

  const handleButtonClick = () => {
    switch (actionType) {
      case "refresh":
        onRefresh();
        break;
      case "filter":
        setIsFilterOpen(true);
        break;
      case "more":
        setIsControlOpen(!isControlOpen);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.action}>
      <button
        className={styles.button}
        onClick={handleButtonClick}
        // onMouseEnter={() => {
        //   setIsControlOpen(true);
        // }}
        // onMouseLeave={() => {
        //   setIsControlOpen(false);
        // }}
      >
        {getIcon()}
      </button>
      {actionType === "filter" && isFilterOpen && (
        <FilterModal
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          style="right"
          animationEnabled={true}
          animationTime={400}
        ></FilterModal>
      )}
      {actionType === "more" && isControlOpen && (
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
