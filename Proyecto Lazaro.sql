/* ============================================================
   PROYECTO LÁZARO
   BASE DE DATOS: LazaroDB
   MOTOR: SQL SERVER
   ============================================================ */

-- ============================================================
-- 1. CREAR BASE DE DATOS
-- ============================================================

IF DB_ID('LazaroDB') IS NULL
BEGIN
    CREATE DATABASE LazaroDB;
END
GO

USE LazaroDB;
GO


-- ============================================================
-- 2. TABLA: USUARIOS
-- Control de acceso al sistema
-- ============================================================

CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL,
    activo BIT NOT NULL DEFAULT 1,
    fecha_creacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_usuarios_rol
        CHECK (rol IN (
            'Administrador',
            'Medico',
            'Enfermero',
            'Recepcionista',
            'Paciente',
            'Emergencias'
        ))
);
GO


-- ============================================================
-- 3. TABLA: PACIENTES
-- Información general del paciente
-- ============================================================

CREATE TABLE pacientes (
    id_paciente INT IDENTITY(1,1) PRIMARY KEY,
    numero_expediente VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(10) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    email VARCHAR(100),
    tipo_sangre VARCHAR(5),
    alergias VARCHAR(500),
    contacto_emergencia VARCHAR(100),
    telefono_emergencia VARCHAR(20),
    activo BIT NOT NULL DEFAULT 1,
    fecha_registro DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_pacientes_genero
        CHECK (genero IN ('M', 'F', 'Otro'))
);
GO


-- ============================================================
-- 4. TABLA: ESPECIALIDADES
-- Especialidades médicas disponibles
-- ============================================================

CREATE TABLE especialidades (
    id_especialidad INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(300),
    activo BIT NOT NULL DEFAULT 1
);
GO


-- ============================================================
-- 5. TABLA: MEDICOS
-- Información de los médicos
-- ============================================================

CREATE TABLE medicos (
    id_medico INT IDENTITY(1,1) PRIMARY KEY,
    id_especialidad INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    numero_licencia VARCHAR(30) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    anos_experiencia INT,
    disponible BIT NOT NULL DEFAULT 1,
    activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_medicos_especialidades
        FOREIGN KEY (id_especialidad)
        REFERENCES especialidades(id_especialidad),
    CONSTRAINT CK_medicos_experiencia
        CHECK (anos_experiencia IS NULL OR anos_experiencia >= 0)
);
GO


-- ============================================================
-- 6. TABLA: SINTOMAS
-- Catálogo de síntomas
-- ============================================================

CREATE TABLE sintomas (
    id_sintoma INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(300),
    activo BIT NOT NULL DEFAULT 1
);
GO


-- ============================================================
-- 7. TABLA: EVALUACIONES
-- Evaluación inicial del paciente
-- ============================================================

CREATE TABLE evaluaciones (
    id_evaluacion INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    fecha_hora DATETIME2 NOT NULL DEFAULT GETDATE(),
    motivo_consulta VARCHAR(500) NOT NULL,
    descripcion_sintomas VARCHAR(1000),
    observaciones VARCHAR(1000),
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    CONSTRAINT FK_evaluaciones_pacientes
        FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente),
    CONSTRAINT CK_evaluaciones_estado
        CHECK (estado IN (
            'pendiente',
            'en_evaluacion',
            'completada',
            'cancelada'
        ))
);
GO


-- ============================================================
-- 8. TABLA: EVALUACION_SINTOMAS
-- Relación N:M entre evaluaciones y síntomas
-- ============================================================

CREATE TABLE evaluacion_sintomas (
    id_evaluacion INT NOT NULL,
    id_sintoma INT NOT NULL,
    intensidad VARCHAR(20),
    observaciones VARCHAR(300),
    PRIMARY KEY (id_evaluacion, id_sintoma),
    CONSTRAINT FK_evaluacion_sintomas_evaluacion
        FOREIGN KEY (id_evaluacion)
        REFERENCES evaluaciones(id_evaluacion)
        ON DELETE CASCADE,
    CONSTRAINT FK_evaluacion_sintomas_sintoma
        FOREIGN KEY (id_sintoma)
        REFERENCES sintomas(id_sintoma),
    CONSTRAINT CK_evaluacion_sintomas_intensidad
        CHECK (
            intensidad IS NULL OR
            intensidad IN ('Leve', 'Moderada', 'Severa')
        )
);
GO


