package gr.hua.ds.appointments.service;

import gr.hua.ds.appointments.entity.Appointment;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    Appointment scheduleAppointment(Appointment appointment);
    Appointment updateStatus(Long id, String status);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDateRange(LocalDateTime start, LocalDateTime end);
    void cancelAppointment(Long id);
}