document.addEventListener("DOMContentLoaded", async () => {
  const quizFile = localStorage.getItem('quizFile');
  if (!quizFile) return window.location.href = 'menu-quizzes.html';

  const res = await fetch(`data/${quizFile}`);
  const quiz = await res.json();

  let currentQ = 0;
  let respuestas = [];
  let logros = [];

  const actualizarProgreso = () => {
    document.getElementById('progress').style.width = `${(currentQ / 15) * 100}%`;
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

    document.getElementById('btn-validar').disabled = false;
    document.getElementById('btn-validar').style.display = 'block';
    document.getElementById('final-screen').style.display = 'none';
  };

  // Validar respuesta
  document.getElementById('btn-validar').addEventListener('click', () => {
    const selected = document.querySelector('.respuesta-btn.selected');
    if (!selected) return alert('Selecciona una respuesta');

    const selectedIndex = parseInt(selected.dataset.index);
    const correcta = quiz.preguntas[currentQ].correcta;
    respuestas.push(selectedIndex === correcta);

    // Mostrar feedback
    document.querySelectorAll('.respuesta-btn').forEach((btn, i) => {
      if (i === correcta) btn.classList.add('correcta');
      else if (i === selectedIndex && selectedIndex !== correcta) btn.classList.add('incorrecta');
    });
    document.getElementById('btn-validar').style.display = 'none';

    // Desbloquear logros
    if (currentQ === 0) logros.push('Primer Quiz Completo');
    if (respuestas.length >= 3 && respuestas.slice(-3).every(r => r)) logros.push('3 Respuestas seguidas correctas');

    // Habilitar "Saber más"
    document.getElementById('saber-mas').onclick = () => {
      document.getElementById('explicacion-extra').textContent = quiz.preguntas[currentQ].explicacion;
      document.getElementById('modal').style.display = 'flex';
    };
  });

  // Modal
  document.querySelector('.close').onclick = () => document.getElementById('modal').style.display = 'none';
  window.onclick = e => {
    if (e.target === document.getElementById('modal')) document.getElementById('modal').style.display = 'none';
  };

  // Navegación
  document.getElementById('btn-inicio').onclick = () => window.location.href = 'index.html';
  document.getElementById('btn-menu').onclick = () => window.location.href = 'menu-quizzes.html';

  // Finalizar quiz
  const finalizarQuiz = () => {
    const aciertos = respuestas.filter(r => r).length;
    const porcentaje = (aciertos / 15) * 100;
    document.getElementById('resultado-final').textContent = `Aciertos: ${aciertos}/15 (${porcentaje.toFixed(0)}%)`;

    let frase = "";
    if (porcentaje >= 90) frase = "¡Excelente, dominas el tema!";
    else if (porcentaje >= 60) frase = "¡Muy bien! Solo un poco más de práctica.";
    else frase = "No te preocupes, sigue practicando y lo conseguirás.";

    document.getElementById('frase-motivadora').textContent = frase;

    const logrosDiv = document.getElementById('logros-desbloqueados');
    logrosDiv.innerHTML = logros.length ? '<h3>Logros:</h3>' : '';
    logros.filter((l, i) => logros.indexOf(l) === i).forEach(l => {
      const p = document.createElement('p');
      p.className = 'logro';
      p.textContent = '🏆 ' + l;
      logrosDiv.appendChild(p);
    });

    document.getElementById('final-screen').style.display = 'block';
  };

  // Botones finales
  document.getElementById('reiniciar-quiz').onclick = () => {
    currentQ = 0;
    respuestas = [];
    mostrarPregunta();
    actualizarProgreso();
  };
  document.getElementById('volver-menu').onclick = () => window.location.href = 'menu-quizzes.html';

  // Iniciar
  mostrarPregunta();
  actualizarProgreso();
});
