package gr.hua.ds.appointments.repository;

import gr.hua.ds.appointments.entity.Appointment;
import gr.hua.ds.appointments.entity.Doctor;
import gr.hua.ds.appointments.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByAppointmentDateBetween(LocalDateTime start, LocalDateTime end);
    List<Appointment> findByStatus(String status);
}