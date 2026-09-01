USE LazaroDB;
GO

/* =========================================================
   CRUD - USUARIOS
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_InsertarUsuario
    @nombre_usuario VARCHAR(50),
    @password_hash VARCHAR(255),
    @rol VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO usuarios(nombre_usuario, password_hash, rol)
    VALUES(@nombre_usuario, @password_hash, @rol);
    SELECT SCOPE_IDENTITY() AS id_usuario;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerUsuarios
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id_usuario, nombre_usuario, rol, activo, fecha_creacion
    FROM usuarios
    ORDER BY nombre_usuario;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerUsuarioPorId
    @id_usuario INT
AS
BEGIN
    SELECT id_usuario, nombre_usuario, rol, activo, fecha_creacion
    FROM usuarios
    WHERE id_usuario = @id_usuario;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarUsuario
    @id_usuario INT,
    @nombre_usuario VARCHAR(50),
    @rol VARCHAR(30),
    @activo BIT
AS
BEGIN
    UPDATE usuarios
    SET nombre_usuario = @nombre_usuario,
        rol = @rol,
        activo = @activo
    WHERE id_usuario = @id_usuario;
END
GO
--Desactivar o Eliminar
CREATE OR ALTER PROCEDURE sp_DesactivarUsuario
    @id_usuario INT
AS
BEGIN
    UPDATE usuarios
    SET activo = 0
    WHERE id_usuario = @id_usuario;
END
GO


/* =========================================================
   CRUD - PACIENTES
   ========================================================= */
   --crear 
CREATE OR ALTER PROCEDURE sp_InsertarPaciente
    @numero_expediente VARCHAR(20),
    @nombre VARCHAR(50),
    @apellido VARCHAR(50),
    @fecha_nacimiento DATE,
    @genero VARCHAR(10),
    @direccion VARCHAR(200),
    @telefono VARCHAR(20),
    @email VARCHAR(100),
    @tipo_sangre VARCHAR(5),
    @alergias VARCHAR(500),
    @contacto_emergencia VARCHAR(100),
    @telefono_emergencia VARCHAR(20)
AS
BEGIN
    INSERT INTO pacientes
    (numero_expediente,nombre,apellido,fecha_nacimiento,genero,direccion,
     telefono,email,tipo_sangre,alergias,contacto_emergencia,telefono_emergencia)
    VALUES
    (@numero_expediente,@nombre,@apellido,@fecha_nacimiento,@genero,@direccion,
     @telefono,@email,@tipo_sangre,@alergias,@contacto_emergencia,@telefono_emergencia);

    SELECT SCOPE_IDENTITY() AS id_paciente;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerPacientes
AS
BEGIN
    SELECT *
    FROM pacientes
    WHERE activo = 1
    ORDER BY apellido, nombre;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerPacientePorId
    @id_paciente INT
AS
BEGIN
    SELECT *
    FROM pacientes
    WHERE id_paciente = @id_paciente;
END
GO
--Buscar
CREATE OR ALTER PROCEDURE sp_BuscarPacientes
    @busqueda VARCHAR(100)
AS
BEGIN
    SELECT *
    FROM pacientes
    WHERE activo = 1
      AND (
          numero_expediente LIKE '%' + @busqueda + '%'
          OR nombre LIKE '%' + @busqueda + '%'
          OR apellido LIKE '%' + @busqueda + '%'
          OR telefono LIKE '%' + @busqueda + '%'
      )
    ORDER BY apellido, nombre;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarPaciente
    @id_paciente INT,
    @nombre VARCHAR(50),
    @apellido VARCHAR(50),
    @fecha_nacimiento DATE,
    @genero VARCHAR(10),
    @direccion VARCHAR(200),
    @telefono VARCHAR(20),
    @email VARCHAR(100),
    @tipo_sangre VARCHAR(5),
    @alergias VARCHAR(500),
    @contacto_emergencia VARCHAR(100),
    @telefono_emergencia VARCHAR(20)
AS
BEGIN
    UPDATE pacientes
    SET nombre = @nombre,
        apellido = @apellido,
        fecha_nacimiento = @fecha_nacimiento,
        genero = @genero,
        direccion = @direccion,
        telefono = @telefono,
        email = @email,
        tipo_sangre = @tipo_sangre,
        alergias = @alergias,
        contacto_emergencia = @contacto_emergencia,
        telefono_emergencia = @telefono_emergencia
    WHERE id_paciente = @id_paciente;
END
GO


--Eliminar
CREATE OR ALTER PROCEDURE sp_DesactivarPaciente
    @id_paciente INT
AS
BEGIN
    UPDATE pacientes
    SET activo = 0
    WHERE id_paciente = @id_paciente;
END
GO


