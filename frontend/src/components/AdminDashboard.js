import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewDoctorForm, setShowNewDoctorForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [newDoctorData, setNewDoctorData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    username: '',
    email: '',
    password: '',
    role: 'ROLE_DOCTOR'
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 403) {
        navigate('/login');
      }
    } catch (err) {
      setError('Error fetching users');
      console.error('Error:', err);
    }
  }, [navigate]);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/doctors/all', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (err) {
      setError('Error fetching doctors');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

 

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchDoctors()]);
    };
    fetchData();
  }, [user, navigate, fetchUsers, fetchDoctors]);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: newDoctorData.username,
          email: newDoctorData.email,
          password: newDoctorData.password,
          role: 'ROLE_DOCTOR'
        })
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        setError(errorData.message || 'Error creating user');
        return;
      }

      const userData = await userResponse.json();
      console.log('User created:', userData);

      const doctorResponse = await fetch('http://localhost:8080/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          user: { id: userData.id },
          firstName: newDoctorData.firstName,
          lastName: newDoctorData.lastName,
          specialization: newDoctorData.specialization,
          available: true
        })
      });

      if (doctorResponse.ok) {
        setShowNewDoctorForm(false);
        setNewDoctorData({
          firstName: '',
          lastName: '',
          specialization: '',
          username: '',
          email: '',
          password: '',
          role: 'ROLE_DOCTOR'
        });
        fetchDoctors();
      } else {
        const errorData = await doctorResponse.json();
        setError(errorData.message || 'Error creating doctor profile');
        
        await fetch(`http://localhost:8080/api/users/${userData.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
      }
    } catch (err) {
      setError('Error creating doctor');
      console.error('Error:', err);
    }
  };

  const handleUpdateUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: editingUser.username,
          email: editingUser.email,
          role: editingUser.role
        })
      });

      if (response.ok) {
        setEditingUser(null);
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error updating user');
      }
    } catch (err) {
      setError('Error updating user');
      console.error('Error:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          fetchUsers();
        }
      } catch (err) {
        setError('Error deleting user');
        console.error('Error:', err);
      }
    }
  };

  const handleToggleAvailability = async (doctorId, currentAvailability) => {
    try {
      const response = await fetch(`http://localhost:8080/api/doctors/${doctorId}/availability?available=${!currentAvailability}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        fetchDoctors();
      }
    } catch (err) {
      setError('Error updating doctor availability');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Συστήματος</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ιατροί</h2>
              <button
                onClick={() => setShowNewDoctorForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Νέος Ιατρός
              </button>
            </div>

            {showNewDoctorForm && (
              <form onSubmit={handleCreateDoctor} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Όνομα"
                    className="rounded-md border-gray-300"
                    value={newDoctorData.firstName}
                    onChange={(e) => setNewDoctorData({...newDoctorData, firstName: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Επώνυμο"
                    className="rounded-md border-gray-300"
                    value={newDoctorData.lastName}
                    onChange={(e) => setNewDoctorData({...newDoctorData, lastName: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ειδικότητα"
                    className="rounded-md border-gray-300"
                    value={newDoctorData.specialization}
                    onChange={(e) => setNewDoctorData({...newDoctorData, specialization: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    className="rounded-md border-gray-300"
                    value={newDoctorData.username}
                    onChange={(e) => setNewDoctorData({...newDoctorData, username: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="rounded-md border-gray-300"
                    value={newDoctorData.email}
                    onChange={(e) => setNewDoctorData({...newDoctorData, email: e.target.value})}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="rounded-md border-gray-300"
                    value={newDoctorData.password}
                    onChange={(e) => setNewDoctorData({...newDoctorData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewDoctorForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Ακύρωση
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Δημιουργία
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Όνομα</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ειδικότητα</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Κατάσταση</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ενέργειες</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.firstName} {doctor.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{doctor.specialization}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{doctor.user?.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer
                            ${doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          onClick={() => handleToggleAvailability(doctor.id, doctor.available)}
                        >
                          {doctor.available ? 'Διαθέσιμος' : 'Μη διαθέσιμος'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUser(doctor.user?.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Χρήστες</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ρόλος</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ενέργειες</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser?.id === user.id ? (
                          <input
                            type="text"
                            value={editingUser.username}
                            onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                            className="rounded-md border-gray-300"/>
                          ) : (
                            user.username
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser?.id === user.id ? (
                            <input
                              type="email"
                              value={editingUser.email}
                              onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                              className="rounded-md border-gray-300"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser?.id === user.id ? (
                            <select
                              value={editingUser.role}
                              onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                              className="rounded-md border-gray-300"
                            >
                              <option value="ROLE_ADMIN">Admin</option>
                              <option value="ROLE_DOCTOR">Doctor</option>
                              <option value="ROLE_PATIENT">Patient</option>
                            </select>
                          ) : (
                            user.role
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser?.id === user.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUpdateUser(user.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Save"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingUser(null)}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;