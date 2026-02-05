package gr.hua.ds.appointments.repository;

import gr.hua.ds.appointments.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByAvailable(boolean available);
    Doctor findByUserEmail(String email);
}