/* =========================================================
   CRUD - ESPECIALIDADES
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_InsertarEspecialidad
    @nombre VARCHAR(80),
    @descripcion VARCHAR(300)
AS
BEGIN
    INSERT INTO especialidades(nombre, descripcion)
    VALUES(@nombre, @descripcion);

    SELECT SCOPE_IDENTITY() AS id_especialidad;
END
GO

CREATE OR ALTER PROCEDURE sp_ObtenerEspecialidades
AS
BEGIN
    SELECT *
    FROM especialidades
    WHERE activo = 1
    ORDER BY nombre;
END
GO
--buscar
CREATE OR ALTER PROCEDURE sp_ObtenerEspecialidadPorId
    @id_especialidad INT
AS
BEGIN
    SELECT *
    FROM especialidades
    WHERE id_especialidad = @id_especialidad;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarEspecialidad
    @id_especialidad INT,
    @nombre VARCHAR(80),
    @descripcion VARCHAR(300)
AS
BEGIN
    UPDATE especialidades
    SET nombre = @nombre,
        descripcion = @descripcion
    WHERE id_especialidad = @id_especialidad;
END
GO

CREATE OR ALTER PROCEDURE sp_DesactivarEspecialidad
    @id_especialidad INT
AS
BEGIN
    UPDATE especialidades
    SET activo = 0
    WHERE id_especialidad = @id_especialidad;
END
GO


/* =========================================================
   CRUD - MEDICOS
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_InsertarMedico
    @id_especialidad INT,
    @nombre VARCHAR(50),
    @apellido VARCHAR(50),
    @numero_licencia VARCHAR(30),
    @telefono VARCHAR(20),
    @email VARCHAR(100),
    @anos_experiencia INT
AS
BEGIN
    INSERT INTO medicos
    (id_especialidad,nombre,apellido,numero_licencia,telefono,email,anos_experiencia)
    VALUES
    (@id_especialidad,@nombre,@apellido,@numero_licencia,@telefono,@email,@anos_experiencia);

    SELECT SCOPE_IDENTITY() AS id_medico;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerMedicos
AS
BEGIN
    SELECT
        m.*,
        e.nombre AS especialidad
    FROM medicos m
    INNER JOIN especialidades e
        ON m.id_especialidad = e.id_especialidad
    WHERE m.activo = 1
    ORDER BY m.apellido, m.nombre;
END
GO
--Buscar
CREATE OR ALTER PROCEDURE sp_ObtenerMedicoPorId
    @id_medico INT
AS
BEGIN
    SELECT
        m.*,
        e.nombre AS especialidad
    FROM medicos m
    INNER JOIN especialidades e
        ON m.id_especialidad = e.id_especialidad
    WHERE m.id_medico = @id_medico;
END
GO
--Buscar
CREATE OR ALTER PROCEDURE sp_BuscarMedicos
    @busqueda VARCHAR(100)
AS
BEGIN
    SELECT
        m.*,
        e.nombre AS especialidad
    FROM medicos m
    INNER JOIN especialidades e
        ON m.id_especialidad = e.id_especialidad
    WHERE m.activo = 1
      AND (
          m.nombre LIKE '%' + @busqueda + '%'
          OR m.apellido LIKE '%' + @busqueda + '%'
          OR m.numero_licencia LIKE '%' + @busqueda + '%'
          OR e.nombre LIKE '%' + @busqueda + '%'
      )
    ORDER BY m.apellido, m.nombre;
END
GO
--Medicos Disponibles 
CREATE OR ALTER PROCEDURE sp_ObtenerMedicosDisponibles
    @id_especialidad INT = NULL
AS
BEGIN
    SELECT
        m.id_medico,
        m.nombre,
        m.apellido,
        m.numero_licencia,
        e.nombre AS especialidad
    FROM medicos m
    INNER JOIN especialidades e
        ON m.id_especialidad = e.id_especialidad
    WHERE m.activo = 1
      AND m.disponible = 1
      AND (@id_especialidad IS NULL OR m.id_especialidad = @id_especialidad)
    ORDER BY m.apellido, m.nombre;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarMedico
    @id_medico INT,
    @id_especialidad INT,
    @nombre VARCHAR(50),
    @apellido VARCHAR(50),
    @numero_licencia VARCHAR(30),
    @telefono VARCHAR(20),
    @email VARCHAR(100),
    @anos_experiencia INT,
    @disponible BIT
AS
BEGIN
    UPDATE medicos
    SET id_especialidad = @id_especialidad,
        nombre = @nombre,
        apellido = @apellido,
        numero_licencia = @numero_licencia,
        telefono = @telefono,
        email = @email,
        anos_experiencia = @anos_experiencia,
        disponible = @disponible
    WHERE id_medico = @id_medico;
END
GO
--Eliminar
CREATE OR ALTER PROCEDURE sp_DesactivarMedico
    @id_medico INT
AS
BEGIN
    UPDATE medicos
    SET activo = 0,
        disponible = 0
    WHERE id_medico = @id_medico;
END
GO


/* =========================================================
   CRUD - SINTOMAS
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_InsertarSintoma
    @nombre VARCHAR(100),
    @descripcion VARCHAR(300)
AS
BEGIN
    INSERT INTO sintomas(nombre, descripcion)
    VALUES(@nombre, @descripcion);

    SELECT SCOPE_IDENTITY() AS id_sintoma;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerSintomas
AS
BEGIN
    SELECT *
    FROM sintomas
    WHERE activo = 1
    ORDER BY nombre;
END
GO
--Buscar
CREATE OR ALTER PROCEDURE sp_ObtenerSintomaPorId
    @id_sintoma INT
AS
BEGIN
    SELECT *
    FROM sintomas
    WHERE id_sintoma = @id_sintoma;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarSintoma
    @id_sintoma INT,
    @nombre VARCHAR(100),
    @descripcion VARCHAR(300)
AS
BEGIN
    UPDATE sintomas
    SET nombre = @nombre,
        descripcion = @descripcion
    WHERE id_sintoma = @id_sintoma;
END
GO
--Eliminar
CREATE OR ALTER PROCEDURE sp_DesactivarSintoma
    @id_sintoma INT
AS
BEGIN
    UPDATE sintomas
    SET activo = 0
    WHERE id_sintoma = @id_sintoma;
END
GO


/* =========================================================
   CRUD - EVALUACIONES
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_CrearEvaluacion
    @id_paciente INT,
    @motivo_consulta VARCHAR(500),
    @descripcion_sintomas VARCHAR(1000),
    @observaciones VARCHAR(1000)
AS
BEGIN
    INSERT INTO evaluaciones
    (id_paciente,motivo_consulta,descripcion_sintomas,observaciones)
    VALUES
    (@id_paciente,@motivo_consulta,@descripcion_sintomas,@observaciones);

    SELECT SCOPE_IDENTITY() AS id_evaluacion;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerEvaluaciones
AS
BEGIN
    SELECT
        e.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        p.numero_expediente
    FROM evaluaciones e
    INNER JOIN pacientes p
        ON e.id_paciente = p.id_paciente
    ORDER BY e.fecha_hora DESC;
END
GO
--Buscar
CREATE OR ALTER PROCEDURE sp_ObtenerEvaluacionPorId
    @id_evaluacion INT
AS
BEGIN
    SELECT
        e.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        p.numero_expediente
    FROM evaluaciones e
    INNER JOIN pacientes p
        ON e.id_paciente = p.id_paciente
    WHERE e.id_evaluacion = @id_evaluacion;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarEstadoEvaluacion
    @id_evaluacion INT,
    @estado VARCHAR(30)
AS
BEGIN
    UPDATE evaluaciones
    SET estado = @estado
    WHERE id_evaluacion = @id_evaluacion;
END
GO
--Eliminar
CREATE OR ALTER PROCEDURE sp_CancelarEvaluacion
    @id_evaluacion INT
AS
BEGIN
    UPDATE evaluaciones
    SET estado = 'cancelada'
    WHERE id_evaluacion = @id_evaluacion;
END
GO


/* =========================================================
   CRUD - EVALUACION_SINTOMAS
   ========================================================= */
   --Craer
