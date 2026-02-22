/* eslint-disable react/prop-types */
import { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PlayMeetLoader from './components/Loader';
import { useAuth } from '@/hooks/useAuth';
import { useMetadata } from '@/hooks/useMetadata';
import { ModeProvider, useMode } from '@/context/ModeContext';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
import ScrollToTop from '@/components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import Events from './pages/event/Events';
import EventDetails from './pages/event/EventDetails';
import PublicProfile from './pages/PublicProfile';
import GlobalSearch from './pages/GlobalSearch';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import Help from './pages/public/Help';
import NotFound from './pages/NotFound';
import Venues from './pages/venues/Venues';
import VenueDetails from './pages/venues/VenueDetails';
import VenueBooking from './pages/venues/VenueBooking';
import MyBookings from './pages/venues/MyBookings';
import Leaderboard from './pages/leaderboard/Leaderboard';
import Store from './pages/Store';
// import Community from './pages/community/Community';
import Athletes from './pages/athletes/Athletes';
// Esports Pages
import Esports from './pages/esports/Esports';

import EsportsGames from './pages/esports/EsportsGames';
import EsportsPlayers from './pages/esports/EsportsPlayers';
import EsportsCommunity from './pages/esports/ServerDiscovery';
import EsportsHome from './pages/esports/EsportsHome';
import EsportsDashboard from './pages/esports/EsportsDashboard';
import TournamentBrowser from './pages/esports/TournamentBrowser';
import CreateTournament from './pages/esports/CreateTournament';
import TournamentLobby from './pages/esports/TournamentLobby';
import HostManager from './pages/esports/HostManager';
import { EsportsProvider } from './context/EsportsContext';
import EsportsLayout from './pages/esports/EsportsLayout';

// Protected User Pages
import ModeSelection from './pages/ModeSelection';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateEvent from './pages/event/CreateEvent';
import EditEvent from './pages/event/EditEvent';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import EventChat from './pages/event/EventChat';
import TeamManagement from './pages/TeamManagement';
import FollowersFollowing from './pages/FollowerFollowing';
// import MyEvents from './pages/MyEvents';
// import Bookmarks from './pages/Bookmarks';
// import Community from './pages/community/Community';
import Communities from './pages/community/Communities';
import CreateCommunity from './pages/community/CreateCommunity';
import EditCommunity from './pages/community/EditCommunity';
import CommunityDetails from './pages/community/CommunityDetails';
import ManageCommunity from './pages/community/ManageCommunity';
import PostDetail from './pages/community/PostDetail';
// import CreateVenue from './pages/venue/CreateVenue';
// import EditVenue from './pages/venue/EditVenue';
// import UserProfile from './pages/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageEvents from './pages/admin/ManageEvents';
import ManageCommunities from './pages/admin/ManageCommunities';
import AdminVenues from './pages/admin/AdminVenues';
import CreateVenue from './pages/admin/CreateVenue';
import EditVenue from './pages/admin/EditVenue';
import VenueBookings from './pages/admin/VenueBookings';
import AllVenueBookings from './pages/admin/AllVenueBookings';
import AdminSearch from './pages/admin/AdminSearch';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
import NotificationsPage from './pages/admin/NotificationPage';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import Fulfillment from './pages/admin/Fulfillment';
// import AdminReports from './pages/admin/AdminReports';
// import ContentModeration from './pages/admin/ContentModeration';
// import SystemLogs from './pages/admin/SystemLogs';

// Error Boundary Component
import ErrorBoundary from './components/ErrorBoundary';

// Loading Component with page-specific messages
const PageLoader = ({ message = "Loading amazing sports events..." }) => (
  <div className="fixed inset-0 z-50">
    <PlayMeetLoader message={message} />
  </div>
);

// Enhanced Protected Route with loading states and Mode enforcement
const ProtectedRoute = ({ children, adminOnly = false, title = "", data = {}, requiredMode = null }) => {
  const { user, loading } = useAuth();
  const { mode } = useMode();
  const location = useLocation();

  // Use metadata hook for dynamic meta tags
  useMetadata(data);

  if (loading) {
    return <PageLoader message={`Loading ${title || 'page'}...`} />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is logged in but hasn't selected a mode, redirect to mode selection
  // Unless we are already on the mode selection page
  if (!mode && location.pathname !== '/mode-selection' && !adminOnly) {
    return <Navigate to="/mode-selection" replace />;
  }

  // If a specific mode is required for this route (e.g., only 'athletes' or only 'esports')
  if (requiredMode && mode !== requiredMode && !adminOnly) {
    // Redirect to the dashboard of the current mode or back to mode selection
    return <Navigate to={mode === 'esports' ? "/esports" : (mode === 'athletes' ? "/home" : "/mode-selection")} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={<PageLoader message={`Loading ${title || 'content'}...`} />}>
      {children}
    </Suspense>
  );
};

// Public Route wrapper with loading
const PublicRoute = ({ children, title = "", data = {} }) => {
  // Use metadata hook for dynamic meta tags
  useMetadata(data);

  return (
    <Suspense fallback={<PageLoader message={`Loading ${title || 'page'}...`} />}>
      {children}
    </Suspense>
  );
};

// Main App Component Content (inner component to use Mode Context)
const AppContent = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  // Show initial loader while auth is being checked
  if (authLoading) {
    return <PageLoader message="Initializing PLAYMEET..." />;
  }

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <ScrollToTop />
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

          {/* Mode Selection - Protected but doesn't require specific mode */}
          <Route path="mode-selection" element={<ProtectedRoute><ModeSelection /></ProtectedRoute>} />

          <Route path="/" element={<Layout />}>
            {/* If logged in, go to mode selection or dashboard, otherwise home */}
            <Route index element={
              user ? <Navigate to="/mode-selection" replace /> : <PublicRoute><Home /></PublicRoute>
            } />

            <Route path="about" element={<PublicRoute><About /></PublicRoute>} />
            <Route path="home" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="contact" element={<PublicRoute><Contact /></PublicRoute>} />
            <Route path="privacy" element={<PublicRoute><Privacy /></PublicRoute>} />
            <Route path="terms" element={<PublicRoute><Terms /></PublicRoute>} />
            <Route path="help" element={<PublicRoute><Help /></PublicRoute>} />



            {/* SHARED Protected Routes (accessible in both modes) */}
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="profile/:userId" element={<PublicRoute><PublicProfile /></PublicRoute>} />
            <Route path="search" element={<PublicRoute><GlobalSearch /></PublicRoute>} />

            {/* --- PHYSICAL SPORTS MODE ROUTES --- */}
            {/* These could technically be restricted by requiredMode='athletes' ifstrict separation is desired */}
            <Route path="events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
            <Route path="events/create" element={<ProtectedRoute requiredMode="athletes"><CreateEvent /></ProtectedRoute>} />
            <Route path="events/:id/edit" element={<ProtectedRoute requiredMode="athletes"><EditEvent /></ProtectedRoute>} />
            <Route path="chat/:eventId" element={<ProtectedRoute><EventChat /></ProtectedRoute>} />
            <Route path="events/:eventId/teams" element={<ProtectedRoute requiredMode="athletes"><TeamManagement /></ProtectedRoute>} />
            <Route path="events/:eventId/teams/:teamId" element={<ProtectedRoute requiredMode="athletes"><TeamManagement /></ProtectedRoute>} />

            <Route path="venues" element={<ProtectedRoute><Venues /></ProtectedRoute>} />
            <Route path="venues/:id" element={<ProtectedRoute><VenueDetails /></ProtectedRoute>} />
            <Route path="venues/:id/book" element={<ProtectedRoute requiredMode="athletes"><VenueBooking /></ProtectedRoute>} />
            <Route path="my-bookings" element={<ProtectedRoute requiredMode="athletes"><MyBookings /></ProtectedRoute>} />

            <Route path="athletes" element={<ProtectedRoute><Athletes /></ProtectedRoute>} />
            <Route path="leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="store" element={<ProtectedRoute><Store /></ProtectedRoute>} />

            <Route path="community" element={<ProtectedRoute><Communities /></ProtectedRoute>} />
            <Route path="community/:id" element={<ProtectedRoute><CommunityDetails /></ProtectedRoute>} />
            <Route path="community/post/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
            <Route path="community/create" element={<ProtectedRoute><CreateCommunity /></ProtectedRoute>} />
            <Route path="community/:id/edit" element={<ProtectedRoute><EditCommunity /></ProtectedRoute>} />
            <Route path="community/:id/manage" element={<ProtectedRoute><ManageCommunity /></ProtectedRoute>} />

            <Route path="users/:id/followers" element={<ProtectedRoute><FollowersFollowing type="followers" /></ProtectedRoute>} />
            <Route path="users/:id/following" element={<ProtectedRoute><FollowersFollowing type="following" /></ProtectedRoute>} />
            <Route path="venues/:id/edit" element={<ProtectedRoute><EditVenue /></ProtectedRoute>} />


            {/* --- ESPORTS MODE ROUTES --- */}
            <Route path="esports" element={<ProtectedRoute requiredMode="esports"><EsportsProvider><EsportsLayout /></EsportsProvider></ProtectedRoute>}>
              <Route index element={<EsportsHome />} />
              <Route path="dashboard" element={<EsportsDashboard />} />
              <Route path="tournaments" element={<TournamentBrowser />} />
              <Route path="tournaments/:id/lobby" element={<TournamentLobby />} />
              <Route path="tournaments/create" element={<CreateTournament />} />
              <Route path="tournaments/:id/manage" element={<HostManager />} />
              <Route path="gamers" element={<Esports />} />
              <Route path="games" element={<EsportsGames />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="scrims" element={<div className="text-white p-8">Scrims Page Coming Soon</div>} />
              <Route path="teams" element={<div className="text-white p-8">My Teams Page Coming Soon</div>} />
            </Route>
            <Route path="esports/players" element={<ProtectedRoute requiredMode="esports"><EsportsProvider><EsportsPlayers /></EsportsProvider></ProtectedRoute>} />
            <Route path="esports/community" element={<ProtectedRoute requiredMode="esports"><EsportsProvider><EsportsCommunity /></EsportsProvider></ProtectedRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
            <Route path="events" element={<ProtectedRoute adminOnly><ManageEvents /></ProtectedRoute>} />
            <Route path="communities" element={<ProtectedRoute adminOnly><ManageCommunities /></ProtectedRoute>} />
            <Route path="venues" element={<ProtectedRoute adminOnly><AdminVenues /></ProtectedRoute>} />
            <Route path="venues/:id/bookings" element={<ProtectedRoute adminOnly><VenueBookings /></ProtectedRoute>} />
            <Route path="venue-bookings" element={<ProtectedRoute adminOnly><AllVenueBookings /></ProtectedRoute>} />
            <Route path="create-venue" element={<ProtectedRoute adminOnly><CreateVenue /></ProtectedRoute>} />
            <Route path="edit-venue/:id" element={<ProtectedRoute adminOnly><EditVenue /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute adminOnly><NotificationsPage /></ProtectedRoute>} />
            <Route path="search" element={<ProtectedRoute adminOnly><AdminSearch /></ProtectedRoute>} />
            <Route path="messages" element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
            <Route path="fulfillment" element={<ProtectedRoute adminOnly><Fulfillment /></ProtectedRoute>} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<PublicRoute><NotFound /></PublicRoute>} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <ModeProvider>
      <AppContent />
    </ModeProvider>
  );
}

export default App;
