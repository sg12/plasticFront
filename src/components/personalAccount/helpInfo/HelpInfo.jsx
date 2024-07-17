import { useState } from "react";
import { useQuery } from "@siberiacancode/reactuse";

import "./HelpInfo.scss";

import PlasticServices from "../../../services/PlasticServices";

import OutlineButton from "../../UI/buttons/outlineButton/OutlineButton";
import Spinner from "../../UI/preloader/Spinner";

const HelpInfo = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [visibleQuestions, setVisibleQuestions] = useState(5);

  const {
    data: faq,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery(() => PlasticServices.getFaq());

  return (
    <div className="help">
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : faq?.data?.length === 0 ? (
        <span className="support__subtitle">Нет обращений</span>
      ) : isSuccess ? (
        <>
          {faq?.data?.slice(0, visibleQuestions).map((item, index) => (
            <div
              key={item.id}
              className={`help__accordion ${openIndex === index ? "open" : ""}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="help__question">{item.question}</span>
              {openIndex === index && (
                <p className="help__answer">{item.answer}</p>
              )}
            </div>
          ))}

          {visibleQuestions < faq?.data?.length && (
            <OutlineButton
              onClick={() => setVisibleQuestions((prevCount) => prevCount + 3)}
            >
              Показать ещё
            </OutlineButton>
          )}
        </>
      ) : null}
    </div>
  );
};

export default HelpInfo;