CREATE OR ALTER PROCEDURE sp_AgregarSintomaEvaluacion
    @id_evaluacion INT,
    @id_sintoma INT,
    @intensidad VARCHAR(20),
    @observaciones VARCHAR(300)
AS
BEGIN
    INSERT INTO evaluacion_sintomas
    (id_evaluacion,id_sintoma,intensidad,observaciones)
    VALUES
    (@id_evaluacion,@id_sintoma,@intensidad,@observaciones);
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerSintomasEvaluacion
    @id_evaluacion INT
AS
BEGIN
    SELECT
        es.id_evaluacion,
        s.id_sintoma,
        s.nombre,
        es.intensidad,
        es.observaciones
    FROM evaluacion_sintomas es
    INNER JOIN sintomas s
        ON es.id_sintoma = s.id_sintoma
    WHERE es.id_evaluacion = @id_evaluacion;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarSintomaEvaluacion
    @id_evaluacion INT,
    @id_sintoma INT,
    @intensidad VARCHAR(20),
    @observaciones VARCHAR(300)
AS
BEGIN
    UPDATE evaluacion_sintomas
    SET intensidad = @intensidad,
        observaciones = @observaciones
    WHERE id_evaluacion = @id_evaluacion
      AND id_sintoma = @id_sintoma;
END
GO
--Eliminar
CREATE OR ALTER PROCEDURE sp_EliminarSintomaEvaluacion
    @id_evaluacion INT,
    @id_sintoma INT
