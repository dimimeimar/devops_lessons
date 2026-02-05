package gr.hua.ds.appointments.service;

import gr.hua.ds.appointments.entity.Doctor;

import java.util.List;

public interface DoctorService {
    Doctor save(Doctor doctor);
    Doctor findById(Long id);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findAvailableDoctors();
    List<Doctor> findAll();
    Doctor findByEmail(String email);
    void updateAvailability(Long id, boolean available);
    void deleteById(Long id);
}