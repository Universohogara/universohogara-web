# 🚀 Guía Rápida: Subir Universo Hogara a AWS Amplify

## ✅ Estado Actual
- ✓ Repositorio Git inicializado
- ✓ Imagen "fondo web principal.png" incluida (3.7 MB)
- ✓ Código completo de universohogara.com
- ✓ Configuración amplify.yml lista
- ✓ 866 archivos preparados para despliegue

## 📍 Ubicación del Proyecto
```
/home/ubuntu/aws-amplify-export
```

## 🎯 Pasos para Desplegar (5 minutos)

### Paso 1: Crear Repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repositorio: `universo-hogara`
3. **NO marques** "Initialize with README"
4. Haz clic en "Create repository"

### Paso 2: Subir el Código
Copia y pega estos comandos en tu terminal:

```bash
cd /home/ubuntu/aws-amplify-export
git remote add origin https://github.com/TU-USUARIO/universo-hogara.git
git branch -M main
git push -u origin main
```

(Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub)

### Paso 3: Configurar AWS Amplify
1. Ve a https://console.aws.amazon.com/amplify/
2. Clic en "New app" → "Host web app"
3. Selecciona "GitHub"
4. Autoriza AWS Amplify a acceder a GitHub
5. Selecciona el repositorio "universo-hogara"
6. Branch: `main`

### Paso 4: Variables de Entorno
En AWS Amplify Console, agrega estas variables:

```
DATABASE_URL=postgresql://usuario:password@host:5432/database
NEXTAUTH_SECRET=(genera uno con: openssl rand -base64 32)
NEXTAUTH_URL=https://tu-app.amplifyapp.com
AWS_BUCKET_NAME=tu-bucket
AWS_FOLDER_PREFIX=uploads/
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Paso 5: Desplegar
1. Clic en "Save and deploy"
2. Espera 5-10 minutos
3. ¡Listo! Tu app estará en línea

## 🔍 Verificación
- ✅ La imagen "fondo web principal.png" está incluida
- ✅ MD5: Verificado correctamente
- ✅ Todos los archivos de código presentes
- ✅ Configuración de Amplify incluida

## 📞 Soporte
Si tienes problemas, revisa los logs en AWS Amplify Console.

---
**Fecha de preparación:** 8 de noviembre de 2025
**Commit inicial:** "Initial commit - Universo Hogara para AWS Amplify"