AS
BEGIN
    DELETE FROM evaluacion_sintomas
    WHERE id_evaluacion = @id_evaluacion
      AND id_sintoma = @id_sintoma;
END
GO


/* =========================================================
   CRUD - TRIAJE
   ========================================================= */
   --Craer
CREATE OR ALTER PROCEDURE sp_RegistrarTriaje
    @id_evaluacion INT,
    @nivel VARCHAR(20),
    @temperatura DECIMAL(4,1),
    @frecuencia_cardiaca INT,
    @presion_arterial VARCHAR(20),
    @saturacion_oxigeno DECIMAL(5,2),
    @observaciones VARCHAR(1000)
AS
BEGIN
    INSERT INTO triaje
    (id_evaluacion,nivel,temperatura,frecuencia_cardiaca,
     presion_arterial,saturacion_oxigeno,observaciones)
    VALUES
    (@id_evaluacion,@nivel,@temperatura,@frecuencia_cardiaca,
     @presion_arterial,@saturacion_oxigeno,@observaciones);

    SELECT SCOPE_IDENTITY() AS id_triaje;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerTriajePorEvaluacion
    @id_evaluacion INT
AS
BEGIN
    SELECT *
    FROM triaje
    WHERE id_evaluacion = @id_evaluacion;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarTriaje
    @id_triaje INT,
    @nivel VARCHAR(20),
    @temperatura DECIMAL(4,1),
    @frecuencia_cardiaca INT,
    @presion_arterial VARCHAR(20),
    @saturacion_oxigeno DECIMAL(5,2),
    @observaciones VARCHAR(1000)
AS
BEGIN
    UPDATE triaje
    SET nivel = @nivel,
        temperatura = @temperatura,
        frecuencia_cardiaca = @frecuencia_cardiaca,
        presion_arterial = @presion_arterial,
        saturacion_oxigeno = @saturacion_oxigeno,
        observaciones = @observaciones
    WHERE id_triaje = @id_triaje;
END
GO


/* =========================================================
   CRUD - CITAS
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_CrearCita
    @id_paciente INT,
    @id_medico INT,
    @fecha_hora DATETIME2,
    @motivo VARCHAR(500),
    @observaciones VARCHAR(500)
AS
BEGIN
    INSERT INTO citas
    (id_paciente,id_medico,fecha_hora,motivo,observaciones)
    VALUES
    (@id_paciente,@id_medico,@fecha_hora,@motivo,@observaciones);
    SELECT SCOPE_IDENTITY() AS id_cita;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerCitas
AS
BEGIN
    SELECT
        c.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        CONCAT(m.nombre,' ',m.apellido) AS medico,
        e.nombre AS especialidad
    FROM citas c
    INNER JOIN pacientes p ON c.id_paciente = p.id_paciente
    INNER JOIN medicos m ON c.id_medico = m.id_medico
    INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    ORDER BY c.fecha_hora;
END
GO
--Buscar
CREATE OR ALTER PROCEDURE sp_ObtenerCitaPorId
    @id_cita INT
AS
BEGIN
    SELECT
        c.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        CONCAT(m.nombre,' ',m.apellido) AS medico,
        e.nombre AS especialidad
    FROM citas c
    INNER JOIN pacientes p ON c.id_paciente = p.id_paciente
    INNER JOIN medicos m ON c.id_medico = m.id_medico
    INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE c.id_cita = @id_cita;
END
GO
--Lista
CREATE OR ALTER PROCEDURE sp_ObtenerCitasPaciente
    @id_paciente INT
AS
BEGIN
    SELECT
        c.*,
        CONCAT(m.nombre,' ',m.apellido) AS medico,
        e.nombre AS especialidad
    FROM citas c
    INNER JOIN medicos m ON c.id_medico = m.id_medico
    INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE c.id_paciente = @id_paciente
    ORDER BY c.fecha_hora DESC;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarCita
    @id_cita INT,
    @id_medico INT,
    @fecha_hora DATETIME2,
    @motivo VARCHAR(500),
    @estado VARCHAR(30),
    @observaciones VARCHAR(500)
AS
BEGIN
    UPDATE citas
    SET id_medico = @id_medico,
        fecha_hora = @fecha_hora,
        motivo = @motivo,
        estado = @estado,
        observaciones = @observaciones
    WHERE id_cita = @id_cita;
END
GO
--Cancelar cita
CREATE OR ALTER PROCEDURE sp_CancelarCita
    @id_cita INT
AS
BEGIN
    UPDATE citas
    SET estado = 'cancelada'
    WHERE id_cita = @id_cita;
END
GO


/* =========================================================
   CRUD - SALAS
   ========================================================= */
   --Craer
CREATE OR ALTER PROCEDURE sp_InsertarSala
    @nombre VARCHAR(100),
    @ubicacion VARCHAR(150),
    @capacidad INT,
    @estado VARCHAR(30)