-- ============================================================
-- 9. TABLA: TRIAJE
-- Determinación de prioridad y signos vitales
-- ============================================================

CREATE TABLE triaje (
    id_triaje INT IDENTITY(1,1) PRIMARY KEY,
    id_evaluacion INT NOT NULL UNIQUE,
    nivel VARCHAR(20) NOT NULL,
    temperatura DECIMAL(4,1),
    frecuencia_cardiaca INT,
    presion_arterial VARCHAR(20),
    saturacion_oxigeno DECIMAL(5,2),
    observaciones VARCHAR(1000),
    fecha_hora DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_triaje_evaluaciones
        FOREIGN KEY (id_evaluacion)
        REFERENCES evaluaciones(id_evaluacion),
    CONSTRAINT CK_triaje_nivel
        CHECK (nivel IN (
            'Emergencia',
            'Urgente',
            'Prioritario',
            'Normal'
        )),
    CONSTRAINT CK_triaje_temperatura
        CHECK (
            temperatura IS NULL OR
            temperatura BETWEEN 25 AND 45
        ),
    CONSTRAINT CK_triaje_frecuencia
        CHECK (
            frecuencia_cardiaca IS NULL OR
            frecuencia_cardiaca > 0
        ),

    CONSTRAINT CK_triaje_saturacion
        CHECK (
            saturacion_oxigeno IS NULL OR
            saturacion_oxigeno BETWEEN 0 AND 100
        )
);
GO


-- ============================================================
-- 10. TABLA: CITAS
-- Citas médicas programadas
-- ============================================================

CREATE TABLE citas (
    id_cita INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    fecha_hora DATETIME2 NOT NULL,
    motivo VARCHAR(500),
    estado VARCHAR(30) NOT NULL DEFAULT 'programada',
    observaciones VARCHAR(500),
    fecha_creacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_citas_pacientes
        FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente),
    CONSTRAINT FK_citas_medicos
        FOREIGN KEY (id_medico)
        REFERENCES medicos(id_medico),
    CONSTRAINT CK_citas_estado
        CHECK (estado IN (
            'programada',
            'confirmada',
            'en_curso',
            'completada',
            'cancelada',
            'no_asistio'
        ))
);
GO


-- ============================================================
-- 11. TABLA: EMERGENCIAS
-- Modo emergencia de Lázaro
-- ============================================================

CREATE TABLE emergencias (
    id_emergencia INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_evaluacion INT NULL,
    fecha_hora DATETIME2 NOT NULL DEFAULT GETDATE(),
    latitud DECIMAL(10,7),
    longitud DECIMAL(10,7),
    descripcion VARCHAR(1000),
    prioridad VARCHAR(20) NOT NULL DEFAULT 'alta',
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    ambulancia_solicitada BIT NOT NULL DEFAULT 0,
    fecha_verificacion DATETIME2 NULL,
    verificado_por INT NULL,
    CONSTRAINT FK_emergencias_pacientes
        FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente),
    CONSTRAINT FK_emergencias_evaluaciones
        FOREIGN KEY (id_evaluacion)
        REFERENCES evaluaciones(id_evaluacion),
    CONSTRAINT FK_emergencias_usuarios
        FOREIGN KEY (verificado_por)
        REFERENCES usuarios(id_usuario),
    CONSTRAINT CK_emergencias_prioridad
        CHECK (prioridad IN (
            'alta',
            'critica',
            'media',
            'baja'
        )),

    CONSTRAINT CK_emergencias_estado
        CHECK (estado IN (
            'pendiente',
            'verificada',
            'ambulancia_asignada',
            'en_camino',
            'paciente_llegado',
            'cancelada'
        )),

    CONSTRAINT CK_emergencias_latitud
        CHECK (
            latitud IS NULL OR
            latitud BETWEEN -90 AND 90
        ),

    CONSTRAINT CK_emergencias_longitud
        CHECK (
            longitud IS NULL OR
            longitud BETWEEN -180 AND 180
        )
);
GO


-- ============================================================
-- 12. TABLA: SALAS
-- Áreas disponibles dentro del hospital
-- ============================================================

CREATE TABLE salas (
    id_sala INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    ubicacion VARCHAR(150),
    capacidad INT NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'disponible',
    CONSTRAINT CK_salas_capacidad
        CHECK (capacidad > 0),
    CONSTRAINT CK_salas_estado
        CHECK (estado IN (
            'disponible',
            'ocupada',
            'mantenimiento'
        ))
);
GO


