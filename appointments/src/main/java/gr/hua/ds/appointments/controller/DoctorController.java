package gr.hua.ds.appointments.controller;

import gr.hua.ds.appointments.entity.Doctor;
import gr.hua.ds.appointments.entity.User;
import gr.hua.ds.appointments.service.DoctorService;
import gr.hua.ds.appointments.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.save(doctor));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> findById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.findById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.findAll());
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> findBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(doctorService.findBySpecialization(specialization));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Doctor> findByEmail(@PathVariable String email) {
        try {
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            Doctor doctor = doctorService.findByEmail(email);
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Doctor>> findAvailableDoctors() {
        return ResponseEntity.ok(doctorService.findAvailableDoctors());
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Void> updateAvailability(@PathVariable Long id, @RequestParam boolean available) {
        doctorService.updateAvailability(id, available);
        return ResponseEntity.ok().build();
    }
}