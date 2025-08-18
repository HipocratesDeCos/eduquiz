// js/quiz-engine.js

document.addEventListener("DOMContentLoaded", () => {
  // === 1. Intentar cargar el quiz desde localStorage
  const quizDataStr = localStorage.getItem('quizData');
  let quiz = null;

  if (!quizDataStr) {
    alert('Error: No se encontró el contenido del quiz. Por favor, vuelve a subirlo.');
    console.error('No se encontró quizData en localStorage');
    return (window.location.href = 'menu-quizzes.html');
  }

  try {
    quiz = JSON.parse(quizDataStr);
  } catch (e) {
    alert('Error: El contenido del quiz está corrupto. Vuelve a subir el archivo.');
    console.error('Error al parsear quizData:', e);
    return (window.location.href = 'menu-quizzes.html');
  }

  if (!quiz.preguntas || !Array.isArray(quiz.preguntas) || quiz.preguntas.length === 0) {
    alert('Error: El quiz no tiene preguntas válidas.');
    console.error('Quiz sin preguntas:', quiz);
    return (window.location.href = 'menu-quizzes.html');
  }

  // === 2. Variables del quiz
  let currentQ = 0;
  let respuestas = [];
  const totalPreguntas = quiz.preguntas.length;

  // === 3. Elementos del DOM
  const textoAprendizaje = document.getElementById('texto-aprendizaje');
  const preguntaTexto = document.getElementById('pregunta-texto');
  const respuestasGrid = document.getElementById('respuestas');
  const btnValidar = document.getElementById('btn-validar');
  const saberMas = document.getElementById('saber-mas');
  const progress = document.getElementById('progress');

  // === 4. Función: Actualizar progreso
  const actualizarProgreso = () => {
    const porcentaje = (currentQ / totalPreguntas) * 100;
    progress.style.width = `${porcentaje}%`;
  };

  // === 5. Función: Mostrar pregunta
  const mostrarPregunta = () => {
    const q = quiz.preguntas[currentQ];

    // Aseguramos que los campos existan
    textoAprendizaje.textContent = q.intro || q.introduccion || q.aprendizaje || 'No hay texto de repaso disponible.';
    preguntaTexto.textContent = q.question || q.pregunta || 'Pregunta no disponible.';

    // Limpiar opciones
    respuestasGrid.innerHTML = '';

    const opciones = Array.isArray(q.options) ? q.options : [];
    if (opciones.length === 0) {
      respuestasGrid.innerHTML = '<p>No hay opciones disponibles.</p>';
    } else {
      opciones.forEach((opc, i) => {
        const btn = document.createElement('button');
        btn.className = 'respuesta-btn';
        btn.textContent = opc;
        btn.dataset.index = i;
        btn.onclick = () => {
          document.querySelectorAll('.respuesta-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        };
        respuestasGrid.appendChild(btn);
      });
    }

    // Mostrar número de pregunta
    const header = preguntaTexto;
    const numEl = document.createElement('div');
    numEl.className = 'pregunta-num';
    numEl.textContent = `Pregunta ${currentQ + 1} de ${totalPreguntas}`;
    header.parentNode.insertBefore(numEl, header);

    // Mostrar botones
    btnValidar.style.display = 'block';
    btnValidar.disabled = false;
    saberMas.style.display = 'inline';

    // Ocultar pantalla final
    document.getElementById('final-screen').style.display = 'none';
  };

  // === 6. Validar respuesta
  btnValidar.addEventListener('click', () => {
    const selectedBtn = document.querySelector('.respuesta-btn.selected');
    if (!selectedBtn) {
      alert('Selecciona una respuesta');
      return;
    }

    const selectedIndex = parseInt(selectedBtn.dataset.index);
    const correctIndices = Array.isArray(q.correct) ? q.correct : [q.correct];
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
    btnValidar.style.display = 'none';

    // Saber más
    const saberMasText = q.saber_mas || q.explicacion || '<p>No hay explicación adicional disponible.</p>';
    saberMas.onclick = () => {
      document.getElementById('explicacion-extra').innerHTML = saberMasText;
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

  // === 7. Modal "Saber más"
  document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
  };
  window.onclick = (e) => {
    if (e.target === document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
  };

  // === 8. Navegación
  document.getElementById('btn-inicio').onclick = () => {
    window.location.href = 'index.html';
  };
  document.getElementById('btn-menu').onclick = () => {
    window.location.href = 'menu-quizzes.html';
  };

  // === 9. Pantalla final
  const finalizarQuiz = () => {
    const aciertos = respuestas.filter(r => r).length;
    const porcentaje = (aciertos / totalPreguntas) * 100;

    document.getElementById('resultado-final').textContent = `Aciertos: ${aciertos}/${totalPreguntas} (${porcentaje.toFixed(0)}%)`;

    let frase = "";
    if (porcentaje >= 90) frase = "¡Excelente, dominas el tema!";
    else if (porcentaje >= 60) frase = "¡Muy bien! Solo un poco más de práctica.";
    else frase = "No te preocupes, sigue practicando y lo conseguirás.";

    document.getElementById('frase-motivadora').textContent = frase;

    const logrosDiv = document.getElementById('logros-desbloqueados');
    logrosDiv.innerHTML = '<h3>Logros desbloqueados:</h3>';
    if (aciertos === totalPreguntas) {
      const p = document.createElement('p');
      p.className = 'logro';
      p.textContent = '🏆 ¡Perfecto! Todas las respuestas correctas.';
      logrosDiv.appendChild(p);
    }
    if (respuestas.length >= 3 && respuestas.slice(-3).every(r => r)) {
      const p = document.createElement('p');
      p.className = 'logro';
      p.textContent = '🏆 3 respuestas seguidas correctas';
      logrosDiv.appendChild(p);
    }

    document.getElementById('final-screen').style.display = 'block';
  };

  // === 10. Botones finales
  document.getElementById('reiniciar-quiz').onclick = () => {
    currentQ = 0;
    respuestas = [];
    mostrarPregunta();
    actualizarProgreso();
  };

  document.getElementById('volver-menu').onclick = () => {
    window.location.href = 'menu-quizzes.html';
  };

  // === 11. Iniciar
  mostrarPregunta();
  actualizarProgreso();
});
