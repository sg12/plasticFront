import { Routes, Route } from "react-router-dom";

import "normalize.css";
import "./App.scss";

// Account - `AsidePanel.jsx`
import FavouritesInfo from "../navBars/favouritesInfo/FavouritesInfo";
import SettingsInfo from "../navBars/settingsInfo/SettingsInfo";
import ProfileUser from "../navBars/profileUser/ProfileUser";
import SpecialistInfo from "../navBars/specialistInfo/SpecialistInfo";
import ReviewsInfo from "../navBars/reviewsInfo/ReviewsInfo";
import HelpInfo from "../navBars/helpInfo/HelpInfo";
import SupportInfo from "../navBars/supportInfo/SupportInfo";
import ClinicsInfo from "../navBars/clinicsInfo/ClinicsInfo";
import ServicesInfo from "../navBars/servicesInfo/ServicesInfo";

import Layout from "../../pages/Layout";
import MainPage from "../../pages/MainPage";
import ServicesPage from "../../pages/ServicesPage";
import DoctorsPage from "../../pages/DoctorsPage";
import ClinicsPage from "../../pages/ClinicsPage";
// import StocksPage from '../../pages/StocksPage';
import ArticlesPage from "../../pages/ArticlesPage";
import NotFound from "../notFound/NotFound";

import EnterItem from "../enterItem/enterItem";
import EnterClient from "../enterClient/EnterClient";
import RegisterClient from "../registerClient/RegisterClient";
import EnterPartner from "../enterPartner/EnterPartner";
import RegisterDoctor from "../registerDoctor/RegisterDoctor";
import RegisterClinic from "../registerClinic/RegisterClinic";
import ForgotPassword from "../forgotPassword/ForgotPassword";
import NewPassword from "../newPassword/newPassword";
import EnterPage from "../../pages/EnterPage";
import AccountPage from "../../pages/AccountPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />}></Route>
          <Route path="services" element={<ServicesPage />}></Route>
          <Route path="doctors" element={<DoctorsPage />}></Route>
          <Route path="clinics" element={<ClinicsPage />}></Route>
          {/* <Route path='stocks' element={<StocksPage />}></Route> */}
          <Route path="articles" element={<ArticlesPage />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Route>
        <Route path="enterPage" element={<EnterPage />}>
          <Route index element={<EnterItem />}></Route>
          <Route path="enterClient" element={<EnterClient />}></Route>
          <Route path="registerClient" element={<RegisterClient />}></Route>
          <Route path="enterPartner" element={<EnterPartner />}></Route>
          <Route path="registerDoctor" element={<RegisterDoctor />}></Route>
          <Route path="registerClinic" element={<RegisterClinic />}></Route>
          <Route path="forgotPassword" element={<ForgotPassword />}></Route>
          <Route path="newPassword" element={<NewPassword />}></Route>
        </Route>
        <Route path="account" element={<AccountPage />}>
          <Route path="profile" element={<ProfileUser />} />
          <Route path="reviews" element={<ReviewsInfo />} />
          <Route path="help" element={<HelpInfo />} />
          <Route path="support" element={<SupportInfo />} />
          <Route path="clinic" element={<ClinicsInfo />} />
          <Route path="service" element={<ServicesInfo />} />
          <Route path="specialist" element={<SpecialistInfo />} />
          <Route path="settings" element={<SettingsInfo />} />
          <Route path="favourites" element={<FavouritesInfo />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
