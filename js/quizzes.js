// js/quizzes.js

document.addEventListener("DOMContentLoaded", async () => {
  const categoriaId = localStorage.getItem('categoriaActual');
  if (!categoriaId) return window.location.href = 'index.html';

  // Cargar título de la categoría
  let categoria;
  try {
    const res = await fetch('data/categorias.json');
    const categorias = await res.json();
    categoria = categorias.find(c => c.id === categoriaId);
    if (!categoria) throw new Error('Categoría no encontrada');
  } catch (e) {
    console.error('Error al cargar categorías:', e);
    alert('No se pudo cargar la categoría.');
    return window.location.href = 'index.html';
  }

  document.getElementById('categoria-titulo').textContent = categoria.nombre;

  const quizzesList = document.querySelector('.quizzes-list');
  quizzesList.innerHTML = '';

  // === 1. Cargar quizzes estáticos (ej: data/contabilidad-financiera/*.json)
  try {
    // Simulamos lista de quizzes estáticos (puedes cambiar esto por un JSON real o API)
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
    console.warn('No se pudieron cargar quizzes estáticos:', e);
  }

  // === 2. Cargar quizzes subidos (desde localStorage)
  const quizzesGuardados = JSON.parse(localStorage.getItem('quizzes') || '[]');
  const quizzesDeEstaCategoria = quizzesGuardados.filter(q => q.categoria === categoriaId);

  quizzesDeEstaCategoria.forEach(qData => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn slide-in';
    btn.textContent = qData.data.titulo;
    btn.onclick = () => {
      localStorage.setItem('quizData', JSON.stringify(qData.data));
      localStorage.setItem('quizFile', `subido/${encodeURIComponent(qData.data.titulo)}.json`);
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
  ['dragover', 'dragenter'].forEach(eventName => {
    dropArea.addEventListener(eventName, e => {
      e.preventDefault();
      dropArea.classList.add('highlight');
    });
  });
  ['dragleave', 'dragend'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
      dropArea.classList.remove('highlight');
    });
  });
  dropArea.addEventListener('drop', e => {
    e.preventDefault();
    dropArea.classList.remove('highlight');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
    }
  });

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return alert('Selecciona un archivo .json');

    let rawData;
    try {
      const text = await file.text();
      rawData = JSON.parse(text);
    } catch (e) {
      return status.textContent = 'Error: Archivo JSON inválido.';
    }

    // Normalizar campos
    const titulo = rawData.titulo || rawData.title;
    const preguntas = rawData.preguntas || rawData.questions;

    if (!titulo || !preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
      return status.textContent = 'Error: El quiz debe tener un título y al menos una pregunta.';
    }

    const quizValido = {
      titulo,
      descripcion: rawData.descripcion || rawData.description || '',
      preguntas: preguntas.map(p => {
        const intro = p.intro || p.introduccion || p.aprendizaje || 'Texto de repaso no disponible.';
        const question = p.question || p.pregunta || 'Pregunta no disponible.';
        const options = Array.isArray(p.options || p.opciones) ? (p.options || p.opciones) : [];
        const correct = Array.isArray(p.correct) ? p.correct : (typeof p.correct === 'number' ? [p.correct] : []);
        const saber_mas = p.saber_mas || p.explicacion || p['Saber más'] || '<p>No hay explicación adicional disponible.</p>';

        return { intro, question, options, correct, saber_mas };
      })
    };

    // Guardar en localStorage
    const updatedQuizzes = [...quizzesGuardados, { categoria: categoriaId, data: quizValido }];
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

    // Añadir inmediatamente a la lista
    const btn = document.createElement('button');
    btn.className = 'quiz-btn slide-in';
    btn.textContent = quizValido.titulo;
    btn.onclick = () => {
      localStorage.setItem('quizData', JSON.stringify(quizValido));
      localStorage.setItem('quizFile', `subido/${encodeURIComponent(quizValido.titulo)}.json`);
      window.location.href = 'quiz.html';
    };
    quizzesList.appendChild(btn);

    status.textContent = `✅ "${quizValido.titulo}" subido y listo.`;
    setTimeout(() => status.textContent = '', 3000);

    // Limpiar
    fileInput.value = '';
  });
});
