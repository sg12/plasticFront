import { useEffect, useState } from "react";

import AsidePanel from "./asidePanel/AsidePanel";
import HeaderPanel from "./headerPanel/HeaderPanel";
import MainPanel from "./mainPanel/MainPanel";

import "./NavBars.scss";
import "./root.scss";
import PlasticServices from "../../services/PlasticServices";
import { useFetching } from "../../hooks/useFetching";
// import Toast from "../UI/toast/Toast";

// import Spinner from "../spinner/Spinner";

const NavBars = () => {
  const [isAsideVisible, setAsideVisible] = useState(window.innerWidth > 1440);
  const [userData, setUserData] = useState(null);
  const userType = "clinic"; // Заглушка для выбора типа пользователя

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const userData = await PlasticServices.getUsers();
  //       setUserData(userData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [setUserData]);

  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PlasticServices.getUsers();
    setUserData(response.data);
    // console.log(response.data);
    // setPage(page + 1);
    // setTotalCount(response.headers['x-total-count']);
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  // const error = postError ? (
  //   <h3 className="articles-item__title" style={{ textAlign: "center" }}>
  //     Ошибка: {postError}
  //   </h3>
  // ) : null;

  // const spinner = isPostsLoading ? <Spinner /> : null;

  return (
    <div className="grid-container">
      <header className="header-grid">
        <HeaderPanel
          userData={userData}
          onToggleAside={() => setAsideVisible(!isAsideVisible)}
        />
      </header>
      {isAsideVisible && (
        <aside className="aside-grid">
          <AsidePanel userType={userType} />
        </aside>
      )}
      <main className="main-grid">
        <MainPanel userData={userData} userType={userType} />
      </main>
    </div>
  );
};

export default NavBars;
