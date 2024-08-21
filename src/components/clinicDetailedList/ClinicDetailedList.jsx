import "./ClinicDetailedList.scss";

import { useParams, useNavigate } from "react-router-dom";

import PlasticServices from "../../services/PlasticServices";

import ClinicDetailedItem from "../clinicDetailedItem/ClinicDetailedItem";
import Spinner from "../spinner/Spinner";
import OutlineButton from "../UI/buttons/outlineButton/OutlineButton";
import { useQuery } from "@siberiacancode/reactuse";

const ClinicDetailedList = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    data: clinic,
    isLoading,
    isError,
    error,
  } = useQuery(() => PlasticServices.getClinic(params.id), {
    keys: [params.id],
  });

  console.log(clinic);

  return (
    <section className="clinic-detailed-list section">
      <div className="clinic-detailed-list__container container">
        { clinic && !isLoading && !isError ? (
          <ClinicDetailedItem clinic={clinic} />
        ) : (
          <h3 className="component-content-text">Нет клиники</h3>
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
  );
};

export default ClinicDetailedList;
