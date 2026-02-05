import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [doctorInfo, setDoctorInfo] = useState(null);

  const fetchAppointments = useCallback(async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/doctor/${doctorId}`, {
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

  const fetchDoctorInfo = useCallback(async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/api/doctors/email/${email}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctor info');
      }

      const data = await response.json();
      setDoctorInfo(data);
      if (data?.id) {
        fetchAppointments(data.id);
      }
    } catch (err) {
      console.error('Error fetching doctor info:', err);
      setError('Error fetching doctor information');
      setLoading(false);
    }
  }, [fetchAppointments]);

  useEffect(() => {
    if (user?.email) {
      fetchDoctorInfo(user.email);
    }
  }, [user, fetchDoctorInfo]);

  const handleAppointmentAction = async (appointmentId, status) => {
    try {
      console.log(`Updating appointment ${appointmentId} to status: ${status}`);
      
      const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', errorData);
        throw new Error(errorData.message || 'Failed to update appointment status');
      }

      if (doctorInfo?.id) {
        await fetchAppointments(doctorInfo.id);
      }
    } catch (err) {
      setError('Σφάλμα κατά την ενημέρωση της κατάστασης του ραντεβού');
      console.error('Error:', err);
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
              {doctorInfo ? `Dr. ${doctorInfo.firstName} ${doctorInfo.lastName}` : user?.email}
            </h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                doctorInfo?.available 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {doctorInfo?.available ? 'Διαθέσιμος/η' : 'Μη Διαθέσιμος/η'}
              </span>
            </div>
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
                  <p className="text-sm text-gray-600">Αιτήματα σε Αναμονή</p>
                  <p className="text-lg font-semibold">
                    {appointments.filter(app => app.status === 'PENDING').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Αιτήματα Ραντεβού</h2>

            {appointments.length === 0 ? (
              <p className="text-gray-500">Δεν υπάρχουν αιτήματα ραντεβού.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ημερομηνία
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ασθενής
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Κατάσταση
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Σημειώσεις
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
                          {appointment.patient
                            ? `${appointment.patient.firstName || ''} ${appointment.patient.lastName || ''}`
                            : 'Άγνωστος ασθενής'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                            {appointment.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {appointment.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.status === 'PENDING' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAppointmentAction(appointment.id, 'CONFIRMED')}
                                className="text-green-600 hover:text-green-900"
                                title="Αποδοχή"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleAppointmentAction(appointment.id, 'REJECTED')}
                                className="text-red-600 hover:text-red-900"
                                title="Απόρριψη"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          )}
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
    </div>
  );
};

export default DoctorDashboard;