AS
BEGIN
    INSERT INTO salas(nombre,ubicacion,capacidad,estado)
    VALUES(@nombre,@ubicacion,@capacidad,@estado);
    SELECT SCOPE_IDENTITY() AS id_sala;
END
GO
--Lista de todas las salas 
CREATE OR ALTER PROCEDURE sp_ObtenerSalas
AS
BEGIN
    SELECT
        s.*,
        COUNT(i.id_ingreso) AS pacientes_activos
    FROM salas s
    LEFT JOIN ingresos i
        ON s.id_sala = i.id_sala
        AND i.estado = 'activo'
    GROUP BY
        s.id_sala,s.nombre,s.ubicacion,s.capacidad,s.estado
    ORDER BY s.nombre;
END
GO
--Lista de salas disponinles 
CREATE OR ALTER PROCEDURE sp_ObtenerSalasDisponibles
AS
BEGIN
    SELECT
        s.*,
        COUNT(i.id_ingreso) AS ocupacion
    FROM salas s
    LEFT JOIN ingresos i
        ON s.id_sala = i.id_sala
        AND i.estado = 'activo'
    WHERE s.estado = 'disponible'
    GROUP BY
        s.id_sala,s.nombre,s.ubicacion,s.capacidad,s.estado
    HAVING COUNT(i.id_ingreso) < s.capacidad
    ORDER BY s.nombre;
END
GO
-- buscar salas 
CREATE OR ALTER PROCEDURE sp_ObtenerSalaPorId
    @id_sala INT
AS
BEGIN
    SELECT *
    FROM salas
    WHERE id_sala = @id_sala;
END
GO
--Actualizar 
CREATE OR ALTER PROCEDURE sp_ActualizarSala
    @id_sala INT,
    @nombre VARCHAR(100),
    @ubicacion VARCHAR(150),
    @capacidad INT,
    @estado VARCHAR(30)
AS
BEGIN
    UPDATE salas
    SET nombre = @nombre,
        ubicacion = @ubicacion,
        capacidad = @capacidad,
        estado = @estado
    WHERE id_sala = @id_sala;
END
GO
--Desactivar sala 
CREATE OR ALTER PROCEDURE sp_DesactivarSala
    @id_sala INT
AS
BEGIN
    UPDATE salas
    SET estado = 'mantenimiento'
    WHERE id_sala = @id_sala;
END
GO


/* =========================================================
   CRUD - EMERGENCIAS
   ========================================================= */
   --crear
CREATE OR ALTER PROCEDURE sp_CrearEmergencia
    @id_paciente INT,
    @id_evaluacion INT = NULL,
    @latitud DECIMAL(10,7),
    @longitud DECIMAL(10,7),
    @descripcion VARCHAR(1000)
AS
BEGIN
    INSERT INTO emergencias
    (id_paciente,id_evaluacion,latitud,longitud,descripcion)
    VALUES
    (@id_paciente,@id_evaluacion,@latitud,@longitud,@descripcion);

    SELECT SCOPE_IDENTITY() AS id_emergencia;
END
GO
--Listar emergencias 
CREATE OR ALTER PROCEDURE sp_ObtenerEmergencias
AS
BEGIN
    SELECT
        em.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        p.telefono
    FROM emergencias em
    INNER JOIN pacientes p
        ON em.id_paciente = p.id_paciente
    ORDER BY
        CASE em.prioridad
            WHEN 'critica' THEN 1
            WHEN 'alta' THEN 2
            WHEN 'media' THEN 3
            ELSE 4
        END,
        em.fecha_hora DESC;
END
GO
--Listar emergencias de pacientes 
CREATE OR ALTER PROCEDURE sp_ObtenerEmergenciasPendientes
AS
BEGIN
    SELECT
        em.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        p.telefono
    FROM emergencias em
    INNER JOIN pacientes p
        ON em.id_paciente = p.id_paciente
    WHERE em.estado = 'pendiente'
    ORDER BY
        CASE em.prioridad
            WHEN 'critica' THEN 1
            WHEN 'alta' THEN 2
            WHEN 'media' THEN 3
            ELSE 4
        END,
        em.fecha_hora;
END
GO
--verificacion de emergencia 
CREATE OR ALTER PROCEDURE sp_VerificarEmergencia
    @id_emergencia INT,
    @id_usuario INT
AS
BEGIN
    UPDATE emergencias
    SET estado = 'verificada',
        fecha_verificacion = GETDATE(),
        verificado_por = @id_usuario
    WHERE id_emergencia = @id_emergencia
      AND estado = 'pendiente';
END
GO
--Actulizar el estado de la emergencia 
CREATE OR ALTER PROCEDURE sp_ActualizarEstadoEmergencia
    @id_emergencia INT,
    @estado VARCHAR(30)
