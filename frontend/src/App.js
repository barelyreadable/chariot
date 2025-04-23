import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Login from './components/Login';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import DriverSetup from './components/DriverSetup';
import RiderBooking from './components/RiderBooking';
import Profile from './components/Profile';
import CoRiders from './components/CoRiders';
import DriverCarpoolList from './components/DriverCarpoolList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/events/new" element={
            <ProtectedRoute roles={['admin']}><EventForm /></ProtectedRoute>
          } />
          <Route path="/events/:id/edit" element={
            <ProtectedRoute roles={['admin']}><EventForm /></ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute roles={['admin']}><EventList /></ProtectedRoute>
          } />

          <Route path="/driver-setup" element={
            <ProtectedRoute roles={['driver']}><DriverSetup /></ProtectedRoute>
          } />
          <Route path="/my-carpool/:eventId" element={
            <ProtectedRoute roles={['driver']}><DriverCarpoolList /></ProtectedRoute>
          } />

          <Route path="/book" element={
            <ProtectedRoute roles={['rider']}><RiderBooking /></ProtectedRoute>
          } />
          <Route path="/coriders/:eventId" element={
            <ProtectedRoute roles={['rider']}><CoRiders /></ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute roles={['admin','driver','rider']}><Profile /></ProtectedRoute>
          } />

          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
