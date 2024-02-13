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

import Layout from "../../pages/Layout";
import MainPage from "../../pages/MainPage";
import ServicesPage from "../../pages/ServicesPage";
import DoctorsPage from "../../pages/DoctorsPage";
import ClinicsPage from "../../pages/ClinicsPage";
import DoctorPage from '../../pages/DoctorPage';
import ClinicPage from '../../pages/ClinicPage';
// import StocksPage from '../../pages/StocksPage';
import ArticlesPage from "../../pages/ArticlesPage";
import NotFound from "../notFound/NotFound";

import EnterItem from "../enterItem/EnterItem";
import EnterClient from "../enterClient/EnterClient";
import RegisterClient from "../registerClient/RegisterClient";
import EnterPartner from "../enterPartner/EnterPartner";
import RegisterDoctor from "../registerDoctor/RegisterDoctor";
import RegisterClinic from "../registerClinic/RegisterClinic";
import ForgotPassword from "../forgotPassword/ForgotPassword";
import NewPassword from "../newPassword/NewPassword";
import EnterPage from "../../pages/EnterPage";
import AccountPage from "../../pages/AccountPage";
import ArticleDetailedPage from "../../pages/ArticleDetailedPage";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<MainPage />}></Route>
					<Route path="services" element={<ServicesPage />}></Route>
					<Route path="doctors" element={<DoctorsPage />}></Route>
					<Route path='doctors/:id' element={<DoctorPage />}></Route>
					<Route path="clinics" element={<ClinicsPage />}></Route>
					<Route path='clinics/:id' element={<ClinicPage />}></Route>
					{/* <Route path='stocks' element={<StocksPage />}></Route> */}
					<Route path="articles" element={<ArticlesPage />}></Route>
					<Route path="articles/:id" element={<ArticleDetailedPage />}></Route>
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