AS
BEGIN
    UPDATE emergencias
    SET estado = @estado
    WHERE id_emergencia = @id_emergencia;
END
GO
--Cancelar
CREATE OR ALTER PROCEDURE sp_CancelarEmergencia
    @id_emergencia INT
AS
BEGIN
    UPDATE emergencias
    SET estado = 'cancelada'
    WHERE id_emergencia = @id_emergencia;
END
GO


/* =========================================================
   CRUD - INGRESOS
   ========================================================= */
CREATE OR ALTER PROCEDURE sp_RegistrarIngreso
    @id_paciente INT,
    @id_medico_responsable INT,
    @id_sala INT,
    @id_emergencia INT = NULL,
    @motivo_ingreso VARCHAR(500),
    @diagnostico VARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ocupacion INT;
    DECLARE @capacidad INT;

    SELECT @capacidad = capacidad
    FROM salas
    WHERE id_sala = @id_sala;

    SELECT @ocupacion = COUNT(*)
    FROM ingresos
    WHERE id_sala = @id_sala
      AND estado = 'activo';

    IF @ocupacion >= @capacidad
    BEGIN
        RAISERROR('La sala seleccionada no tiene capacidad disponible.', 16, 1);
        RETURN;
    END;

    INSERT INTO ingresos
    (
        id_paciente,
        id_medico_responsable,
        id_sala,
        id_emergencia,
        motivo_ingreso,
        diagnostico
    )
    VALUES
    (
        @id_paciente,
        @id_medico_responsable,
        @id_sala,
        @id_emergencia,
        @motivo_ingreso,
        @diagnostico
    );

    SELECT SCOPE_IDENTITY() AS id_ingreso;
END
GO
--listar
CREATE OR ALTER PROCEDURE sp_ObtenerIngresos
AS
BEGIN
    SELECT
        i.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        CONCAT(m.nombre,' ',m.apellido) AS medico,
        s.nombre AS sala
    FROM ingresos i
    INNER JOIN pacientes p ON i.id_paciente = p.id_paciente
    LEFT JOIN medicos m ON i.id_medico_responsable = m.id_medico
    LEFT JOIN salas s ON i.id_sala = s.id_sala
    ORDER BY i.fecha_ingreso DESC;
END
GO
--Listar los activos 
CREATE OR ALTER PROCEDURE sp_ObtenerIngresosActivos
AS
BEGIN
    SELECT
        i.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        CONCAT(m.nombre,' ',m.apellido) AS medico,
        s.nombre AS sala
    FROM ingresos i
    INNER JOIN pacientes p ON i.id_paciente = p.id_paciente
    LEFT JOIN medicos m ON i.id_medico_responsable = m.id_medico
    LEFT JOIN salas s ON i.id_sala = s.id_sala
    WHERE i.estado = 'activo'
    ORDER BY i.fecha_ingreso DESC;
END
GO
--Buscar
CREATE OR ALTER PROCEDURE sp_ObtenerIngresoPorId
    @id_ingreso INT
AS
BEGIN
    SELECT
        i.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        CONCAT(m.nombre,' ',m.apellido) AS medico,
        s.nombre AS sala
    FROM ingresos i
    INNER JOIN pacientes p ON i.id_paciente = p.id_paciente
    LEFT JOIN medicos m ON i.id_medico_responsable = m.id_medico
    LEFT JOIN salas s ON i.id_sala = s.id_sala
    WHERE i.id_ingreso = @id_ingreso;
END
GO
--Dar de alta
CREATE OR ALTER PROCEDURE sp_DarAltaPaciente
    @id_ingreso INT,
    @diagnostico VARCHAR(1000) = NULL
AS
BEGIN
    UPDATE ingresos
    SET estado = 'alta',
        fecha_alta = GETDATE(),
        diagnostico = COALESCE(@diagnostico, diagnostico)
    WHERE id_ingreso = @id_ingreso
      AND estado = 'activo';
END
GO


/* =========================================================
   CRUD - MOVIMIENTOS DEL PACIENTE
   ========================================================= */
   --Craer movimeinto 
CREATE OR ALTER PROCEDURE sp_RegistrarMovimientoPaciente
    @id_ingreso INT,
    @id_sala_origen INT = NULL,
    @id_sala_destino INT,
    @motivo VARCHAR(300)
AS
BEGIN
    INSERT INTO movimientos_paciente
    (id_ingreso,id_sala_origen,id_sala_destino,motivo)
    VALUES
    (@id_ingreso,@id_sala_origen,@id_sala_destino,@motivo);

    UPDATE ingresos
    SET id_sala = @id_sala_destino,
        estado = CASE
                    WHEN estado = 'transferido'
                    THEN 'activo'
                    ELSE estado
                 END
    WHERE id_ingreso = @id_ingreso;

    SELECT SCOPE_IDENTITY() AS id_movimiento;
