// js/quiz-engine.js

document.addEventListener("DOMContentLoaded", async () => {
  const quizFile = localStorage.getItem('quizFile');
  let quiz = null;

  // === 1. Si es un quiz subido (simulado en "subido/...")
  if (quizFile && quizFile.startsWith('subido/')) {
    const quizDataStr = localStorage.getItem('quizData');
    if (!quizDataStr) {
      console.error('quizData no encontrado en localStorage');
      alert('Error: No se pudo cargar el contenido del quiz. Vuelve a subirlo.');
      return window.location.href = 'menu-quizzes.html';
    }
    try {
      quiz = JSON.parse(quizDataStr);
    } catch (e) {
      console.error('Error al parsear quizData:', e);
      alert('Error: El contenido del quiz está corrupto.');
      return window.location.href = 'menu-quizzes.html';
    }
  }
  // === 2. Si es un quiz estático (desde carpeta /data)
  else {
    if (!quizFile) {
      alert('No se especificó un quiz.');
      return window.location.href = 'menu-quizzes.html';
    }
    try {
      const res = await fetch(`data/${quizFile}`);
      if (!res.ok) throw new Error('Archivo no encontrado');
      quiz = await res.json();
    } catch (e) {
      console.error('Error al cargar el archivo:', e);
      alert('No se pudo cargar el quiz. Verifica que el archivo exista.');
      return window.location.href = 'menu-quizzes.html';
    }
  }

  // === 3. Validar que el quiz tenga preguntas
  if (!quiz || !Array.isArray(quiz.preguntas) || quiz.preguntas.length === 0) {
    alert('El quiz está vacío o tiene un formato incorrecto.');
    return window.location.href = 'menu-quizzes.html';
  }

  // === 4. Inicializar variables
  let currentQ = 0;
  let respuestas = [];
  let logros = [];
  const totalPreguntas = quiz.preguntas.length;

  // === 5. Función: Actualizar barra de progreso
  const actualizarProgreso = () => {
    const porcentaje = (currentQ / totalPreguntas) * 100;
    document.getElementById('progress').style.width = `${porcentaje}%`;
  };

  // === 6. Función: Mostrar pregunta actual
  const mostrarPregunta = () => {
    const q = quiz.preguntas[currentQ];
    document.getElementById('texto-aprendizaje').textContent = q.intro;
    document.getElementById('pregunta-texto').textContent = q.question;

    // Limpiar botones anteriores
    const respuestasEl = document.getElementById('respuestas');
    respuestasEl.innerHTML = '';

    q.options.forEach((opc, i) => {
      const btn = document.createElement('button');
      btn.className = 'respuesta-btn';
      btn.textContent = opc;
      btn.dataset.index = i;
      btn.onclick = () => {
        document.querySelectorAll('.respuesta-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
      respuestasEl.appendChild(btn);
    });

    // Mostrar número de pregunta
    const header = document.querySelector('#pregunta-seccion h2');
    const numEl = document.createElement('div');
    numEl.className = 'pregunta-num';
    numEl.textContent = `Pregunta ${currentQ + 1} de ${totalPreguntas}`;
    header.parentNode.insertBefore(numEl, header);

    // Mostrar botón Validar y Saber más
    document.getElementById('btn-validar').style.display = 'block';
    document.getElementById('btn-validar').disabled = false;
    document.getElementById('saber-mas').style.display = 'inline';

    // Ocultar pantalla final
    document.getElementById('final-screen').style.display = 'none';
  };

  // === 7. Validar respuesta
  document.getElementById('btn-validar').addEventListener('click', () => {
    const selectedBtn = document.querySelector('.respuesta-btn.selected');
    if (!selectedBtn) return alert('Selecciona una respuesta');

    const selectedIndex = parseInt(selectedBtn.dataset.index);
    const correctIndices = quiz.preguntas[currentQ].correct;
    const esCorrecta = correctIndices.includes(selectedIndex);

    // Marcar respuestas
    document.querySelectorAll('.respuesta-btn').forEach((btn, i) => {
      if (correctIndices.includes(i)) {
        btn.classList.add('correcta');
      } else if (i === selectedIndex && !esCorrecta) {
        btn.classList.add('incorrecta');
      }
    });

    // Guardar respuesta
    respuestas.push(esCorrecta);

    // Desactivar botón
    document.getElementById('btn-validar').style.display = 'none';

    // Logros
    if (currentQ === 0 && !logros.includes('Primer Quiz Completo')) {
      logros.push('Primer Quiz Completo');
    }
    if (respuestas.length >= 3 && respuestas.slice(-3).every(r => r) && !logros.includes('3 Respuestas seguidas correctas')) {
      logros.push('3 Respuestas seguidas correctas');
    }

    // Saber más
    document.getElementById('saber-mas').onclick = () => {
      document.getElementById('explicacion-extra').innerHTML = quiz.preguntas[currentQ].saber_mas;
      document.getElementById('modal').style.display = 'flex';
    };

    // Avanzar o finalizar
    if (currentQ < totalPreguntas - 1) {
      setTimeout(() => {
        currentQ++;
        mostrarPregunta();
        actualizarProgreso();
      }, 1500);
    } else {
      finalizarQuiz();
    }
  });

  // === 8. Modal "Saber más"
  document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
  };
  window.onclick = (e) => {
    if (e.target === document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
  };

  // === 9. Navegación
  document.getElementById('btn-inicio').onclick = () => {
    window.location.href = 'index.html';
  };
  document.getElementById('btn-menu').onclick = () => {
    window.location.href = 'menu-quizzes.html';
  };

  // === 10. Pantalla final
  const finalizarQuiz = () => {
    const aciertos = respuestas.filter(r => r).length;
    const porcentaje = (aciertos / totalPreguntas) * 100;

    document.getElementById('resultado-final').textContent
