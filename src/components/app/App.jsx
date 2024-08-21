import { Routes, Route } from "react-router-dom";

import "normalize.css";
import "./App.scss";

// Account - `AsidePanel.jsx`
import FavouritesInfo from "../personalAccount/favouritesInfo/FavouritesInfo";
import SettingsInfo from "../personalAccount/settingsInfo/SettingsInfo";
import ProfileUser from "../personalAccount/profileUser/ProfileUser";
import SpecialistInfo from "../personalAccount/specialistInfo/SpecialistInfo";
import ReviewsInfo from "../personalAccount/reviewsInfo/ReviewsInfo";
import HelpInfo from "../personalAccount/helpInfo/HelpInfo";
import SupportInfo from "../personalAccount/supportInfo/SupportInfo";
import ClinicsInfo from "../personalAccount/clinicsInfo/ClinicsInfo";
import ServicesInfo from "../personalAccount/servicesInfo/ServicesInfo";
import AppointmentInfo from "../personalAccount/appointmentInfo/AppointmentInfo";
import AppointmentHistoryInfo from "../personalAccount/appointmentHistoryInfo/AppointmentHistoryInfo";

import Layout from "../../pages/Layout";
import MainPage from "../../pages/MainPage";
import DoctorsPage from "../../pages/DoctorsPage";
import ClinicsPage from "../../pages/ClinicsPage";
import DoctorPage from "../../pages/DoctorPage";
import ClinicPage from "../../pages/ClinicPage";
// import ArticlesPage from "../../pages/ArticlesPage";
// import ArticleDetailedPage from "../../pages/ArticleDetailedPage";
import ConstructorPage from "../../pages/ConstructorPage";

import NotFound from "../notFound/NotFound";

import EnterItem from "../enterItem/EnterItem";
import RegisterClient from "../register/Register";
import RegisterDoctor from "../register/Register";
import RegisterClinic from "../register/Register";
import ForgotPassword from "../forgotPassword/ForgotPassword";
import NewPassword from "../newPassword/NewPassword";
import EnterPage from "../../pages/EnterPage";
import AccountPage from "../../pages/AccountPage";
import PrivateRoute from "../../routes/PrivateRoute";
import Enter from "../enter/Enter";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="doctors/:id" element={<DoctorPage />} />
        <Route path="clinics" element={<ClinicsPage />} />
        <Route path="clinics/:id" element={<ClinicPage />} />
        {/* <Route path="articles" element={<ArticlesPage />} /> */}
        {/* <Route path="articles/:id" element={<ArticleDetailedPage />} /> */}
        <Route path="constructor" element={<ConstructorPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />

      <Route path="enterPage" element={<EnterPage />}>
        <Route index element={<EnterItem />} />
        <Route path="client" element={<Enter />} />
        <Route path="partner" element={<Enter />} />
        <Route path="registerClient" element={<RegisterClient />} />
        <Route path="registerDoctor" element={<RegisterDoctor />} />
        <Route path="registerClinic" element={<RegisterClinic />} />
        <Route path="forgotPassword" element={<ForgotPassword />} />
        <Route path="newPassword" element={<NewPassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="account" element={<AccountPage />}>
          <Route path="profile" element={<ProfileUser />} />
          <Route path="reviews" element={<ReviewsInfo />} />
          <Route path="appointment" element={<AppointmentInfo />} />
          <Route
            path="appointment-history"
            element={<AppointmentHistoryInfo />}
          />
          <Route path="help" element={<HelpInfo />} />
          <Route path="support" element={<SupportInfo />} />
          <Route path="clinic" element={<ClinicsInfo />} />
          <Route path="service" element={<ServicesInfo />} />
          <Route path="specialist" element={<SpecialistInfo />} />
          <Route path="settings" element={<SettingsInfo />} />
          <Route path="favourites" element={<FavouritesInfo />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
