package gr.hua.ds.appointments.repository;

import gr.hua.ds.appointments.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByUserEmail(String email);
}