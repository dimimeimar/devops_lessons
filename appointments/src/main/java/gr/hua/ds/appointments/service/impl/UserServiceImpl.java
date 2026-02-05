package gr.hua.ds.appointments.service.impl;

import gr.hua.ds.appointments.entity.Doctor;
import gr.hua.ds.appointments.entity.Patient;
import gr.hua.ds.appointments.entity.User;
import gr.hua.ds.appointments.repository.DoctorRepository;
import gr.hua.ds.appointments.repository.PatientRepository;
import gr.hua.ds.appointments.repository.UserRepository;
import gr.hua.ds.appointments.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {


    @Autowired
    private UserRepository userRepository;



    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;


    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public User register(User user) {
        User savedUser = userRepository.save(user);

        if ("ROLE_PATIENT".equals(user.getRole())) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setFirstName(user.getUsername());
            patient.setLastName("");
            patientRepository.save(patient);
        } else if ("ROLE_DOCTOR".equals(user.getRole())) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setFirstName(user.getUsername());
            doctor.setLastName("");
            doctor.setSpecialization("Not specified");
            doctor.setAvailable(true);
            doctorRepository.save(doctor);
        }

        return savedUser;
    }

    @Override
    @Transactional
    public User save(User user) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String oldRole = existingUser.getRole();
        String newRole = user.getRole();

        if (!oldRole.equals(newRole)) {
            if ("ROLE_PATIENT".equals(oldRole)) {
                Patient patient = patientRepository.findByUserEmail(existingUser.getEmail());
                if (patient != null) {
                    patientRepository.delete(patient);
                }
            } else if ("ROLE_DOCTOR".equals(oldRole)) {
                Doctor doctor = doctorRepository.findByUserEmail(existingUser.getEmail());
                if (doctor != null) {
                    doctorRepository.delete(doctor);
                }
            }

            if ("ROLE_PATIENT".equals(newRole)) {
                Patient newPatient = new Patient();
                newPatient.setUser(existingUser);
                newPatient.setFirstName(existingUser.getUsername());
                newPatient.setLastName("");
                patientRepository.save(newPatient);
            } else if ("ROLE_DOCTOR".equals(newRole)) {
                Doctor newDoctor = new Doctor();
                newDoctor.setUser(existingUser);
                newDoctor.setFirstName(existingUser.getUsername());
                newDoctor.setLastName("");
                newDoctor.setSpecialization("Not specified");
                newDoctor.setAvailable(true);
                doctorRepository.save(newDoctor);
            }
        }

        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(newRole);
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(user.getPassword());
        }

        return userRepository.save(existingUser);
    }

}