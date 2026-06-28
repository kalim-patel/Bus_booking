import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BusResults from "./pages/BusResults.jsx";
import Booking from "./pages/Booking.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import FAQ from "./pages/FAQ.jsx";
import Support from "./pages/Support.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx";
import NotFound from "./pages/NotFound.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import { PrivateRoute } from "./routes/PrivateRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/support" element={<Support />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/bus-results"
        element={
          <PrivateRoute>
            <BusResults />
          </PrivateRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      />
      <Route
        path="/booking-success"
        element={
          <PrivateRoute>
            <BookingSuccess />
          </PrivateRoute>
        }
      />
      <Route
        path="/ticket/:id"
        element={
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
