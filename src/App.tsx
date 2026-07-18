import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewPage } from './pages/app/OverviewPage';
import { IntelligencePage } from './pages/app/IntelligencePage';
import { CopilotPage } from './pages/app/CopilotPage';
import { ExecutivePage } from './pages/app/ExecutivePage';
import { CitizenPage } from './pages/app/CitizenPage';
import { HealthPage } from './pages/app/HealthPage';
import { AnalyticsPage } from './pages/app/AnalyticsPage';
import { ReportsPage } from './pages/app/ReportsPage';
import { MapPage } from './pages/app/MapPage';
import { AdminPage } from './pages/app/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <Sidebar>
              <OverviewPage />
            </Sidebar>
          }
        />
        <Route
          path="/app/intelligence"
          element={
            <Sidebar>
              <IntelligencePage />
            </Sidebar>
          }
        />
        <Route
          path="/app/copilot"
          element={
            <Sidebar>
              <CopilotPage />
            </Sidebar>
          }
        />
        <Route
          path="/app/executive"
          element={
            <Sidebar>
              <ExecutivePage />
            </Sidebar>
          }
        />
        <Route
          path="/app/citizen"
          element={
            <Sidebar>
              <CitizenPage />
            </Sidebar>
          }
        />
        <Route
          path="/app/health"
          element={
            <Sidebar>
              <HealthPage />
            </Sidebar>
          }
        />
        <Route
          path="/app/analytics"
          element={
            <Sidebar>
              <AnalyticsPage />
            </Sidebar>
          }
        />
        <Route
          path="/app/reports"
          element={
            <Sidebar>
              <ReportsPage />
            </Sidebar>
          }
        />
        <Route
          path="/app/map"
          element={
            <Sidebar>
              <MapPage />
            </Sidebar>
          }
        />
        <Route
          path="/app/admin"
          element={
            <Sidebar>
              <AdminPage />
            </Sidebar>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
