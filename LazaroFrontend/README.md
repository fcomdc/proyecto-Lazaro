# 🏥 Lázaro

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.81-blue?style=for-the-badge&logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/C%23-Backend-purple?style=for-the-badge&logo=csharp" alt="C#">
  <img src="https://img.shields.io/badge/SQL%20Server-Database-red?style=for-the-badge&logo=microsoftsqlserver" alt="SQL Server">
</p>

<p align="center">
  <strong>Sistema de apoyo para la atención y gestión hospitalaria</strong>
</p>

---

## 📖 Descripción

**Lázaro** es un sistema de software diseñado para brindar apoyo durante el proceso de atención hospitalaria, facilitando la comunicación entre el paciente y el personal médico.

El proyecto busca mejorar el proceso de atención desde el momento en que una persona necesita asistencia médica hasta su llegada al hospital, permitiendo que determinada información pueda ser registrada y consultada previamente.

Lázaro está compuesto por una aplicación móvil y un sistema backend conectado a una base de datos, permitiendo gestionar información relacionada con pacientes, médicos, citas y expedientes clínicos.

Esta pensado como proyecto final de la carrera

---

## 🎯 Objetivos

- Facilitar el registro de información del paciente.
- Mejorar la comunicación entre el paciente y el hospital.
- Permitir la gestión de pacientes y expedientes clínicos.
- Facilitar la consulta de médicos y especialistas disponibles.
- Gestionar citas médicas.
- Permitir que el personal hospitalario pueda consultar información relevante del paciente.
- Reducir el tiempo necesario para recopilar información durante el proceso de atención.

---

## 📱 Aplicación móvil

La aplicación móvil está desarrollada utilizando **React Native**.

Entre sus principales funciones se encuentran:

- 👤 Registro y gestión de pacientes.
- 🏥 Consulta de información hospitalaria.
- 👨‍⚕️ Consulta de médicos y especialistas.
- 📅 Consulta de citas.
- 📋 Registro de información para la atención médica.
- 📑 Consulta de información relacionada con el expediente clínico.
- 🚑 Funciones relacionadas con situaciones de emergencia.
- 📍 Uso de ubicación para determinadas funciones del sistema.

---

## 🖥️ Backend

El backend se encarga de procesar las solicitudes de la aplicación móvil y comunicarse con la base de datos.

El proyecto utiliza tecnologías del ecosistema de **.NET y C#** para desarrollar los servicios necesarios para el funcionamiento del sistema.

El backend permite:

- Gestionar pacientes.
- Gestionar médicos.
- Gestionar citas.
- Gestionar expedientes clínicos.
- Consultar información hospitalaria.
- Realizar operaciones CRUD.
- Conectar la aplicación móvil con la base de datos.
- Validar y procesar la información enviada por los usuarios.

---

## 🗄️ Base de datos

Lázaro utiliza **Microsoft SQL Server** como sistema gestor de base de datos.

La base de datos almacena la información necesaria para el funcionamiento del sistema, incluyendo:

- Pacientes
- Médicos
- Especialidades
- Citas
- Expedientes clínicos
- Procedimientos médicos
- Usuarios
- Hospitales
- Información relacionada con la atención médica

Además, el proyecto utiliza **procedimientos almacenados** para realizar diferentes operaciones sobre la base de datos.

---

## 🛠️ Tecnologías utilizadas

### Aplicación móvil

- **React Native**
- **TypeScript**
- **JavaScript**
- **React Navigation**
- **Fetch / API REST**

### Backend

- **C#**
- **.NET**
- **ASP.NET Core**
- **Entity Framework Core**
- **API REST**
- **Swagger**

### Base de datos

- **Microsoft SQL Server**
- **T-SQL**
- **Procedimientos almacenados**

### Herramientas

- **Visual Studio**
- **Visual Studio Code**
- **Android Studio**
- **Git**
- **GitHub**
- **Node.js**
- **npm**

---

# 📂 Estructura del proyecto

Una estructura general del proyecto es:

```text
Lazaro/
│
├── LazaroFrontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── screens/
│   │   └── ...
│   │
│   ├── android/
│   ├── ios/
│   ├── App.tsx
│   ├── package.json
│   └── ...
│
├── LazaroBackend/
│   │
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   ├── Program.cs
│   ├── appsettings.json
│   └── ...
│
├── Database/
│   ├── Tables/
│   ├── Procedures/
│   └── LazaroDB.sql
│
└── README.md
```

> La estructura puede variar dependiendo de la versión actual del proyecto.

---

# ⚙️ Requisitos

Antes de ejecutar Lázaro debes tener instalado:

- **Node.js**
- **npm**
- **React Native**
- **JDK**
- **Android Studio**
- **Android SDK**
- **.NET SDK**
- **Visual Studio o Visual Studio Code**
- **Microsoft SQL Server**
- **SQL Server Management Studio (SSMS)**
- **Git**

Para ejecutar la aplicación Android también es necesario configurar correctamente el entorno de desarrollo de React Native.

---