-- ============================================================
-- 13. TABLA: INGRESOS
-- Ingresos hospitalarios
-- ============================================================

CREATE TABLE ingresos (
    id_ingreso INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico_responsable INT NULL,
    id_sala INT NULL,
    id_emergencia INT NULL,
    fecha_ingreso DATETIME2 NOT NULL DEFAULT GETDATE(),
    fecha_alta DATETIME2 NULL,
    motivo_ingreso VARCHAR(500),
    diagnostico VARCHAR(1000),
    estado VARCHAR(30) NOT NULL DEFAULT 'activo',
    CONSTRAINT FK_ingresos_pacientes
        FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente),
    CONSTRAINT FK_ingresos_medicos
        FOREIGN KEY (id_medico_responsable)
        REFERENCES medicos(id_medico),
    CONSTRAINT FK_ingresos_salas
        FOREIGN KEY (id_sala)
        REFERENCES salas(id_sala),
    CONSTRAINT FK_ingresos_emergencias
        FOREIGN KEY (id_emergencia)
        REFERENCES emergencias(id_emergencia),
    CONSTRAINT CK_ingresos_estado
        CHECK (estado IN (
            'activo',
            'alta',
            'transferido',
            'fallecido'
        ))
);
GO


-- ============================================================
-- 14. TABLA: MOVIMIENTOS_PACIENTE
-- Historial de ubicación dentro del hospital
-- ============================================================

CREATE TABLE movimientos_paciente (
    id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
    id_ingreso INT NOT NULL,
    id_sala_origen INT NULL,
    id_sala_destino INT NOT NULL,
    fecha_hora DATETIME2 NOT NULL DEFAULT GETDATE(),
    motivo VARCHAR(300),
    CONSTRAINT FK_movimientos_ingreso
        FOREIGN KEY (id_ingreso)
        REFERENCES ingresos(id_ingreso),
    CONSTRAINT FK_movimientos_sala_origen
        FOREIGN KEY (id_sala_origen)
        REFERENCES salas(id_sala),
    CONSTRAINT FK_movimientos_sala_destino
        FOREIGN KEY (id_sala_destino)
        REFERENCES salas(id_sala)
);
GO


-- ============================================================
-- 15. TABLA: TRATAMIENTOS
-- Tratamientos asociados al ingreso
-- ============================================================

CREATE TABLE tratamientos (
    id_tratamiento INT IDENTITY(1,1) PRIMARY KEY,
    id_ingreso INT NOT NULL,
    id_medico INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(1000),
    fecha_inicio DATETIME2 NOT NULL DEFAULT GETDATE(),
    fecha_fin DATETIME2 NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'activo',
    CONSTRAINT FK_tratamientos_ingresos
        FOREIGN KEY (id_ingreso)
        REFERENCES ingresos(id_ingreso),
    CONSTRAINT FK_tratamientos_medicos
        FOREIGN KEY (id_medico)
        REFERENCES medicos(id_medico),
    CONSTRAINT CK_tratamientos_estado
        CHECK (estado IN (
            'activo',
            'completado',
            'suspendido'
        ))
);
GO


-- ============================================================
-- 16. TABLA: TRASLADOS
-- Traslado del paciente durante una emergencia
-- ============================================================

CREATE TABLE traslados (
    id_traslado INT IDENTITY(1,1) PRIMARY KEY,
    id_emergencia INT NOT NULL,
    origen VARCHAR(300),
    destino VARCHAR(300),
    fecha_solicitud DATETIME2 NOT NULL DEFAULT GETDATE(),
    fecha_salida DATETIME2 NULL,
    fecha_llegada DATETIME2 NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'solicitado',
    observaciones VARCHAR(500),
    CONSTRAINT FK_traslados_emergencias
        FOREIGN KEY (id_emergencia)
        REFERENCES emergencias(id_emergencia),
    CONSTRAINT CK_traslados_estado
        CHECK (estado IN (
            'solicitado',
            'aprobado',
            'en_camino',
            'completado',
            'cancelado'
        ))
);
GO


-- ============================================================
-- 17. TABLA: HISTORIAL CLÍNICO
-- Expediente/historial de atención del paciente
-- ============================================================

