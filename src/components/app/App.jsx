import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import "normalize.css";
import "./App.scss";

// Account - `AsidePanel.jsx`
// import FavouritesInfo from "../personalAccount/favouritesInfo/FavouritesInfo";
// import SettingsInfo from "../personalAccount/settingsInfo/SettingsInfo";
// import ProfileUser from "../personalAccount/profileUser/ProfileUser";
// import SpecialistInfo from "../personalAccount/specialistInfo/SpecialistInfo";
// import ReviewsInfo from "../personalAccount/reviewsInfo/ReviewsInfo";
// import HelpInfo from "../personalAccount/helpInfo/HelpInfo";
// import SupportInfo from "../personalAccount/supportInfo/SupportInfo";
// import ClinicsInfo from "../personalAccount/clinicsInfo/ClinicsInfo";
// import ServicesInfo from "../personalAccount/servicesInfo/ServicesInfo";

//import Layout from "../../pages/Layout";
//import MainPage from "../../pages/MainPage";
//import ServicesPage from "../../pages/ServicesPage";
//import DoctorsPage from "../../pages/DoctorsPage";
//import ClinicsPage from "../../pages/ClinicsPage";
//import DoctorPage from '../../pages/DoctorPage';
//import ClinicPage from '../../pages/ClinicPage';
//  import StocksPage from '../../pages/StocksPage';
//import ArticlesPage from "../../pages/ArticlesPage";
//import NotFound from "../notFound/NotFound";
//import ConstructorPage from "../../pages/ConstructorPage";

// import EnterItem from "../enterItem/enterItem";
// import EnterClient from "../enterClient/EnterClient";
// import RegisterClient from "../registerClient/RegisterClient";
// import EnterPartner from "../enterPartner/EnterPartner";
// import RegisterDoctor from "../registerDoctor/RegisterDoctor";
// import RegisterClinic from "../registerClinic/RegisterClinic";
// import ForgotPassword from "../forgotPassword/ForgotPassword";
// import NewPassword from "../newPassword/newPassword";
// import EnterPage from "../../pages/EnterPage";
// import AccountPage from "../../pages/AccountPage";
// import ArticleDetailedPage from "../../pages/ArticleDetailedPage";
// import PrivateRoute from "../../routes/PrivateRoute";

const FavouritesInfo= lazy(() => import("../personalAccount/favouritesInfo/FavouritesInfo"));
const SettingsInfo = lazy(() => import("../personalAccount//settingsInfo/SettingsInfo"));
const ProfileUser = lazy(() => import("../personalAccount/profileUser/ProfileUser"));
const SpecialistInfo= lazy(() => import("../personalAccount/specialistInfo/SpecialistInfo"));
const ReviewsInfo = lazy(() => import("../personalAccount/reviewsInfo/ReviewsInfo"));
const HelpInfo= lazy(() => import("../personalAccount/helpInfo/HelpInfo"));
const SupportInfo= lazy(() => import("../personalAccount/supportInfo/SupportInfo"));
const ClinicsInfo = lazy(() => import("../personalAccount/clinicsInfo/ClinicsInfo"));
const ServicesInfo = lazy(() => import("../personalAccount/servicesInfo/ServicesInfo"));

const Layout = lazy(() => import("../../pages/Layout"));
const MainPage = lazy(() => import("../../pages/MainPage"));
const ServicesPage = lazy(() => import("../../pages/ServicesPage"));
const DoctorsPage = lazy(() => import("../../pages/DoctorsPage"));
const ClinicsPage = lazy(() => import("../../pages/ClinicsPage"));
const DoctorPage = lazy(() => import("../../pages/DoctorPage"));
const ClinicPage = lazy(() => import("../../pages/ClinicPage"));
const ArticlesPage = lazy(() => import("../../pages/ArticlesPage"));
const NotFound = lazy(() => import("../notFound/NotFound"));
const ConstructorPage = lazy(() => import("../../pages/ConstructorPage"));

const EnterItem = lazy(() => import( "../enterItem/enterItem"));
const EnterClient = lazy(() => import("../enterClient/EnterClient"));
const RegisterClient = lazy(() => import( "../registerClient/RegisterClient"));
const EnterPartner = lazy(() => import( "../enterPartner/EnterPartner"));
const RegisterDoctor = lazy(() => import( "../registerDoctor/RegisterDoctor"));
const RegisterClinic = lazy(() => import("../registerClinic/RegisterClinic"));
const ForgotPassword = lazy(() => import("../forgotPassword/ForgotPassword"));
const NewPassword = lazy(() => import("../newPassword/newPassword"));
const EnterPage = lazy(() => import("../../pages/EnterPage"));
const AccountPage = lazy(() => import( "../../pages/AccountPage"));
const ArticleDetailedPage = lazy(() => import("../../pages/ArticleDetailedPage"));
const PrivateRoute = lazy(() => import( "../../routes/PrivateRoute"));

function App() {
	return (
		<Suspense fallback={<div></div>}>
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
					<Route path="constructor" element={<ConstructorPage />}></Route>
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
				<Route element={<PrivateRoute />}>
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
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
