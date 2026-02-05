package gr.hua.ds.appointments.service;

public interface EmailService {
    void sendAppointmentConfirmation(String to , String patientName,String doctorName, String appointDate);
    void sendAppointmentStatusUpdate(String to , String patientName, String status , String appointmentDate);
}
