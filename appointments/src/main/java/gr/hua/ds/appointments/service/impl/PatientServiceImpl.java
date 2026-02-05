package gr.hua.ds.appointments.service.impl;

import gr.hua.ds.appointments.entity.Patient;
import gr.hua.ds.appointments.repository.PatientRepository;
import gr.hua.ds.appointments.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public Patient save(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    public Patient findById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    @Override
    public Patient findByEmail(String email) {
        return patientRepository.findByUserEmail(email);
    }
}