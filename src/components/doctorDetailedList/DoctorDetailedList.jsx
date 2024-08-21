import "./DoctorDetailedList.scss";

import { useParams, useNavigate } from "react-router-dom";

import PlasticServices from "../../services/PlasticServices";

import DoctorDetailedItem from "../doctorDetailedItem/DoctorDetailedItem";
import Spinner from "../spinner/Spinner";
import OutlineButton from "../UI/buttons/outlineButton/OutlineButton";
import { useQuery } from "@siberiacancode/reactuse";

const DoctorDetailedList = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    data: doctor,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery(() => PlasticServices.getDoctor(params.id), {
    keys: [params.id],
  });

  return (
    <>
      <section className="doctor-detailed-list section">
        <div className="doctor-detailed-list__container container">
          {!isLoading && !isError ? (
            <DoctorDetailedItem doctor={doctor} />
          ) : (
            <h3 className="component-content-text">Нет врача</h3>
          )}
          {isError && (
            <h3 className="component-error-text">Ошибка: {error.message}</h3>
          )}
          {isLoading && <Spinner />}
          {isError ||
            (isLoading && (
              <OutlineButton
                className="component-button-text"
                onClick={() => navigate(-1)}
              >
                Вернутся назад
              </OutlineButton>
            ))}
        </div>
      </section>
    </>
  );
};

export default DoctorDetailedList;
