import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/doctors/available', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data);
      
      // Extract unique specializations
      const uniqueSpecs = [...new Set(data.map(doctor => doctor.specialization))];
      setSpecializations(uniqueSpecs);
    } catch (err) {
      setError('Error fetching doctors');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = (
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesSpecialization = !selectedSpecialization || 
      doctor.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

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
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Λίστα Ιατρών</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Αναζήτηση με όνομα ή ειδικότητα..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">Όλες οι ειδικότητες</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                Δεν βρέθηκαν ιατροί με τα συγκεκριμένα κριτήρια.
              </div>
            ) : (
              filteredDoctors.map(doctor => (
                <div key={doctor.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto bg-blue-100 rounded-full mb-4">
                    <span className="text-2xl text-blue-600 font-semibold">
                      {`${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                    {`${doctor.firstName || ''} ${doctor.lastName || ''}`}
                  </h3>
                  
                  <p className="text-center text-blue-600 font-medium mb-4">
                    {doctor.specialization || 'Ειδικότητα μη διαθέσιμη'}
                  </p>

                  <div className="flex justify-center">
                    <span className={`px-4 py-1 text-sm rounded-full ${
                      doctor.available 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doctor.available ? 'Διαθέσιμος' : 'Μη διαθέσιμος'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;