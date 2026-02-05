package gr.hua.ds.appointments.controller;

import gr.hua.ds.appointments.entity.Patient;
import gr.hua.ds.appointments.entity.User;
import gr.hua.ds.appointments.service.PatientService;
import gr.hua.ds.appointments.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserService userService;


    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        try {
            Patient savedPatient = patientService.save(patient);
            return ResponseEntity.ok(savedPatient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> findById(@PathVariable Long id) {
        try {
            Patient patient = patientService.findById(id);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Patient> findByEmail(@PathVariable String email) {
        try {
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            Patient patient = patientService.findByEmail(email);
            if (patient == null) {
                Patient newPatient = new Patient();
                newPatient.setUser(user);
                newPatient.setFirstName(user.getUsername());
                newPatient.setLastName("");
                patient = patientService.save(newPatient);
            }
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<Patient> findByUsername(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            Patient patient = patientService.findByEmail(user.getEmail());
            if (patient == null) {
                Patient newPatient = new Patient();
                newPatient.setUser(user);
                newPatient.setFirstName(user.getUsername());
                newPatient.setLastName("");
                patient = patientService.save(newPatient);
            }
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}