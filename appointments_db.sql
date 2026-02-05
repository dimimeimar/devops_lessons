-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 04, 2025 at 08:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointments_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) NOT NULL,
  `doctor_id` bigint(20) DEFAULT NULL,
  `patient_id` bigint(20) DEFAULT NULL,
  `appointment_date` datetime NOT NULL,
  `status` varchar(255) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `doctor_id`, `patient_id`, `appointment_date`, `status`, `notes`, `created_at`) VALUES
(6, 4, 1, '2025-02-14 19:42:00', 'CONFIRMED', 'asdasd', '2025-02-03 17:42:26'),
(7, 5, 1, '2025-02-14 20:01:00', 'CONFIRMED', 'βοηθεια', '2025-02-03 18:02:05'),
(8, 5, 1, '2025-02-22 20:01:00', 'REJECTED', 'βοηθεια', '2025-02-03 18:02:12'),
(9, 4, 3, '2025-02-07 09:38:00', 'PENDING', 'asd', '2025-02-04 07:38:52'),
(11, 5, 3, '2025-02-07 09:38:00', 'PENDING', 'asddd', '2025-02-04 07:39:08'),
(12, 8, 3, '2025-02-07 09:38:00', 'PENDING', 'asddd', '2025-02-04 07:39:14'),
(13, 6, 3, '2025-02-06 09:43:00', 'PENDING', 'aaa', '2025-02-04 07:43:26'),
(14, 6, 3, '2025-02-09 09:43:00', 'PENDING', 'aaa', '2025-02-04 07:43:34'),
(15, 6, 4, '2025-02-05 09:45:00', 'CONFIRMED', 'Hello dr mike', '2025-02-04 07:45:32');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `user_id`, `first_name`, `last_name`, `specialization`, `available`) VALUES
(4, 7, 'makis', 'makopoulos', 'eidikos giatros', 1),
(5, 8, 'Κωνσταντίνος', 'Κατακουζινός', 'Βυζαντινολόγος', 1),
(6, 10, 'drmike', 'giatropoulos', 'cardiologist', 1),
(7, 11, 'drHelen', 'drHelen', 'cardiologist', 1),
(8, 12, 'newDoc', 'newDoc', 'Ειδικότητα1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `user_id`, `first_name`, `last_name`, `phone`, `date_of_birth`) VALUES
(1, 14, '', '', NULL, NULL),
(3, 15, 'nana', '', NULL, NULL),
(4, 16, 'bill', '', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`) VALUES
(7, 'giatros', '$2a$10$9pFtkHHszy/v0JJ483Beu.u6b1.v7tT7yMRX16vUBpbtZSg7qxc5G', 'giatros@gmail.com', 'ROLE_DOCTOR', '2025-02-03 17:39:16'),
(8, 'iatros2@gmail.com', '$2a$10$oPckE76M7u0Rett4Eg0BBudd2wGb0y171IAu7xCorKNCUdPYVzPYK', 'iatros2@gmail.com', 'ROLE_DOCTOR', '2025-02-03 17:59:07'),
(9, 'admin', '$2a$10$uXzG5TH8Tve9PaFpmFAkCOX/yF4PWRVvtk6KoBKC7o6VW2fhCNtWm', 'admin@gmail.com', 'ROLE_ADMIN', '2025-02-03 18:40:51'),
(10, 'drmike', '$2a$10$yPIB8RoVtmlNBz7sHnrYS.F5aVrrny5zrVdKjvYD2blhyDBhiRQPK', 'drmike@gmail.com', 'ROLE_DOCTOR', '2025-02-03 19:18:22'),
(11, 'drHelen', '$2a$10$35HsaYRizp8d6gyCSS1gkOt8REQAPxMTz.IwR1prrCOp2yqkPpwZe', 'drHelen@gmail.com', 'ROLE_DOCTOR', '2025-02-03 19:28:17'),
(12, 'newDoc', '$2a$10$Ka2PpJbudtzgv4CyFV5dmODdYJMv.v4Sp5iVMW0JZF7FqTmXZm0Si', 'newDoc@gmail.com', 'ROLE_DOCTOR', '2025-02-03 19:32:36'),
(14, 'mike', '$2a$10$Qtv.KfY7PmBS6WwGa95eLe/qDlkuFXKM2lvmA4.cKi3KFGKbxiqsK', 'mike@gmail.com', 'ROLE_PATIENT', '2025-02-04 07:21:46'),
(15, 'nana', '$2a$10$TSX6n9Q6IAYtfR7apdonaOHtcQ980xWhDBzPChnnctIGGSHWdVvLW', 'nana@nana.com', 'ROLE_PATIENT', '2025-02-04 07:31:03'),
(16, 'bill', '$2a$10$3F5aSgbbbR1a2PuZD3BlPOthyu1mLuLGoJIWS5eQrC9Cxaev38ARK', 'bill@gmail.com', 'ROLE_PATIENT', '2025-02-04 07:44:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
