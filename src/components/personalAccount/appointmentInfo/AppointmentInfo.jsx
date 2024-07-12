import React, { useState } from "react";

import "./AppointmentInfo.scss";

import SelectDoctor from "./selectDoctor/SelectDoctor";
import SendingEntry from "./sendingEntry/SendingEntry";
import { useStep } from "@siberiacancode/reactuse";

const AppointmentInfo = () => {
  // TODO: Дописать запись на приём
  const stepper = useStep(2);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="appointment">
      <span className="appointment__title">Записи на приём</span>
      {stepper.currentStep === 1 ? (
        <SelectDoctor
          stepper={stepper}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
        />
      ) : (
        <SendingEntry stepper={stepper} selectedDoctor={selectedDoctor} />
      )}
    </div>
  );
};

export default AppointmentInfo;
