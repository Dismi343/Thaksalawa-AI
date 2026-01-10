-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema thaksalawa-ai-db
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `thaksalawa-ai-db` ;

-- -----------------------------------------------------
-- Schema thaksalawa-ai-db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `thaksalawa-ai-db` DEFAULT CHARACTER SET utf8mb3 ;
USE `thaksalawa-ai-db` ;

-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`user_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`user_role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` ENUM('student', 'teacher', 'admin') NOT NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`admin` (
  `admin_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `user_role_role_id` INT NOT NULL,
  PRIMARY KEY (`admin_id`, `user_role_role_id`),
  INDEX `fk_admin_user_role1_idx` (`user_role_role_id` ASC) VISIBLE,
  CONSTRAINT `fk_admin_user_role1`
    FOREIGN KEY (`user_role_role_id`)
    REFERENCES `thaksalawa-ai-db`.`user_role` (`role_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`student` (
  `student_id` INT NOT NULL AUTO_INCREMENT,
  `st_name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `user_role_role_id` INT NOT NULL,
  PRIMARY KEY (`student_id`, `user_role_role_id`),
  INDEX `fk_Student_user_role1_idx` (`user_role_role_id` ASC) VISIBLE,
  CONSTRAINT `fk_Student_user_role1`
    FOREIGN KEY (`user_role_role_id`)
    REFERENCES `thaksalawa-ai-db`.`user_role` (`role_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`analysis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`analysis` (
  `analysis_id` INT NOT NULL AUTO_INCREMENT,
  `qId` INT NOT NULL,
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`analysis_id`, `Student_id`),
  INDEX `fk_Analysis_Student1_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `fk_Analysis_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`student` (`student_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`blacklisted_tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`blacklisted_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(255) NOT NULL,
  `blacklisted_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`teacher` (
  `teacher_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `user_role_role_id` INT NOT NULL,
  PRIMARY KEY (`teacher_id`, `user_role_role_id`),
  INDEX `fk_teacher_user_role1_idx` (`user_role_role_id` ASC) VISIBLE,
  CONSTRAINT `fk_teacher_user_role1`
    FOREIGN KEY (`user_role_role_id`)
    REFERENCES `thaksalawa-ai-db`.`user_role` (`role_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`pdf`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`pdf` (
  `pdf_id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_data` LONGBLOB NOT NULL,
  `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teacher_teacher_id` INT NOT NULL,
  PRIMARY KEY (`pdf_id`, `teacher_teacher_id`),
  INDEX `fk_pdf_teacher1_idx` (`teacher_teacher_id` ASC) VISIBLE,
  CONSTRAINT `fk_pdf_teacher1`
    FOREIGN KEY (`teacher_teacher_id`)
    REFERENCES `thaksalawa-ai-db`.`teacher` (`teacher_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`subject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`subject` (
  `sub_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `pdf_pdf_id` INT NOT NULL,
  PRIMARY KEY (`sub_id`, `pdf_pdf_id`),
  INDEX `fk_Subject_pdf1_idx` (`pdf_pdf_id` ASC) VISIBLE,
  CONSTRAINT `fk_Subject_pdf1`
    FOREIGN KEY (`pdf_pdf_id`)
    REFERENCES `thaksalawa-ai-db`.`pdf` (`pdf_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`chat` (
  `chat_id` INT NOT NULL AUTO_INCREMENT,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Student_id` INT NOT NULL,
  `subject_sub_id` INT NOT NULL,
  PRIMARY KEY (`chat_id`, `Student_id`, `subject_sub_id`),
  INDEX `fk_chat_Student1_idx` (`Student_id` ASC) VISIBLE,
  INDEX `fk_chat_subject1_idx` (`subject_sub_id` ASC) VISIBLE,
  CONSTRAINT `fk_chat_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`student` (`student_id`),
  CONSTRAINT `fk_chat_subject1`
    FOREIGN KEY (`subject_sub_id`)
    REFERENCES `thaksalawa-ai-db`.`subject` (`sub_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`lesson`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`lesson` (
  `lesson_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `lesson_number` INT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `brief_summary` MEDIUMTEXT NOT NULL,
  `Subject_sub_id` INT NOT NULL,
  PRIMARY KEY (`lesson_id`, `Subject_sub_id`),
  INDEX `fk_Lesson_Subject1_idx` (`Subject_sub_id` ASC) VISIBLE,
  CONSTRAINT `fk_Lesson_Subject1`
    FOREIGN KEY (`Subject_sub_id`)
    REFERENCES `thaksalawa-ai-db`.`subject` (`sub_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`quiz`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`quiz` (
  `quiz_id` INT NOT NULL AUTO_INCREMENT,
  `score` INT NOT NULL DEFAULT '0',
  `q_count` INT NOT NULL,
  `duration` TIME NULL DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `q_type` ENUM('AI', 'Teacher') NULL DEFAULT 'AI',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL DEFAULT NULL,
  `Lesson_lesson_id` INT NOT NULL,
  `Analysis_id` INT NULL DEFAULT NULL,
  `Analysis_Student_id` INT NULL DEFAULT NULL,
  `Student_id` INT NOT NULL,
  `teacher_teacher_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`quiz_id`),
  INDEX `fk_quiz_Lesson1_idx` (`Lesson_lesson_id` ASC) VISIBLE,
  INDEX `fk_quiz_Student1_idx` (`Student_id` ASC) VISIBLE,
  INDEX `fk_quiz_teacher1_idx` (`teacher_teacher_id` ASC) VISIBLE,
  CONSTRAINT `fk_quiz_Lesson1`
    FOREIGN KEY (`Lesson_lesson_id`)
    REFERENCES `thaksalawa-ai-db`.`lesson` (`lesson_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_quiz_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`student` (`student_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_quiz_teacher1`
    FOREIGN KEY (`teacher_teacher_id`)
    REFERENCES `thaksalawa-ai-db`.`teacher` (`teacher_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`questions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`questions` (
  `question_id` INT NOT NULL AUTO_INCREMENT,
  `question_text` MEDIUMTEXT NOT NULL,
  `question_type` ENUM('mcq', 'short') NOT NULL,
  `source` ENUM('AI', 'Teacher') NOT NULL DEFAULT 'AI',
  `explanation` TEXT NULL DEFAULT NULL,
  `quiz_quiz_id` INT NOT NULL,
  PRIMARY KEY (`question_id`),
  INDEX `fk_questions_quiz1_idx` (`quiz_quiz_id` ASC) VISIBLE,
  CONSTRAINT `fk_questions_quiz1`
    FOREIGN KEY (`quiz_quiz_id`)
    REFERENCES `thaksalawa-ai-db`.`quiz` (`quiz_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`model_answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`model_answer` (
  `model_answer_id` INT NOT NULL AUTO_INCREMENT,
  `answer_text` TEXT NOT NULL,
  `max_score` INT NOT NULL DEFAULT '10',
  `question_id` INT NOT NULL,
  PRIMARY KEY (`model_answer_id`),
  INDEX `fk_model_answer_questions1_idx` (`question_id` ASC) VISIBLE,
  CONSTRAINT `fk_model_answer_questions1`
    FOREIGN KEY (`question_id`)
    REFERENCES `thaksalawa-ai-db`.`questions` (`question_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`keywords`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`keywords` (
  `keyword_id` INT NOT NULL AUTO_INCREMENT,
  `keyword_text` VARCHAR(200) NOT NULL,
  `model_answer_model_answer_id` INT NOT NULL,
  PRIMARY KEY (`keyword_id`),
  INDEX `fk_keywords_model_answer1_idx` (`model_answer_model_answer_id` ASC) VISIBLE,
  CONSTRAINT `fk_keywords_model_answer1`
    FOREIGN KEY (`model_answer_model_answer_id`)
    REFERENCES `thaksalawa-ai-db`.`model_answer` (`model_answer_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`login_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`login_logs` (
  `login_id` INT NOT NULL AUTO_INCREMENT,
  `login_date` DATE NOT NULL,
  `login_time` TIME NULL DEFAULT NULL,
  `logout_time` TIME NULL DEFAULT NULL,
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`login_id`, `Student_id`),
  INDEX `fk_login_logs_Student1_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `fk_login_logs_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`student` (`student_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`mcq_options`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`mcq_options` (
  `option_id` INT NOT NULL AUTO_INCREMENT,
  `option_text` VARCHAR(500) NOT NULL,
  `is_correct` TINYINT NOT NULL DEFAULT '0',
  `option_order` INT NOT NULL,
  `question_id` INT NOT NULL,
  PRIMARY KEY (`option_id`),
  INDEX `fk_mcq_options_questions1_idx` (`question_id` ASC) VISIBLE,
  CONSTRAINT `fk_mcq_options_questions1`
    FOREIGN KEY (`question_id`)
    REFERENCES `thaksalawa-ai-db`.`questions` (`question_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`message` (
  `message_id` INT NOT NULL AUTO_INCREMENT,
  `query` MEDIUMTEXT NOT NULL,
  `message` MEDIUMTEXT NOT NULL,
  `chat_chat_id` INT NOT NULL,
  PRIMARY KEY (`message_id`, `chat_chat_id`),
  INDEX `fk_message_chat1_idx` (`chat_chat_id` ASC) VISIBLE,
  CONSTRAINT `fk_message_chat1`
    FOREIGN KEY (`chat_chat_id`)
    REFERENCES `thaksalawa-ai-db`.`chat` (`chat_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`student_answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`student_answer` (
  `answer_id` INT NOT NULL AUTO_INCREMENT,
  `selected_option` INT NULL DEFAULT NULL,
  `is_correct` TINYINT NULL DEFAULT NULL,
  `written_answer` MEDIUMTEXT NULL DEFAULT NULL,
  `score_obtained` INT NULL DEFAULT NULL,
  `feedback` TEXT NULL DEFAULT NULL,
  `question_id` INT NOT NULL,
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`answer_id`),
  INDEX `fk_student_answer_questions1_idx` (`question_id` ASC) VISIBLE,
  INDEX `fk_student_answer_Student1_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `fk_student_answer_questions1`
    FOREIGN KEY (`question_id`)
    REFERENCES `thaksalawa-ai-db`.`questions` (`question_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_student_answer_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`student` (`student_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`flash_card`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`flash_card` (
  `card_id` INT NOT NULL AUTO_INCREMENT,
  `question` MEDIUMTEXT NOT NULL,
  `answer` MEDIUMTEXT NOT NULL,
  `difficulty` ENUM("easy", "medium", "hard") NOT NULL,
  `created_at` DATETIME NOT NULL,
  `lesson_lesson_id` INT NOT NULL,
  `teacher_teacher_id` INT NULL,
  `student_student_id` INT NULL,
  PRIMARY KEY (`card_id`, `lesson_lesson_id`),
  INDEX `fk_flash_card_lesson1_idx` (`lesson_lesson_id` ASC) VISIBLE,
  INDEX `fk_flash_card_teacher1_idx` (`teacher_teacher_id` ASC) VISIBLE,
  INDEX `fk_flash_card_student1_idx` (`student_student_id` ASC) VISIBLE,
  CONSTRAINT `fk_flash_card_lesson1`
    FOREIGN KEY (`lesson_lesson_id`)
    REFERENCES `thaksalawa-ai-db`.`lesson` (`lesson_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_flash_card_teacher1`
    FOREIGN KEY (`teacher_teacher_id`)
    REFERENCES `thaksalawa-ai-db`.`teacher` (`teacher_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_flash_card_student1`
    FOREIGN KEY (`student_student_id`)
    REFERENCES `thaksalawa-ai-db`.`student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`lesson_key_points`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`lesson_key_points` (
  `point_id` INT NOT NULL AUTO_INCREMENT,
  `key_point` MEDIUMTEXT NOT NULL,
  `lesson_lesson_id` INT NOT NULL,
  PRIMARY KEY (`point_id`, `lesson_lesson_id`),
  INDEX `fk_lesson_key_points_lesson1_idx` (`lesson_lesson_id` ASC) VISIBLE,
  CONSTRAINT `fk_lesson_key_points_lesson1`
    FOREIGN KEY (`lesson_lesson_id`)
    REFERENCES `thaksalawa-ai-db`.`lesson` (`lesson_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`teacher_has_student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`teacher_has_student` (
  `teacher_teacher_id` INT NOT NULL,
  `student_student_id` INT NOT NULL,
  PRIMARY KEY (`teacher_teacher_id`, `student_student_id`),
  INDEX `fk_teacher_has_student_student1_idx` (`student_student_id` ASC) VISIBLE,
  INDEX `fk_teacher_has_student_teacher1_idx` (`teacher_teacher_id` ASC) VISIBLE,
  CONSTRAINT `fk_teacher_has_student_teacher1`
    FOREIGN KEY (`teacher_teacher_id`)
    REFERENCES `thaksalawa-ai-db`.`teacher` (`teacher_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_teacher_has_student_student1`
    FOREIGN KEY (`student_student_id`)
    REFERENCES `thaksalawa-ai-db`.`student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
