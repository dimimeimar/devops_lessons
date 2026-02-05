package gr.hua.ds.appointments.service.impl;

import gr.hua.ds.appointments.entity.Doctor;
import gr.hua.ds.appointments.repository.DoctorRepository;
import gr.hua.ds.appointments.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public Doctor save(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public Doctor findById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    @Override
    public List<Doctor> findBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    @Override
    public Doctor findByEmail(String email) {
        return doctorRepository.findByUserEmail(email);
    }

    @Override
    public List<Doctor> findAll() {
        return doctorRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public List<Doctor> findAvailableDoctors() {
        return doctorRepository.findByAvailable(true);
    }

    @Override
    public void updateAvailability(Long id, boolean available) {
        Doctor doctor = findById(id);
        doctor.setAvailable(available);
        doctorRepository.save(doctor);
    }
}