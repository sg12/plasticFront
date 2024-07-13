import React, { useState } from "react";

import "./AppointmentInfo.scss";

import SelectDoctor from "./selectDoctor/SelectDoctor";
import SendingEntry from "./sendingEntry/SendingEntry";
import { useStep } from "@siberiacancode/reactuse";

const AppointmentInfo = () => {
  const stepper = useStep(2);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="appointment">
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
