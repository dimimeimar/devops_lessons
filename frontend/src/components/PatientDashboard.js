import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, X, Plus } from 'lucide-react';
import BookingModal from './BookingModal';
import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [patientInfo, setPatientInfo] = useState(null);

  const fetchAppointments = useCallback(async (patientId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/patient/${patientId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatientInfo = useCallback(async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/api/patients/username/${username}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404) {
        setPatientInfo(null);
        setAppointments([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPatientInfo(data);
      if (data?.id) {
        fetchAppointments(data.id);
      }
    } catch (err) {
      console.error('Error fetching patient info:', err);
      setError('Error fetching patient information');
      setLoading(false);
    }
  }, [fetchAppointments]);

  useEffect(() => {
    if (user?.username) {
      fetchPatientInfo(user.username);
    }
  }, [user, fetchPatientInfo]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/doctors/available', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleBooking = async (appointmentData) => {
    if (!patientInfo?.id) {
      setError('Patient information not available');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          doctor: appointmentData.doctor,  
          patient: patientInfo,             
          appointmentDate: appointmentData.appointmentDate,
          notes: appointmentData.notes,
          status: appointmentData.status
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchAppointments(patientInfo.id);
      setShowBooking(false);
    } catch (err) {
      setError('Error creating appointment');
      console.error('Error creating appointment:', err);
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      if (patientInfo?.id) {
        fetchAppointments(patientInfo.id);
      }
    } catch (err) {
      setError('Σφάλμα κατά την ακύρωση του ραντεβού');
      console.error('Error canceling appointment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Φόρτωση...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Καλώς ήρθατε {patientInfo ? `${patientInfo.firstName} ${patientInfo.lastName}` : user?.username}
            </h1>
            <button
              onClick={() => setShowBooking(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Νέο Ραντεβού
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Επόμενο Ραντεβού</p>
                  <p className="text-lg font-semibold">
                    {appointments[0]?.appointmentDate
                      ? new Date(appointments[0].appointmentDate).toLocaleString('el-GR')
                      : 'Κανένα'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Συνολικά Ραντεβού</p>
                  <p className="text-lg font-semibold">{appointments.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Τα Ραντεβού μου</h2>

            {appointments.length === 0 ? (
              <p className="text-gray-500">Δεν έχετε κανένα ραντεβού.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ημερομηνία
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Γιατρός
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Κατάσταση
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ενέργειες
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.appointmentDate
                            ? new Date(appointment.appointmentDate).toLocaleString('el-GR')
                            : 'Μη διαθέσιμη ημερομηνία'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.doctor
                            ? `${appointment.doctor.firstName || ''} ${appointment.doctor.lastName || ''}`
                            : 'Μη διαθέσιμος γιατρός'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                            {appointment.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        doctors={doctors}
        onSubmit={handleBooking}
      />
    </div>
  );
};

export default PatientDashboard;