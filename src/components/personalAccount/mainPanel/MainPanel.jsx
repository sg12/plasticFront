import "./MainPanel.scss";
import { Outlet, useLocation } from "react-router-dom";
import GreetingInfo from "./greetingInfo/GreetingInfo";
import Divider from "../../UI/dividers/Divider";
import getLinkData from "../asidePanel/getLinkData";
import { useList } from "@siberiacancode/reactuse";
import { useEffect, useState } from "react";

const MainPanel = ({ userType }) => {
  const location = useLocation();
  const linksData = getLinkData(userType);
  const [pageTitle, setPageTitle] = useState(linksData[0].text);

  useEffect(() => {
    const currentLink = linksData.find(
      (link) => link.to === location.pathname.split("/")[2]
    );
    if (currentLink) {
      setPageTitle(currentLink.text);
    }
  }, [location, linksData]);

  return (
    <main className="main">
      {location.pathname.startsWith("/account/") ? (
        <>
          {!location.pathname.startsWith("/account/profile") && (
            <>
              <div className="main__header">{pageTitle}</div>
              <Divider />
            </>
          )}
          <div className="main__main">
            <Outlet />
          </div>
        </>
      ) : (
        <GreetingInfo />
      )}
    </main>
  );
};

export default MainPanel;
