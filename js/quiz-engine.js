document.addEventListener("DOMContentLoaded", async () => {
  const quizFile = localStorage.getItem('quizFile');
  if (!quizFile) return window.location.href = 'menu-quizzes.html';

  const res = await fetch(`data/${quizFile}`);
  const quiz = await res.json();

  let currentQ = 0;
  let respuestas = [];
  let logros = [];
  const totalPreguntas = quiz.preguntas.length; // ← Dinámico

  const actualizarProgreso = () => {
    const porcentaje = (currentQ / totalPreguntas) * 100;
    document.getElementById('progress').style.width = `${porcentaje}%`;
  };

  const mostrarPregunta = () => {
    const q = quiz.preguntas[currentQ];
    document.getElementById('texto-aprendizaje').textContent = q.aprendizaje;
    document.getElementById('pregunta-texto').textContent = q.pregunta;

    const respuestasEl = document.getElementById('respuestas');
    respuestasEl.innerHTML = '';
    q.opciones.forEach((opc, i) => {
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
    header.insertAdjacentHTML('beforebegin', `<div class="pregunta-num">Pregunta ${currentQ + 1} de ${totalPreguntas}</div>`);
    document.querySelectorAll('.pregunta-num').forEach(el => el.remove()); // limpia duplicados
    header.previousElementSibling?.remove(); // limpia anterior

    const numEl = document.createElement('div');
    numEl.className = 'pregunta-num';
    numEl.textContent = `Pregunta ${currentQ + 1} de ${totalPreguntas}`;
    header.parentNode.insertBefore(numEl, header);

    document.getElementById('btn-validar').disabled = false;
    document.getElementById('btn-validar').style.display = 'block';
    document.getElementById('final-screen').style.display = 'none';
  };

  document.getElementById('btn-validar').addEventListener('click', () => {
    const selected = document.querySelector('.respuesta-btn.selected');
    if (!selected) return alert('Selecciona una respuesta');

    const selectedIndex = parseInt(selected.dataset.index);
    const correcta = quiz.preguntas[currentQ].correcta;
    const esCorrecta = selectedIndex === correcta;
    respuestas.push(esCorrecta);

    // Mostrar feedback visual
    document.querySelectorAll('.respuesta-btn').forEach((btn, i) => {
      if (i === correcta) btn.classList.add('correcta');
      else if (i === selectedIndex && !esCorrecta) btn.classList.add('incorrecta');
    });

    // Desactivar botón
    document.getElementById('btn-validar').style.display = 'none';

    // Logros (ejemplo)
    if (currentQ === 0) logros.push('Primer Quiz Completo');
    if (respuestas.length >= 3 && respuestas.slice(-3).every(r => r)) {
      if (!logros.includes('3 Respuestas seguidas correctas')) {
        logros.push('3 Respuestas seguidas correctas');
      }
    }

    // Saber más
    document.getElementById('saber-mas').onclick = () => {
      document.getElementById('explicacion-extra').textContent = quiz.preguntas[currentQ].explicacion;
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

  // Modal
  document.querySelector('.close').onclick = () => document.getElementById('modal').style.display = 'none';
  window.onclick = e => {
    if (e.target === document.getElementById('modal')) document.getElementById('modal').style.display = 'none';
  };

  // Navegación
  document.getElementById('btn-inicio').onclick = () => window.location.href = 'index.html';
  document.getElementById('btn-menu').onclick = () => window.location.href = 'menu-quizzes.html';

  const finalizarQuiz = () => {
    const aciertos = respuestas.filter(r => r).length;
    const porcentaje = (aciertos / totalPreguntas) * 100;

    document.getElementById('resultado-final').textContent = 
      `Aciertos: ${aciertos}/${totalPreguntas} (${porcentaje.toFixed(0)}%)`;

    let frase = "";
    if (porcentaje >= 90) frase = "¡Excelente, dominas el tema!";
    else if (porcentaje >= 60) frase = "¡Muy bien! Solo un poco más de práctica.";
    else frase = "No te preocupes, sigue practicando y lo conseguirás.";

    document.getElementById('frase-motivadora').textContent = frase;

    const logrosDiv = document.getElementById('logros-desbloqueados');
    logrosDiv.innerHTML = logros.length ? '<h3>Logros desbloqueados:</h3>' : '';
    logros.filter((l, i) => logros.indexOf(l) === i).forEach(l => {
      const p = document.createElement('p');
      p.className = 'logro';
      p.textContent = '🏆 ' + l;
      logrosDiv.appendChild(p);
    });

    document.getElementById('final-screen').style.display = 'block';
  };

  document.getElementById('reiniciar-quiz').onclick = () => {
    currentQ = 0;
    respuestas = [];
    logros = [];
    mostrarPregunta();
    actualizarProgreso();
  };

  document.getElementById('volver-menu').onclick = () => {
    window.location.href = 'menu-quizzes.html';
  };

  // Iniciar
  mostrarPregunta();
  actualizarProgreso();
});
