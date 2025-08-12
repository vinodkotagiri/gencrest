import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Visits from "./Visits";

import LiquidationTracker from "./LiquidationTracker";

import DistributorDetails from "./DistributorDetails";

import Liquidation from "./Liquidation";

import Tasks from "./Tasks";

import RetailerDetails from "./RetailerDetails";

import MonthlyPlanning from "./MonthlyPlanning";

import Contacts from "./Contacts";

import Team from "./Team";

import Orders from "./Orders";

import Reports from "./Reports";

import RouteMapping from "./RouteMapping";

import AgeingAnalysis from "./AgeingAnalysis";

import Analytics from "./Analytics";

import AskGency from "./AskGency";

import AlertsExceptions from "./AlertsExceptions";

import SuperAdminUsers from "./SuperAdminUsers";

//import FreeLocationOptions from "./FreeLocationOptions";

import PredefinedLocations from "./PredefinedLocations";

import MobileAppDesign from "./MobileAppDesign";

import MobileDeveloperDocs from "./MobileDeveloperDocs";

import FinanceDashboard from "./FinanceDashboard";

import CredibilityIndex from "./CredibilityIndex";

import ProfitabilityReport from "./ProfitabilityReport";

import DataUpload from "./DataUpload";

import AnnualTargets from "./AnnualTargets";

import TechnicalDocumentation from "./TechnicalDocumentation";

import MobilePreview from "./MobilePreview";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {

    Dashboard: Dashboard,

    Visits: Visits,

    LiquidationTracker: LiquidationTracker,

    DistributorDetails: DistributorDetails,

    Liquidation: Liquidation,

    Tasks: Tasks,

    RetailerDetails: RetailerDetails,

    MonthlyPlanning: MonthlyPlanning,

    Contacts: Contacts,

    Team: Team,

    Orders: Orders,

    Reports: Reports,

    RouteMapping: RouteMapping,

    AgeingAnalysis: AgeingAnalysis,

    Analytics: Analytics,

    AskGency: AskGency,

    AlertsExceptions: AlertsExceptions,

    SuperAdminUsers: SuperAdminUsers,

    //FreeLocationOptions: FreeLocationOptions,

    PredefinedLocations: PredefinedLocations,

    MobileAppDesign: MobileAppDesign,

    MobileDeveloperDocs: MobileDeveloperDocs,

    FinanceDashboard: FinanceDashboard,

    CredibilityIndex: CredibilityIndex,

    ProfitabilityReport: ProfitabilityReport,

    DataUpload: DataUpload,

    AnnualTargets: AnnualTargets,

    TechnicalDocumentation: TechnicalDocumentation,

    MobilePreview: MobilePreview,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Layout currentPageName={currentPage}>
            <Routes>

                <Route path="/" element={<Dashboard />} />


                <Route path="/Dashboard" element={<Dashboard />} />

                <Route path="/Visits" element={<Visits />} />

                <Route path="/LiquidationTracker" element={<LiquidationTracker />} />

                <Route path="/DistributorDetails" element={<DistributorDetails />} />

                <Route path="/Liquidation" element={<Liquidation />} />

                <Route path="/Tasks" element={<Tasks />} />

                <Route path="/RetailerDetails" element={<RetailerDetails />} />

                <Route path="/MonthlyPlanning" element={<MonthlyPlanning />} />

                <Route path="/Contacts" element={<Contacts />} />

                <Route path="/Team" element={<Team />} />

                <Route path="/Orders" element={<Orders />} />

                <Route path="/Reports" element={<Reports />} />

                <Route path="/RouteMapping" element={<RouteMapping />} />

                <Route path="/AgeingAnalysis" element={<AgeingAnalysis />} />

                <Route path="/Analytics" element={<Analytics />} />

                <Route path="/AskGency" element={<AskGency />} />

                <Route path="/AlertsExceptions" element={<AlertsExceptions />} />

                <Route path="/SuperAdminUsers" element={<SuperAdminUsers />} />

                {/*<Route path="/FreeLocationOptions" element={<FreeLocationOptions />} />*/}

                <Route path="/PredefinedLocations" element={<PredefinedLocations />} />

                <Route path="/MobileAppDesign" element={<MobileAppDesign />} />

                <Route path="/MobileDeveloperDocs" element={<MobileDeveloperDocs />} />

                <Route path="/FinanceDashboard" element={<FinanceDashboard />} />

                <Route path="/CredibilityIndex" element={<CredibilityIndex />} />

                <Route path="/ProfitabilityReport" element={<ProfitabilityReport />} />

                <Route path="/DataUpload" element={<DataUpload />} />

                <Route path="/AnnualTargets" element={<AnnualTargets />} />

                <Route path="/TechnicalDocumentation" element={<TechnicalDocumentation />} />

                <Route path="/MobilePreview" element={<MobilePreview />} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}