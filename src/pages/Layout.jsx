import { Outlet } from "react-router-dom";

import Header from "../components/header/Header";
import HeaderMobile from "../components/headerMobile/HeaderMobile";
import Footer from "../components/footer/Footer";

import { useEffect, useState } from "react";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 1024px)").matches
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? <HeaderMobile /> : <Header />}
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
