document.addEventListener("DOMContentLoaded", () => {
  const quizDataStr = localStorage.getItem('quizData');
  let quiz = null;

  if (!quizDataStr) {
    alert('Error: No se encontró el contenido del quiz.');
    return window.location.href = 'menu-quizzes.html';
  }

  try {
    quiz = JSON.parse(quizDataStr);
  } catch (e) {
    alert('Error: El contenido del quiz está corrupto.');
    console.error(e);
    return window.location.href = 'menu-quizzes.html';
  }

  if (!quiz.preguntas || !Array.isArray(quiz.preguntas) || quiz.preguntas.length === 0) {
    alert('Error: El quiz no tiene preguntas válidas.');
    return window.location.href = 'menu-quizzes.html';
  }

  let currentQ = 0;
  let respuestas = [];
  const totalPreguntas = quiz.preguntas.length;

  const textoAprendizaje = document.getElementById('texto-aprendizaje');
  const preguntaTexto = document.getElementById('pregunta-texto');
  const respuestasGrid = document.getElementById('respuestas');
  const btnValidar = document.getElementById('btn-validar');
  const saberMas = document.getElementById('saber-mas');
  const progress = document.getElementById('progress');

  const mostrarPregunta = () => {
    const q = quiz.preguntas[currentQ];

    textoAprendizaje.textContent = q.intro;
    preguntaTexto.textContent = q.question;

    respuestasGrid.innerHTML = '';
    if (q.options && q.options.length > 0) {
      q.options.forEach((opc, i) => {
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

    const numEl = document.createElement('div');
    numEl.className = 'pregunta-num';
    numEl.textContent = `Pregunta ${currentQ + 1} de ${totalPreguntas}`;
    preguntaTexto.parentNode.insertBefore(numEl, preguntaTexto);

    btnValidar.style.display = 'block';
    btnValidar.disabled = false;
    saberMas.style.display = 'inline';

    document.getElementById('final-screen').style.display = 'none';
  };

  btnValidar.addEventListener('click', () => {
    const selectedBtn = document.querySelector('.respuesta-btn.selected');
    if (!selectedBtn) return alert('Selecciona una respuesta');

    const selectedIndex = parseInt(selectedBtn.dataset.index);
    const correctIndices = Array.isArray(q.correct) ? q.correct : [q.correct];
    const esCorrecta = correctIndices.includes(selectedIndex);

    document.querySelectorAll('.respuesta-btn').forEach((btn, i) => {
      if (correctIndices.includes(i)) {
        btn.classList.add('correcta');
      } else if (i === selectedIndex && !esCorrecta) {
        btn.classList.add('incorrecta');
      }
    });

    respuestas.push(esCorrecta);

    btnValidar.style.display = 'none';

    saberMas.onclick = () => {
      document.getElementById('explicacion-extra').innerHTML = q.saber_mas;
      document.getElementById('modal').style.display = 'flex';
    };

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

  const actualizarProgreso = () => {
    const porcentaje = (currentQ / totalPreguntas) * 100;
    progress.style.width = `${porcentaje}%`;
  };

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

  document.getElementById('reiniciar-quiz').onclick = () => {
    currentQ = 0;
    respuestas = [];
    mostrarPregunta();
    actualizarProgreso();
  };

  document.getElementById('volver-menu').onclick = () => {
    window.location.href = 'menu-quizzes.html';
  };

  document.getElementById('btn-inicio').onclick = () => {
    window.location.href = 'index.html';
  };

  document.getElementById('btn-menu').onclick = () => {
    window.location.href = 'menu-quizzes.html';
  };

  document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
  };

  window.onclick = (e) => {
    if (e.target === document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
  };

  mostrarPregunta();
  actualizarProgreso();
});
