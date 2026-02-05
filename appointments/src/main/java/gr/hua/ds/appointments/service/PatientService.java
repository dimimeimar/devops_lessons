package gr.hua.ds.appointments.service;

import gr.hua.ds.appointments.entity.Patient;

public interface PatientService {
    Patient save(Patient patient);
    Patient findById(Long id);
    Patient findByEmail(String email);
}