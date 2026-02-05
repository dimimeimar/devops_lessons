package gr.hua.ds.appointments.service.impl;

import gr.hua.ds.appointments.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendAppointmentConfirmation(String to, String patientName, String doctorName, String appointDate) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Νέο ραντεβού επιβεβαίωση");
        message.setText(
                String.format(
                        "Αγαπητέ %s,\n\n" +
                        "Το ραντεβού σας με τον/την Dr. %s έχει καταχωρηθεί επιτυχώς.\n" +
                        "Ημερομηνία : %s " +
                        "Θα ενημερωθείτε όταν ο γιατρός επιβεβαιώσει το ραντεβού.\n" +
                        "Ευχαριστούμε,\nAppointments system",
                        patientName, doctorName, appointDate
                )
        );
        message.setFrom("appointmentssystem2025@gmail.com");

        mailSender.send(message);
    }

    @Override
    public void sendAppointmentStatusUpdate(String to, String patientName, String status, String appointmentDate) {
        String statusText = status.equals("CONFIRMED") ? "επιβεβαιώθηκε" : "απορρίφθηκε";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Ενημέρωση ραντεβού");
        message.setText(String.format(
                "Αγαπητέ %s, Το ραντεβού σας για την %s %s.\n" +
                "Ευχαριστούμε,\nΗ ομάδα του Appointments system",
                patientName,appointmentDate,statusText
        ));
        message.setFrom("appointmentssystem2025@gmail.com");
        mailSender.send(message);
    }

}