END
GO
--Buscar movimiento 
CREATE OR ALTER PROCEDURE sp_ObtenerMovimientosPaciente
    @id_ingreso INT
AS
BEGIN
    SELECT
        mp.*,
        so.nombre AS sala_origen,
        sd.nombre AS sala_destino
    FROM movimientos_paciente mp
    LEFT JOIN salas so ON mp.id_sala_origen = so.id_sala
    INNER JOIN salas sd ON mp.id_sala_destino = sd.id_sala
    WHERE mp.id_ingreso = @id_ingreso
    ORDER BY mp.fecha_hora DESC;
END
GO


/* =========================================================
   CRUD - TRATAMIENTOS
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_InsertarTratamiento
    @id_ingreso INT,
    @id_medico INT,
    @nombre VARCHAR(150),
    @descripcion VARCHAR(1000)
AS
BEGIN
    INSERT INTO tratamientos
    (id_ingreso,id_medico,nombre,descripcion)
    VALUES
    (@id_ingreso,@id_medico,@nombre,@descripcion);

    SELECT SCOPE_IDENTITY() AS id_tratamiento;
END
GO
--listar
CREATE OR ALTER PROCEDURE sp_ObtenerTratamientos
AS
BEGIN
    SELECT
        t.*,
        CONCAT(m.nombre,' ',m.apellido) AS medico
    FROM tratamientos t
    INNER JOIN medicos m ON t.id_medico = m.id_medico
    ORDER BY t.fecha_inicio DESC;
END
GO
--Buscar
CREATE OR ALTER PROCEDURE sp_ObtenerTratamientosPorIngreso
    @id_ingreso INT
AS
BEGIN
    SELECT
        t.*,
        CONCAT(m.nombre,' ',m.apellido) AS medico
    FROM tratamientos t
    INNER JOIN medicos m ON t.id_medico = m.id_medico
    WHERE t.id_ingreso = @id_ingreso
    ORDER BY t.fecha_inicio DESC;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarTratamiento
    @id_tratamiento INT,
    @id_medico INT,
    @nombre VARCHAR(150),
    @descripcion VARCHAR(1000),
    @fecha_fin DATETIME2 = NULL,
    @estado VARCHAR(30)
AS
BEGIN
    UPDATE tratamientos
    SET id_medico = @id_medico,
        nombre = @nombre,
        descripcion = @descripcion,
        fecha_fin = @fecha_fin,
        estado = @estado
    WHERE id_tratamiento = @id_tratamiento;
END
GO


/* =========================================================
   CRUD - TRASLADOS
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_RegistrarTraslado
    @id_emergencia INT,
    @origen VARCHAR(300),
    @destino VARCHAR(300)
AS
BEGIN
    INSERT INTO traslados
    (id_emergencia,origen,destino)
    VALUES
    (@id_emergencia,@origen,@destino);

    SELECT SCOPE_IDENTITY() AS id_traslado;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerTraslados
AS
BEGIN
    SELECT
        t.*,
        CONCAT(p.nombre,' ',p.apellido) AS paciente
    FROM traslados t
    INNER JOIN emergencias e
        ON t.id_emergencia = e.id_emergencia
    INNER JOIN pacientes p
        ON e.id_paciente = p.id_paciente
    ORDER BY t.fecha_solicitud DESC;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarEstadoTraslado
    @id_traslado INT,
    @estado VARCHAR(30)
AS
BEGIN
    UPDATE traslados
    SET estado = @estado
    WHERE id_traslado = @id_traslado;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarFechasTraslado
    @id_traslado INT,
    @fecha_salida DATETIME2 = NULL,
    @fecha_llegada DATETIME2 = NULL
AS
BEGIN
    UPDATE traslados
    SET fecha_salida = @fecha_salida,
        fecha_llegada = @fecha_llegada
    WHERE id_traslado = @id_traslado;
END
GO


/* =========================================================
   CRUD - HISTORIAL CLÍNICO
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_RegistrarHistorialClinico
    @id_paciente INT,
    @id_medico INT = NULL,
    @id_cita INT = NULL,
    @id_ingreso INT = NULL,
    @motivo VARCHAR(500),
    @diagnostico VARCHAR(1000),
    @observaciones VARCHAR(2000)
AS
BEGIN
    INSERT INTO historial_clinico
    (id_paciente,id_medico,id_cita,id_ingreso,motivo,diagnostico,observaciones)
    VALUES
    (@id_paciente,@id_medico,@id_cita,@id_ingreso,
     @motivo,@diagnostico,@observaciones);

    SELECT SCOPE_IDENTITY() AS id_historial;
END
GO
--Listar
CREATE OR ALTER PROCEDURE sp_ObtenerHistorialClinico
    @id_paciente INT
AS
BEGIN
    SELECT
        h.*,
        CONCAT(m.nombre,' ',m.apellido) AS medico
    FROM historial_clinico h
    LEFT JOIN medicos m
        ON h.id_medico = m.id_medico
    WHERE h.id_paciente = @id_paciente
    ORDER BY h.fecha_hora DESC;
END
GO
--Actualizar
CREATE OR ALTER PROCEDURE sp_ActualizarHistorialClinico
    @id_historial INT,
    @id_medico INT = NULL,
    @motivo VARCHAR(500),
    @diagnostico VARCHAR(1000),
    @observaciones VARCHAR(2000)
AS
BEGIN
    UPDATE historial_clinico
    SET id_medico = @id_medico,
        motivo = @motivo,
        diagnostico = @diagnostico,
        observaciones = @observaciones
    WHERE id_historial = @id_historial;
END
GO


/* =========================================================
   PROCEDIMIENTO DE LOGIN
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_Login
    @nombre_usuario VARCHAR(50),
    @password_hash VARCHAR(255)
AS
BEGIN
    SELECT
        id_usuario,
        nombre_usuario,
        rol,
        activo
    FROM usuarios
    WHERE nombre_usuario = @nombre_usuario
      AND password_hash = @password_hash
      AND activo = 1;
END
GO


/* =========================================================
   PROCEDIMIENTO ESPECIAL:
   RECOMENDAR MÉDICOS SEGÚN ESPECIALIDAD
   ========================================================= */
   --Crear
