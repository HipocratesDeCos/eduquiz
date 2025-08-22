# 🎯 SuperQuiz - Plataforma de Aprendizaje Interactivo

Una plataforma web moderna para crear y realizar quizzes educativos con soporte para múltiples áreas de conocimiento.

## 🌟 Características Principales

- ✅ **Interfaz moderna y responsive** - Funciona en todos los dispositivos
- ✅ **Múltiples áreas de conocimiento** - Contabilidad, Economía, Marketing, etc.
- ✅ **Preguntas con múltiples respuestas** - Soporte para preguntas de opción única y múltiple
- ✅ **Sistema de validación inteligente** - Feedback inmediato para cada pregunta
- ✅ **Contenido enriquecido** - Texto formateado, fórmulas y ejemplos prácticos
- ✅ **Totalmente basado en JSON** - Fácil de expandir y mantener
- ✅ **Compatible con GitHub Pages** - Despliega automáticamente

## 🚀 Demo en Vivo

[Ver Demo](https://tuusuario.github.io/superquiz) *(Reemplaza con tu URL de GitHub Pages)*

## 📁 Estructura del Proyecto

```
superquiz/
├── 📄 index.html                 # Aplicación principal
├── 📄 .gitattributes            # Configuración para GitHub
├── 📄 README.md                 # Documentación
└── 📁 content/                  # Contenido de los quizzes
    ├── 📁 contabilidad/
    │   ├── 📄 index.json
    │   ├── 📄 contabilidad-basica.json
    │   ├── 📄 estados-financieros.json
    │   └── 📄 asientos-contables.json
    ├── 📁 analisis-economico-financiero/
    │   ├── 📄 index.json
    │   ├── 📄 analisis-financiero.json
    │   └── 📄 ratios-empresa.json
    ├── 📁 economia/
    │   ├── 📄 index.json
    │   ├── 📄 macroeconomia.json
    │   └── 📄 microeconomia.json
    └── 📁 marketing/
        ├── 📄 index.json
        ├── 📄 marketing-digital.json
        └── 📄 segmentacion-mercado.json
```

## 🛠️ Instalación y Configuración

### Opción 1: GitHub Pages (Recomendado)

1. **Fork o clona este repositorio**
   ```bash
   git clone https://github.com/tuusuario/superquiz.git
   cd superquiz
   ```

2. **Sube los archivos a tu repositorio de GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: SuperQuiz platform"
   git push origin main
   ```

3. **Activa GitHub Pages**
   - Ve a Settings → Pages
   - Selecciona "Deploy from a branch"
   - Elige "main" branch y "/ (root)"
   - ¡Listo! Tu quiz estará disponible en `https://tuusuario.github.io/superquiz`

### Opción 2: Servidor Local

```bash
# Usar Python (cualquier versión)
python -m http.server 8000
# o
python3 -m http.server 8000

# Usar Node.js
npx http-server

# Usar PHP
php -S localhost:8000
```

Luego visita `http://localhost:8000`

## 📝 Cómo Crear un Nuevo Quiz

### 1. Estructura Básica del JSON

Crea un archivo JSON en la carpeta correspondiente siguiendo esta estructura:

```json
{
  "title": "Título del Quiz",
  "description": "Descripción breve del contenido",
  "questions": [
    {
      "intro": "Texto introductorio opcional",
      "question": "¿Cuál es la pregunta?",
      "options": [
        "Opción 1",
        "Opción 2", 
        "Opción 3",
        "Opción 4"
      ],
      "correct": [0],
      "saber_mas": "Contenido HTML enriquecido con explicación detallada"
    }
  ]
}
```

### 2. Tipos de Preguntas

#### Pregunta de Opción Única
```json
{
  "question": "¿Cuál es la capital de España?",
  "options": ["Madrid", "Barcelona", "Sevilla", "Valencia"],
  "correct": [0]
}
```

#### Pregunta de Opción Múltiple
```json
{
  "question": "¿Cuáles son países europeos? (Selecciona todas las correctas)",
  "options": ["Francia", "Brasil", "Alemania", "México"],
  "correct": [0, 2]
}
```

### 3. Contenido Enriquecido en "Saber Más"

Puedes usar HTML en el campo `saber_mas`:

```json
{
  "saber_mas": "<p><strong>Explicación detallada:</strong></p><ul><li>Punto importante 1</li><li>Punto importante 2</li></ul><div class='formula'>Fórmula: A = B + C</div><p>Texto con <u>subrayado</u> y <strong>negrita</strong>.</p>"
}
```

## 🎨 Personalización

### Cambiar Colores y Estilos

Edita las variables CSS en la sección `<style>` del archivo `index.html`:

```css
/* Colores principales */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --button-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --success-color: #28a745;
  --error-color: #dc3545;
}
```

### Añadir Nueva Área de Conocimiento

1. **Crear carpeta**: `content/nueva-area/`
2. **Añadir botón** en `index.html`:
   ```html
   <button class="btn" onclick="showPage('menu-page', 'nueva-area')">
       🆕 NUEVA ÁREA
   </button>
   ```
3. **Actualizar función** `updateAreaTitle()` con el nuevo título

## 🔧 Resolución de Problemas

### Los archivos JSON no cargan

1. **Verifica la estructura de carpetas** - Asegúrate de que coincida exactamente
2. **Revisa el archivo `.gitattributes`** - Debe estar en la raíz del proyecto
3. **Valida el JSON** - Usa [jsonlint.com](https://jsonlint.com) para verificar sintaxis
4. **Comprueba la codificación** - Los archivos deben estar en UTF-8

### GitHub Pages no funciona

1. **Verifica que está activado** en Settings → Pages
2. **Espera unos minutos** - El despliegue puede tardar
3. **Revisa la rama** - Asegúrate de que está en `main` o `master`
4. **Comprueba la URL** - Debe ser `https://tuusuario.github.io/nombre-repositorio`

### Errores de carga en móviles

- Los archivos JSON deben tener **codificación UTF-8**
- El archivo `.gitattributes` debe estar configurado correctamente
- Verifica que no hay caracteres especiales corruptos

## 📊 Funcionalidades Técnicas

- **Progressive Web App** - Funciona offline después de la primera carga
- **Responsive Design** - Adaptado para móviles, tablets y desktop
- **Accesibilidad** - Cumple estándares WCAG básicos
- **Performance** - Carga rápida y optimizada
- **SEO Friendly** - Meta tags y estructura semántica

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

¿Necesitas ayuda? 

- 📧 **Email**: tu@email.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/tuusuario/superquiz/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/tuusuario/superquiz/discussions)

## 🚀 Roadmap

- [ ] Sistema de usuarios y progreso
- [ ] Exportación de resultados a PDF
- [ ] Modo offline completo
- [ ] Editor visual de preguntas
- [ ] Estadísticas avanzadas
- [ ] Integración con LMS

---

⭐ **¡Si te gusta este proyecto, dale una estrella en GitHub!** ⭐
