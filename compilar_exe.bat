@echo off
REM Compila el .exe y los instaladores de Fut Starzz para Windows.
REM
REM Hace falta este .bat y no alcanza con "npm run desktop:build" porque el linker de Microsoft
REM necesita las rutas del Windows SDK en el entorno, y eso lo prepara vcvars64.bat. Sin esa linea
REM la compilacion llega hasta el final y muere con "LNK1181: no se puede abrir dbghelp.lib",
REM aunque el archivo este instalado -- el linker simplemente no sabe donde buscarlo.
REM
REM Resultado en src-tauri\target\release\bundle\:
REM   nsis\*.exe   instalador (el que se reparte)
REM   msi\*.msi    instalador MSI
REM   ..\futstarzz.exe  el ejecutable suelto

call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat" >nul
set "PATH=%PATH%;%USERPROFILE%\.cargo\bin"
cd /d "%~dp0"
npx tauri build