CREATE OR ALTER PROCEDURE sp_MedicosPorEspecialidad
    @id_especialidad INT
AS
BEGIN
    SELECT
        m.id_medico,
        CONCAT(m.nombre,' ',m.apellido) AS medico,
        e.nombre AS especialidad,
        m.anos_experiencia,
        m.disponible
    FROM medicos m
    INNER JOIN especialidades e
        ON m.id_especialidad = e.id_especialidad
    WHERE m.id_especialidad = @id_especialidad
      AND m.activo = 1
    ORDER BY m.disponible DESC, m.anos_experiencia DESC;
END
GO


/* =========================================================
   PROCEDIMIENTO ESPECIAL:
   RESUMEN DEL PACIENTE
   ========================================================= */
   --Resumen del paciente
CREATE OR ALTER PROCEDURE sp_ResumenPaciente
    @id_paciente INT
AS
BEGIN

    SELECT
        p.id_paciente,
        p.numero_expediente,
        CONCAT(p.nombre,' ',p.apellido) AS paciente,
        p.fecha_nacimiento,
        p.genero,
        p.tipo_sangre,
        p.alergias,
        p.telefono
    FROM pacientes p
    WHERE p.id_paciente = @id_paciente;

    SELECT
        COUNT(*) AS total_citas
    FROM citas
    WHERE id_paciente = @id_paciente;

    SELECT
        COUNT(*) AS total_ingresos
    FROM ingresos
    WHERE id_paciente = @id_paciente;

    SELECT
        COUNT(*) AS total_emergencias
    FROM emergencias
    WHERE id_paciente = @id_paciente;

    SELECT
        COUNT(*) AS total_evaluaciones
    FROM evaluaciones
    WHERE id_paciente = @id_paciente;

    SELECT
        COUNT(*) AS registros_historial
    FROM historial_clinico
    WHERE id_paciente = @id_paciente;

END
GO


/* =========================================================
   PROCEDIMIENTO ESPECIAL:
   DASHBOARD DE LÁZARO
   ========================================================= */
   --Dasborad 
CREATE OR ALTER PROCEDURE sp_DashboardHospital
AS
BEGIN

    SELECT
        (SELECT COUNT(*) FROM pacientes WHERE activo = 1)
            AS pacientes_activos,

        (SELECT COUNT(*) FROM medicos
         WHERE activo = 1 AND disponible = 1)
            AS medicos_disponibles,

        (SELECT COUNT(*) FROM citas
         WHERE CAST(fecha_hora AS DATE) = CAST(GETDATE() AS DATE)
         AND estado NOT IN ('cancelada','completada'))
            AS citas_hoy,

        (SELECT COUNT(*) FROM ingresos
         WHERE estado = 'activo')
            AS pacientes_hospitalizados,

        (SELECT COUNT(*) FROM emergencias
         WHERE estado IN ('pendiente','verificada','ambulancia_asignada','en_camino'))
            AS emergencias_activas,

        (SELECT COUNT(*) FROM salas
         WHERE estado = 'mantenimiento')
            AS salas_mantenimiento;

END
GO


/* =========================================================
   FIN DEL SCRIPT
   ========================================================= */

PRINT '==============================================';
PRINT 'BASE DE DATOS LÁZARO CREADA CORRECTAMENTE';
PRINT 'TABLAS Y PROCEDIMIENTOS ALMACENADOS CREADOS';
PRINT '==============================================';
GO