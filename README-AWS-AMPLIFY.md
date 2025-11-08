# Universo Hogara - Despliegue en AWS Amplify

## 📋 Pasos para desplegar en AWS Amplify

### 1. Subir a GitHub
```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit - Universo Hogara"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/TU-USUARIO/universo-hogara.git
git branch -M main
git push -u origin main
```

### 2. Configurar AWS Amplify
1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click en "New app" → "Host web app"
3. Selecciona "GitHub" y autoriza
4. Selecciona tu repositorio "universo-hogara"
5. Configura las variables de entorno:
   - `DATABASE_URL`: Tu URL de PostgreSQL
   - `NEXTAUTH_SECRET`: Genera uno con `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Tu URL de Amplify (se mostrará después)
   - Otras variables de tu `.env`

### 3. Build settings
AWS Amplify detectará automáticamente `amplify.yml` y usará:
- Node.js 18+
- Yarn como package manager
- Next.js build automático

### 4. Desplegar
Click en "Save and deploy" y espera 5-10 minutos.

## 📝 Variables de entorno requeridas

Copia estas variables en AWS Amplify Console:
```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=tu-secret-aqui
NEXTAUTH_URL=https://tu-app.amplifyapp.com
AWS_BUCKET_NAME=tu-bucket
AWS_FOLDER_PREFIX=uploads/
```

## 🎯 Verificación
Después del despliegue, verifica:
- ✅ Página principal carga correctamente
- ✅ Imagen de fondo "fondo web principal.png" se muestra
- ✅ Planetas interactivos funcionan
- ✅ Blog carga correctamente

## 📞 Soporte
Para problemas de despliegue, revisa los logs en AWS Amplify Console.
