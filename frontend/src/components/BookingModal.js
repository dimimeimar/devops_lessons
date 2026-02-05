import React, { useState } from 'react';
import { X } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, doctors, onSubmit }) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));
    if (!selectedDoctor) {
      console.error('No doctor selected');
      return;
    }

    onSubmit({
      doctor: selectedDoctor,
      appointmentDate: formData.appointmentDate,
      notes: formData.notes,
      status: 'PENDING'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Νέο Ραντεβού</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Επιλέξτε Γιατρό
            </label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Επιλέξτε Γιατρό</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {`${doctor.firstName || ''} ${doctor.lastName || ''} ${doctor.specialization ? `- ${doctor.specialization}` : ''}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ημερομηνία και Ώρα
            </label>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Σημειώσεις
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Προαιρετικές σημειώσεις..."
            />
          </div>

          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ακύρωση
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Κλείσιμο Ραντεβού
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;