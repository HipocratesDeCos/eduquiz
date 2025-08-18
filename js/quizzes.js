// js/quizzes.js

document.addEventListener("DOMContentLoaded", async () => {
  const categoriaId = localStorage.getItem('categoriaActual');
  if (!categoriaId) return window.location.href = 'index.html';

  // Cargar título de la categoría
  const categorias = await (await fetch('data/categorias.json')).json();
  const categoria = categorias.find(c => c.id === categoriaId);
  document.getElementById('categoria-titulo').textContent = categoria.nombre;

  // Lista de quizzes (estáticos + dinámicos)
  const quizzesList = document.querySelector('.quizzes-list');
  quizzesList.innerHTML = ''; // Limpiar

  // === 1. Cargar quizzes estáticos desde el servidor (ej: data/contabilidad-financiera/*.json)
  try {
    // Simulamos que hay un archivo índice (en producción, esto vendría de un servidor o se genera)
    const quizzesEstaticos = [
      { file: 'introduccion.json', title: 'Introducción al PGC' }
    ];

    quizzesEstaticos.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn slide-in';
      btn.textContent = q.title;
      btn.onclick = () => {
        localStorage.setItem('quizFile', `${categoriaId}/${q.file}`);
        window.location.href = 'quiz.html';
      };
      quizzesList.appendChild(btn);
    });
  } catch (e) {
    console.warn('No hay quizzes estáticos disponibles.');
  }

  // === 2. Cargar quizzes subidos por el profesor (desde localStorage)
  const quizzesGuardados = JSON.parse(localStorage.getItem('quizzes') || '[]');
  const quizzesDeEstaCategoria = quizzesGuardados.filter(q => q.categoria === categoriaId);

  quizzesDeEstaCategoria.forEach(qData => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn slide-in';
    btn.textContent = qData.data.titulo;
    btn.onclick = () => {
      // Guardar el quiz completo en localStorage para que quiz.html lo cargue
      localStorage.setItem('quizData', JSON.stringify(qData.data));
      localStorage.setItem('quizFile', `subido/${qData.data.titulo}.json`); // nombre simulado
      window.location.href = 'quiz.html';
    };
    quizzesList.appendChild(btn);
  });

  // === 3. Manejar subida de archivos
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');
  const status = document.getElementById('upload-status');

  dropArea.addEventListener('click', () => fileInput.click());
  dropArea.addEventListener('dragover', e => {
    e.preventDefault();
    dropArea.classList.add('highlight');
  });
  dropArea.addEventListener('dragleave', () => dropArea.classList.remove('highlight'));
  dropArea.addEventListener('drop', e => {
    e.preventDefault();
    dropArea.classList.remove('highlight');
    fileInput.files = e.dataTransfer.files;
  });

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return alert('Selecciona un archivo .json');

    let data;
    try {
      const json = await file.text();
      data = JSON.parse(json);
    } catch (e) {
      return status.textContent = 'Error: Archivo JSON inválido.';
    }

    // Validar campos obligatorios
    const titulo = data.titulo || data.title;
    const preguntas = data.preguntas || data.questions;

    if (!titulo || !preguntas || preguntas.length === 0) {
      return status.textContent = 'Error: El quiz debe tener un título y al menos una pregunta.';
    }

    // Normalizar el objeto
    const quizValido = {
      titulo: titulo,
      descripcion: data.descripcion || '',
      preguntas: preguntas.map(p => ({
        intro: p.intro || p.introduccion || '',
        question: p.question || p.pregunta || '',
        options: p.options || p.opciones || [],
        correct: Array.isArray(p.correct) ? p.correct : [p.correct],
        saber_mas: p.saber_mas || p.explicacion || ''
      }))
    };

    // Guardar en localStorage
    const quizzesGuardados = JSON.parse(localStorage.getItem('quizzes') || '[]');
    quizzesGuardados.push({ categoria: categoriaId, data: quizValido });
    localStorage.setItem('quizzes', JSON.stringify(quizzesGuardados));

    // Añadir inmediatamente a la lista (sin recargar)
    const btn = document.createElement('button');
    btn.className = 'quiz-btn slide-in';
    btn.textContent = quizValido.titulo;
    btn.onclick = () => {
      localStorage.setItem('quizData', JSON.stringify(quizValido));
      localStorage.setItem('quizFile', `subido/${quizValido.titulo}.json`);
      window.location.href = 'quiz.html';
    };
    quizzesList.appendChild(btn);

    status.textContent = `✅ Quiz "${quizValido.titulo}" subido y visible.`;
    setTimeout(() => status.textContent = '', 3000);

    // Limpiar input
    fileInput.value = '';
  });
});
