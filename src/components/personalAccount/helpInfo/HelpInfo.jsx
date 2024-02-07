import { useState, useEffect } from "react";
import "./HelpInfo.scss";
import { useFetching } from "../../../hooks/useFetching";
import PlasticServices from "../../../services/PlasticServices";

const HelpInfo = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faq, setFaq] = useState("");
  const [visibleQuestions, setVisibleQuestions] = useState(2);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const showMoreQuestions = () => {
    setVisibleQuestions((prevCount) => prevCount + 3);
  };

  const [fetchFaq, isFaqLoading, faqError] = useFetching(async () => {
    try {
      const response = await PlasticServices.getFaq();
      setFaq(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке FAQ:", error);
    }
  });

  useEffect(() => {
    fetchFaq();
  }, []);

  return (
    <div className="help">
      <span className="help__title">Часто задаваемые вопросы</span>
      {faq.slice(0, visibleQuestions).map((item, index) => (
        <div
          key={item.id}
          className={`help__accordion ${openIndex === index ? "open" : ""}`}
          onClick={() => toggleAccordion(index)}
        >
          <span className="help__question">{item.question}</span>
          {openIndex === index && <p className="help__answer">{item.answer}</p>}
        </div>
      ))}
      {visibleQuestions < faq.length && (
        <button className="help__more" onClick={showMoreQuestions}>
          Показать ещё
        </button>
      )}
    </div>
  );
};

export default HelpInfo;