# 🚀 Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/Lazaro.git
```

Entrar al proyecto:

```bash
cd Lazaro
```

---

## 2. Configurar el backend

Entrar a la carpeta del backend:

```bash
cd LazaroBackend
```

Restaurar las dependencias:

```bash
dotnet restore
```

Configurar la cadena de conexión a SQL Server en:

```text
appsettings.json
```

Ejemplo:

```json
{
  "ConnectionStrings": {
    "LazaroDB": "Server=localhost;Database=LazaroDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Después ejecutar el backend:

```bash
dotnet run
```

Una vez iniciado, el backend estará disponible en la dirección indicada por ASP.NET Core.

---

# 🗄️ Configuración de la base de datos

1. Abrir **SQL Server Management Studio**.
2. Conectarse a la instancia de SQL Server.
3. Ejecutar el script de creación de la base de datos.
4. Verificar que la base de datos `LazaroDB` haya sido creada correctamente.
5. Verificar que las tablas y procedimientos almacenados estén disponibles.
6. Comprobar que la cadena de conexión del backend corresponda con la instancia utilizada.

---

# 📱 Ejecutar la aplicación móvil

Entrar al frontend:

```bash
cd LazaroFrontend
```

Instalar las dependencias:

```bash
npm install
```

---

## ▶️ Iniciar Metro

Ejecutar:

```bash
npm start
```

Metro es el servidor de desarrollo utilizado por React Native para procesar y cargar el código JavaScript/TypeScript de la aplicación.

---

## 🤖 Ejecutar en Android

Con un emulador iniciado o un dispositivo Android conectado:

```bash
npm run android
```

También puedes utilizar:

```bash
npx react-native run-android
```

---

## 🍎 Ejecutar en iOS

> Esta sección está destinada principalmente a equipos macOS.

Instalar las dependencias de CocoaPods:

```bash
bundle install
```

Después:

```bash
bundle exec pod install
```

Finalmente:

```bash
npm run ios
```

---

# 🔌 Comunicación entre frontend y backend

La aplicación móvil se comunica con el backend mediante una **API REST**.

El flujo general del sistema es:

```text
┌─────────────────────┐
│   Aplicación móvil  │
│    React Native     │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│       Backend       │
│   ASP.NET Core/C#   │
└──────────┬──────────┘
           │
           │ Entity Framework
           ▼
┌─────────────────────┐
│    SQL Server       │
│      LazaroDB       │
└─────────────────────┘
```

---

# 👨‍⚕️ Módulos principales

### 👤 Pacientes

Permite registrar, consultar y administrar información de los pacientes.

### 👨‍⚕️ Médicos

Permite gestionar médicos y especialistas disponibles dentro del sistema.

### 🩺 Especialidades

Permite organizar los médicos según su especialidad.

### 📅 Citas

Permite administrar y consultar las citas médicas.

### 📋 Expedientes clínicos

Permite almacenar y consultar información relacionada con la atención médica del paciente.

### 🏥 Hospital

Permite administrar información necesaria para la atención y organización hospitalaria.

### 🚑 Emergencias

El sistema contempla funciones orientadas a situaciones de emergencia, utilizando información proporcionada por el usuario y, cuando corresponde, datos de ubicación para facilitar la atención.

> Las funciones de emergencia están planteadas como herramientas de apoyo y no sustituyen la evaluación o intervención de personal médico.

---

# 🔐 Seguridad

El proyecto contempla el manejo de información relacionada con pacientes y personal médico, por lo que en un entorno real se deben implementar medidas adicionales de seguridad, tales como:

- Autenticación de usuarios.
- Autorización basada en roles.
- Protección de credenciales.
- Cifrado de información sensible.
- Validación de datos.
- Protección de la API.
- Control de acceso a expedientes clínicos.
- Manejo seguro de información personal.

**Importante:** no se deben subir al repositorio contraseñas, claves privadas ni cadenas de conexión que contengan credenciales reales.

---

# 🧪 Desarrollo

Durante el desarrollo, React Native cuenta con **Fast Refresh**, lo que permite visualizar rápidamente los cambios realizados en el código.

Para realizar una recarga completa de la aplicación en Android puedes utilizar el menú de desarrollo o recargar la aplicación desde el emulador/dispositivo.

---

# 🐛 Solución de problemas

### El comando `npm run android` no funciona

Verifica que:

- Android Studio esté instalado.
- El Android SDK esté configurado.
- Exista un emulador iniciado o un dispositivo conectado.
- Las variables de entorno de Android estén correctamente configuradas.
- Las dependencias hayan sido instaladas con:

```bash
npm install
```

---

### El backend no inicia

Comprueba:

```bash
dotnet --version
```

Después:

```bash
dotnet restore
dotnet run
```

También verifica la cadena de conexión de SQL Server.

---

### La aplicación no puede conectarse al backend

Comprueba que:

1. El backend esté ejecutándose.
2. El dispositivo/emulador tenga acceso al servidor.
3. La dirección IP y el puerto configurados sean correctos.
4. La URL utilizada por la aplicación corresponda al entorno donde se está ejecutando.

> En un emulador Android, `localhost` normalmente hace referencia al propio emulador y no al equipo donde está ejecutándose el backend.

---

# 📌 Estado del proyecto

🚧 **Proyecto en desarrollo**

Lázaro continúa en proceso de desarrollo y pueden existir funcionalidades pendientes, cambios en la arquitectura o modificaciones en los módulos existentes.

---

# 👨‍💻 Autor

**Francisco Medina**

Proyecto académico desarrollado como propuesta de sistema de apoyo para la gestión y atención hospitalaria.

---

# 📄 Licencia

Este proyecto fue desarrollado con fines **académicos y educativos**.

---

## 📚 Recursos

- [Documentación de React Native](https://reactnative.dev/docs/getting-started)
- [Documentación de React Navigation](https://reactnavigation.org/)
- [Documentación de .NET](https://learn.microsoft.com/dotnet/)
- [Documentación de ASP.NET Core](https://learn.microsoft.com/aspnet/core/)
- [Documentación de Entity Framework Core](https://learn.microsoft.com/ef/core/)
- [Documentación de SQL Server](https://learn.microsoft.com/sql/)
- [Documentación de Git](https://git-scm.com/doc)

---

<p align="center">
  🏥 <strong>Lázaro — Tecnología al servicio de la atención hospitalaria</strong>
</p>
