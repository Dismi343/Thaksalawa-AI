-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema thaksalawa-ai-db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema thaksalawa-ai-db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `thaksalawa-ai-db` DEFAULT CHARACTER SET utf8 ;
USE `thaksalawa-ai-db` ;

-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`user_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`user_role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` ENUM('student', 'teacher', 'admin') NOT NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB;


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
    REFERENCES `thaksalawa-ai-db`.`user_role` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`Student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`Student` (
  `student_id` INT NOT NULL AUTO_INCREMENT,
  `st_name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `teacher_teacher_id` INT NULL,
  `user_role_role_id` INT NOT NULL,
  PRIMARY KEY (`student_id`, `user_role_role_id`),
  INDEX `fk_Student_teacher1_idx` (`teacher_teacher_id` ASC) VISIBLE,
  INDEX `fk_Student_user_role1_idx` (`user_role_role_id` ASC) VISIBLE,
  CONSTRAINT `fk_Student_teacher1`
    FOREIGN KEY (`teacher_teacher_id`)
    REFERENCES `thaksalawa-ai-db`.`teacher` (`teacher_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Student_user_role1`
    FOREIGN KEY (`user_role_role_id`)
    REFERENCES `thaksalawa-ai-db`.`user_role` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`Analysis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`Analysis` (
  `analysis_id` INT NOT NULL AUTO_INCREMENT,
  `qId` INT NOT NULL,
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`analysis_id`, `Student_id`),
  INDEX `fk_Analysis_Student1_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `fk_Analysis_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`Student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`pdf`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`pdf` (
  `pdf_id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_data` LONGBLOB NOT NULL,
  `uploaded_at` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`pdf_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`Subject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`Subject` (
  `sub_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `pdf_pdf_id` INT NOT NULL,
  PRIMARY KEY (`sub_id`, `pdf_pdf_id`),
  INDEX `fk_Subject_pdf1_idx` (`pdf_pdf_id` ASC) VISIBLE,
  CONSTRAINT `fk_Subject_pdf1`
    FOREIGN KEY (`pdf_pdf_id`)
    REFERENCES `thaksalawa-ai-db`.`pdf` (`pdf_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`Lesson`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`Lesson` (
  `lesson_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `lesson_number` INT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `Subject_sub_id` INT NOT NULL,
  PRIMARY KEY (`lesson_id`, `Subject_sub_id`),
  INDEX `fk_Lesson_Subject1_idx` (`Subject_sub_id` ASC) VISIBLE,
  CONSTRAINT `fk_Lesson_Subject1`
    FOREIGN KEY (`Subject_sub_id`)
    REFERENCES `thaksalawa-ai-db`.`Subject` (`sub_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`chat` (
  `chat_id` INT NOT NULL AUTO_INCREMENT,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`chat_id`, `Student_id`),
  INDEX `fk_chat_Student1_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `fk_chat_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`Student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


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
    REFERENCES `thaksalawa-ai-db`.`chat` (`chat_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`quiz`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`quiz` (
  `quiz_id` INT NOT NULL,
  `score` INT NOT NULL,
  `q_count` INT NOT NULL,
  `duration` TIME NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `q_type` ENUM('AI', 'Teacher') NULL,
  `Lesson_lesson_id` INT NOT NULL,
  `Analysis_id` INT NOT NULL,
  `Analysis_Student_id` INT NOT NULL,
  `Student_id` INT NOT NULL,
  `teacher_teacher_id` INT NULL,
  PRIMARY KEY (`quiz_id`),
  INDEX `fk_quiz_Lesson1_idx` (`Lesson_lesson_id` ASC) VISIBLE,
  INDEX `fk_quiz_Analysis1_idx` (`Analysis_id` ASC, `Analysis_Student_id` ASC) VISIBLE,
  INDEX `fk_quiz_Student1_idx` (`Student_id` ASC) VISIBLE,
  INDEX `fk_quiz_teacher1_idx` (`teacher_teacher_id` ASC) VISIBLE,
  CONSTRAINT `fk_quiz_Lesson1`
    FOREIGN KEY (`Lesson_lesson_id`)
    REFERENCES `thaksalawa-ai-db`.`Lesson` (`lesson_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_quiz_Analysis1`
    FOREIGN KEY (`Analysis_id` , `Analysis_Student_id`)
    REFERENCES `thaksalawa-ai-db`.`Analysis` (`analysis_id` , `Student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_quiz_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`Student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_quiz_teacher1`
    FOREIGN KEY (`teacher_teacher_id`)
    REFERENCES `thaksalawa-ai-db`.`teacher` (`teacher_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`login_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`login_logs` (
  `login_id` INT NOT NULL AUTO_INCREMENT,
  `login_time` TIME NULL,
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`login_id`, `Student_id`),
  INDEX `fk_login_logs_Student1_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `fk_login_logs_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`Student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`questions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`questions` (
  `question_id` INT NOT NULL AUTO_INCREMENT,
  `question_text` MEDIUMTEXT NOT NULL,
  `question_type` ENUM('mcq', 'short') NOT NULL,
  `source` ENUM('AI', 'Teacher') NOT NULL,
  `quiz_quiz_id` INT NOT NULL,
  PRIMARY KEY (`question_id`, `quiz_quiz_id`),
  INDEX `fk_questions_quiz1_idx` (`quiz_quiz_id` ASC) VISIBLE,
  CONSTRAINT `fk_questions_quiz1`
    FOREIGN KEY (`quiz_quiz_id`)
    REFERENCES `thaksalawa-ai-db`.`quiz` (`quiz_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`student_answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`student_answer` (
  `option_id` INT NOT NULL AUTO_INCREMENT,
  `option_text` VARCHAR(255) NULL,
  `is_correct` TINYINT NOT NULL,
  `written_answer` MEDIUMTEXT NULL,
  `questions_quiz_quiz_id` INT NOT NULL,
  `Student_id` INT NOT NULL,
  PRIMARY KEY (`option_id`, `questions_quiz_quiz_id`, `Student_id`),
  INDEX `fk_mcq_options_questions1_idx` (`questions_quiz_quiz_id` ASC) VISIBLE,
  INDEX `fk_student_answer_Student1_idx` (`Student_id` ASC) VISIBLE,
  CONSTRAINT `fk_mcq_options_questions1`
    FOREIGN KEY (`questions_quiz_quiz_id`)
    REFERENCES `thaksalawa-ai-db`.`questions` (`quiz_quiz_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_student_answer_Student1`
    FOREIGN KEY (`Student_id`)
    REFERENCES `thaksalawa-ai-db`.`Student` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`model_answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`model_answer` (
  `model_answer_id` INT NOT NULL AUTO_INCREMENT,
  `answer_text` VARCHAR(255) NULL,
  `questions_quiz_quiz_id` INT NOT NULL,
  PRIMARY KEY (`model_answer_id`, `questions_quiz_quiz_id`),
  INDEX `fk_model_answer_questions1_idx` (`questions_quiz_quiz_id` ASC) VISIBLE,
  CONSTRAINT `fk_model_answer_questions1`
    FOREIGN KEY (`questions_quiz_quiz_id`)
    REFERENCES `thaksalawa-ai-db`.`questions` (`quiz_quiz_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thaksalawa-ai-db`.`keywords`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thaksalawa-ai-db`.`keywords` (
  `keyword_id` INT NOT NULL AUTO_INCREMENT,
  `keyword_text` VARCHAR(45) NOT NULL,
  `model_answer_model_answer_id` INT NOT NULL,
  PRIMARY KEY (`keyword_id`, `model_answer_model_answer_id`),
  INDEX `fk_keywords_model_answer1_idx` (`model_answer_model_answer_id` ASC) VISIBLE,
  CONSTRAINT `fk_keywords_model_answer1`
    FOREIGN KEY (`model_answer_model_answer_id`)
    REFERENCES `thaksalawa-ai-db`.`model_answer` (`model_answer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


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
    REFERENCES `thaksalawa-ai-db`.`user_role` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
