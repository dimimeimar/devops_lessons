package gr.hua.ds.appointments.controller;

import gr.hua.ds.appointments.entity.Appointment;
import gr.hua.ds.appointments.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Appointment> scheduleAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment savedAppointment = appointmentService.scheduleAppointment(appointment);
            return ResponseEntity.ok(savedAppointment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> findByPatientId(@PathVariable Long patientId) {
        try {
            List<Appointment> appointments = appointmentService.findByPatientId(patientId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            System.out.println("Updating appointment " + id + " to status: " + status);
            Appointment updated = appointmentService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating appointment status: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> findByDoctorId(@PathVariable Long doctorId) {
        try {
            List<Appointment> appointments = appointmentService.findByDoctorId(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }



    @GetMapping("/date-range")
    public ResponseEntity<List<Appointment>> findByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(appointmentService.findByDateRange(start, end));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.ok().build();
    }
}