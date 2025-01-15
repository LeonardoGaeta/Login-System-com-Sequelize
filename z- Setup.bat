@echo off

:: Instalar dependencias do backend
echo Instalando dependencias do backend...
cd backend 
call npm i
cd ..

:: Instalar dependencias do frontend
echo Instalando dependências do frontend...
cd frontend 
call npm i
cd ..

:: Instalar concurrently na pasta raiz.
echo Instalando Concurrently.
call npm i 

:: Inicializa ambos os lados
echo Inicializando!
npm run start