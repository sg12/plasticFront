import { Routes, Route } from "react-router-dom";

import "normalize.css";
import "./App.scss";

import Layout from "../../pages/Layout";
import MainPage from "../../pages/MainPage";
import ServicesPage from "../../pages/ServicesPage";
import DoctorsPage from "../../pages/DoctorsPage";
import ClinicsPage from "../../pages/ClinicsPage";
import ReviewsPage from "../../pages/ReviewsPage";
import ArticlesPage from "../../pages/ArticlesPage";
import NotFound from "../notFound/NotFound";
import AccountPage from "../../pages/AccountPage";

// Account - `AsidePanel.jsx`
import FavouritesInfo from '../navBars/favouritesInfo/FavouritesInfo';
import SettingsInfo from "../navBars/settingsInfo/SettingsInfo";
import ProfileUser from "../navBars/profileUser/ProfileUser";
import SpecialistInfo from "../navBars/specialistInfo/SpecialistInfo";
import ReviewsInfo from "../navBars/reviewsInfo/ReviewsInfo";

function App() {
  return (
    <>
      <Routes>
			<Route path="/" element={<Layout />}>
			<Route index element={<MainPage />}></Route>
			<Route path="services" element={<ServicesPage />}></Route>
			<Route path="doctors" element={<DoctorsPage />}></Route>
			<Route path="clinics" element={<ClinicsPage />}></Route>
			<Route path="reviews" element={<ReviewsPage />}></Route>
			<Route path="articles" element={<ArticlesPage />}></Route>
			<Route path="*" element={<NotFound />}></Route>
			</Route>

			<Route path="account" element={<AccountPage />}>
				<Route path="profile" element={<ProfileUser/>} />
				<Route path="reviews" element={<ReviewsInfo />} />
				<Route path="specialist" element={<SpecialistInfo />} />
				<Route path="settings" element={<SettingsInfo />} />
				<Route path="favourites" element={<FavouritesInfo />} />
			</Route>
		</Routes>
		</>
	);
}

export default App;