CREATE TABLE historial_clinico (
    id_historial INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NULL,
    id_cita INT NULL,
    id_ingreso INT NULL,
    fecha_hora DATETIME2 NOT NULL DEFAULT GETDATE(),
    motivo VARCHAR(500),
    diagnostico VARCHAR(1000),
    observaciones VARCHAR(2000),
    CONSTRAINT FK_historial_pacientes
        FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente),
    CONSTRAINT FK_historial_medicos
        FOREIGN KEY (id_medico)
        REFERENCES medicos(id_medico),
    CONSTRAINT FK_historial_citas
        FOREIGN KEY (id_cita)
        REFERENCES citas(id_cita),
    CONSTRAINT FK_historial_ingresos
        FOREIGN KEY (id_ingreso)
        REFERENCES ingresos(id_ingreso)
);
GO


/* ============================================================
   ÍNDICES
   ============================================================ */

CREATE INDEX IX_pacientes_nombre
ON pacientes(apellido, nombre);
GO

CREATE INDEX IX_medicos_especialidad
ON medicos(id_especialidad);
GO

CREATE INDEX IX_medicos_disponibilidad
ON medicos(disponible, activo);
GO

CREATE INDEX IX_evaluaciones_paciente
ON evaluaciones(id_paciente, fecha_hora);
GO

CREATE INDEX IX_evaluacion_sintomas_sintoma
ON evaluacion_sintomas(id_sintoma);
GO

CREATE INDEX IX_triaje_nivel
ON triaje(nivel, fecha_hora);
GO

CREATE INDEX IX_citas_fecha
ON citas(fecha_hora);
GO

CREATE INDEX IX_citas_paciente
ON citas(id_paciente, fecha_hora);
GO

CREATE INDEX IX_emergencias_estado
ON emergencias(estado, fecha_hora);
GO

CREATE INDEX IX_emergencias_ubicacion
ON emergencias(latitud, longitud);
GO

CREATE INDEX IX_ingresos_paciente
ON ingresos(id_paciente, fecha_ingreso);
GO

CREATE INDEX IX_ingresos_estado
ON ingresos(estado);
GO

CREATE INDEX IX_movimientos_ingreso
ON movimientos_paciente(id_ingreso, fecha_hora);
GO

CREATE INDEX IX_tratamientos_ingreso
ON tratamientos(id_ingreso);
GO

CREATE INDEX IX_historial_paciente
ON historial_clinico(id_paciente, fecha_hora);
GO

CREATE INDEX IX_traslados_emergencia
ON traslados(id_emergencia);
GO


/* ============================================================
   DATOS INICIALES
   ============================================================ */

-- ESPECIALIDADES

INSERT INTO especialidades
(nombre, descripcion)
VALUES
('Cardiología', 'Atención de enfermedades del corazón y sistema circulatorio'),
('Pediatría', 'Atención médica de niños y adolescentes'),
('Ginecología', 'Atención de la salud femenina'),
('Traumatología', 'Atención de lesiones del sistema musculoesquelético'),
('Neurología', 'Atención de enfermedades del sistema nervioso'),
('Dermatología', 'Atención de enfermedades de la piel');
GO


-- SÍNTOMAS

INSERT INTO sintomas
(nombre, descripcion)
VALUES
('Dolor de pecho', 'Dolor o presión en la zona torácica'),
('Dificultad para respirar', 'Problemas o dificultad durante la respiración'),
('Fiebre', 'Elevación de la temperatura corporal'),
('Dolor de cabeza', 'Dolor localizado en la cabeza'),
('Mareo', 'Sensación de inestabilidad o pérdida del equilibrio'),
('Dolor abdominal', 'Dolor localizado en la región abdominal'),
('Náuseas', 'Sensación de necesidad de vomitar'),
('Vómitos', 'Expulsión del contenido del estómago'),
('Dolor muscular', 'Dolor localizado en músculos'),
('Sangrado', 'Pérdida de sangre visible');
GO


-- SALAS

INSERT INTO salas
(nombre, ubicacion, capacidad, estado)
VALUES
('Sala de Urgencias', 'Planta Baja - Ala Norte', 15, 'disponible'),
('Hospitalización', 'Planta 2 - Ala Este', 20, 'disponible'),
('UCI', 'Planta 3 - Ala Norte', 10, 'disponible'),
('Quirófano', 'Planta 3 - Ala Sur', 5, 'disponible'),
('Consulta Externa', 'Planta 1 - Ala Central', 10, 'disponible'),
('Pediatría', 'Planta 2 - Ala Oeste', 15, 'disponible');
GO


/* ============================================================
   VERIFICACIÓN
   ============================================================ */

SELECT
    TABLE_NAME AS Tabla
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO