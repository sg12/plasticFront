import { useState, useEffect } from "react";
import "./HelpInfo.scss";
import { useFetching } from "../../../hooks/useFetching";
import PlasticServices from "../../../services/PlasticServices";
import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Spinner from "../../UI/preloader/Spinner";

const HelpInfo = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [visibleQuestions, setVisibleQuestions] = useState(5);
  const [faq, setFaq] = useState([]);
  
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const showMoreQuestions = () => {
    setVisibleQuestions((prevCount) => prevCount + 3);
  };

  const [fetchFaq, isFaqLoading, faqError] = useFetching(async () => {
    const response = await PlasticServices.getFaq();
    return setFaq(response.data);
  });

  useEffect(() => {
    fetchFaq();
  }, []);

  return (
    <div className="help">
      <span className="help__title">Часто задаваемые вопросы</span>
      {faqError}
      {isFaqLoading ? (
        <Spinner />
      ) : (
        <>
          {faq.slice(0, visibleQuestions).map((item, index) => (
            <div
              key={item.id}
              className={`help__accordion ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleAccordion(index)}
            >
              <span className="help__question">{item.question}</span>
              {openIndex === index && (
                <p className="help__answer">{item.answer}</p>
              )}
            </div>
          ))}
          {visibleQuestions < faq.length && (
            <OutlineButton onClick={showMoreQuestions}>
              Показать ещё
            </OutlineButton>
          )}
        </>
      )}
    </div>
  );
};

export default HelpInfo;
