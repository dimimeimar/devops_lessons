package gr.hua.ds.appointments.service.impl;

import gr.hua.ds.appointments.entity.Appointment;
import gr.hua.ds.appointments.entity.Doctor;
import gr.hua.ds.appointments.entity.Patient;
import gr.hua.ds.appointments.repository.AppointmentRepository;
import gr.hua.ds.appointments.service.AppointmentService;
import gr.hua.ds.appointments.service.DoctorService;
import gr.hua.ds.appointments.service.EmailService;
import gr.hua.ds.appointments.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private EmailService emailService;

    @Override
    public Appointment scheduleAppointment(Appointment appointment) {
        Appointment saved = appointmentRepository.save(appointment);

        try {
            String patientEmail = saved.getPatient().getUser().getEmail();
            String patientName = saved.getPatient().getFirstName() + " " + saved.getPatient().getLastName();
            String doctorName = saved.getDoctor().getFirstName() + " " + saved.getDoctor().getLastName();
            String appointmentDate = saved.getAppointmentDate().toString();

            emailService.sendAppointmentConfirmation(patientEmail, patientName, doctorName, appointmentDate);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }

        return saved;
    }

    @Override
    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        Appointment updated = appointmentRepository.save(appointment);

        try {
            String patientEmail = updated.getPatient().getUser().getEmail();
            String patientName = updated.getPatient().getFirstName() + " " + updated.getPatient().getLastName();
            String appointmentDate = updated.getAppointmentDate().toString();

            emailService.sendAppointmentStatusUpdate(patientEmail,patientName,status,appointmentDate);
        } catch (Exception e) {
            System.err.println("Failed to send email : "+ e.getMessage());
            e.printStackTrace();
        }

        return updated;
    }

    @Override
    public List<Appointment> findByDoctorId(Long doctorId) {
        Doctor doctor = doctorService.findById(doctorId);
        return appointmentRepository.findByDoctor(doctor);
    }

    @Override
    public List<Appointment> findByPatientId(Long patientId) {
        Patient patient = patientService.findById(patientId);
        return appointmentRepository.findByPatient(patient);
    }

    @Override
    public List<Appointment> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateBetween(start, end);
    }

    @Override
    public void cancelAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}