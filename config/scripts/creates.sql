/* Database */

CREATE DATABASE 4lunas;

USE 4lunas;

/* Tables */

CREATE TABLE Usuario(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    password_usuario VARCHAR(255) NOT NULL,
    correo_usuario VARCHAR(255) NOT NULL,
    administrador_boolean BOOLEAN NOT NULL,
    fecha_inscripcion_usuario DATE NOT NULL
);

CREATE TABLE Encuesta(
    id_encuestada INT PRIMARY KEY AUTO_INCREMENT,
    nombre_encuestada VARCHAR(255) NOT NULL,
    edad_encuestada VARCHAR(255) NOT NULL,
    nivel_escolar_encuestada VARCHAR(255) NOT NULL,
    situacion_laboral_encuestada VARCHAR(255) NOT NULL,
    descripcion_encuestada VARCHAR(255) NOT NULL,
    usuario_id INT,
    CONSTRAINT FOREIGN KEY fk_encuesta_usuario_id(usuario_id) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Fecha_Ciclo(
    id_fecha_ciclo INT PRIMARY KEY AUTO_INCREMENT,
    fec_ciclo DATE NOT NULL,
    usuario_id INT,
    CONSTRAINT FOREIGN KEY fk_fecha_ciclo_usuario_id(usuario_id) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Ciclo(
    id_ciclo INT PRIMARY KEY AUTO_INCREMENT,
    dia_ciclo INT NOT NULL,
    testosterona_ciclo DECIMAL(10,2) NOT NULL,
    estrogeno_ciclo DECIMAL(10,2) NOT NULL,
    progesterona_ciclo DECIMAL(10,2) NOT NULL
);

CREATE TABLE Anotacion(
    id_anotacion INT PRIMARY KEY AUTO_INCREMENT,
    titulo_anotacion VARCHAR(255) NOT NULL,
    descripcion_anotacion TEXT NOT NULL,
    fecha_anotacion DATE NOT NULL,
    fin_periodo_anotacion DATE,
    fecha_acto_sexual_anotacion DATETIME,
    peso_actual_anotacion VARCHAR(255) NOT NULL,
    estado_animo_anotacion VARCHAR(255) NOT NULL,
    usuario_id INT,
    CONSTRAINT FOREIGN KEY fk_anotacion_usuario_id(usuario_id) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Banner(
    id_banner INT PRIMARY KEY AUTO_INCREMENT,
    url_imagen_banner VARCHAR(255) NOT NULL,
    usuario_id INT,
    CONSTRAINT FOREIGN KEY fk_banner_usuario_id(usuario_id) REFERENCES Usuario(id_usuario)
);