import { useState } from "react";
import "./HelpInfo.scss";

const HelpInfo = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [visibleQuestions, setVisibleQuestions] = useState(2);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const showMoreQuestions = () => {
    setVisibleQuestions((prevCount) => prevCount + 3);
  };

  const faqData = [
    {
      id: 1,
      question: "Что такое React?",
      answer:
        "React - это библиотека JavaScript для создания пользовательских интерфейсов.",
    },
    {
      id: 2,
      question: "Как создать компонент в React?",
      answer:
        "Компонент в React можно создать с использованием функциональных или классовых компонентов.",
    },
    {
      id: 3,
      question: "Что такое хуки в React?",
      answer:
        "Хуки - это функции, которые позволяют использовать состояние и другие возможности React в функциональных компонентах.",
    },
  ];

  return (
    <div className="help">
      <span className="help__title">Часто задаваемые вопросы</span>
      {faqData.slice(0, visibleQuestions).map((item, index) => (
        <div
          key={item.id}
          className={`help__accordion ${openIndex === index ? "open" : ""}`}
          onClick={() => toggleAccordion(index)}
        >
          <span className="help__question">{item.question}</span>
          {openIndex === index && <p className="help__answer">{item.answer}</p>}
        </div>
      ))}
      {visibleQuestions < faqData.length && (
        <button className="help__more" onClick={showMoreQuestions}>Показать ещё</button>
      )}
    </div>
  );
};

export default HelpInfo;

// import { useState } from "react";
// import "./HelpInfo.scss";
// import { useUser } from "../../../context/UserContext";

// const HelpInfo = () => {
//   const { userData } = useUser();
//   const [openIndex, setOpenIndex] = useState(null);
//   console.log(userData);

//   const toggleAccordion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className="help">
//       <span className="help__title">Часто задаваемые вопросы</span>
//       {Object.keys(userData).map((item, index) => (
//         <div
//           key={userData.id}
//           className={`help__accordion ${openIndex === index ? "open" : ""}`}
//           onClick={() => toggleAccordion(index)}
//         >
//           <span className="help__question">{userData.title}</span>
//           {openIndex === index && <p className="help__answer">{item.answer}</p>}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default HelpInfo;
