document.addEventListener("DOMContentLoaded", () => {
  const categoriaId = localStorage.getItem('categoriaActual');
  if (!categoriaId) return window.location.href = 'index.html';

  // Cargar título
  fetch('data/categorias.json')
    .then(res => res.json())
    .then(categorias => {
      const categoria = categorias.find(c => c.id === categoriaId);
      document.getElementById('categoria-titulo').textContent = categoria.nombre;

      // Cargar quizzes estáticos
      const quizzesEstaticos = [
        { file: 'introduccion.json', title: 'Introducción al PGC' }
      ];
      const quizzesList = document.querySelector('.quizzes-list');
      quizzesEstaticos.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.textContent = q.title;
        btn.onclick = () => {
          localStorage.setItem('quizFile', `${categoriaId}/${q.file}`);
          window.location.href = 'quiz.html';
        };
        quizzesList.appendChild(btn);
      });

      // Cargar quizzes subidos
      const quizzesGuardados = JSON.parse(localStorage.getItem('quizzes') || '[]');
      const quizzesDeEstaCategoria = quizzesGuardados.filter(q => q.categoria === categoriaId);
      quizzesDeEstaCategoria.forEach(qData => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.textContent = qData.data.titulo;
        btn.onclick = () => {
          localStorage.setItem('quizData', JSON.stringify(qData.data));
          window.location.href = 'quiz.html';
        };
        quizzesList.appendChild(btn);
      });
    });

  // Subida de archivo
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';

  const dropArea = document.getElementById('drop-area');
  const uploadBtn = document.getElementById('upload-btn');
  const status = document.getElementById('upload-status');

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return alert('Selecciona un archivo .json');

    try {
      const text = await file.text();
      const rawData = JSON.parse(text);
      const titulo = rawData.titulo || rawData.title;
      const preguntas = rawData.preguntas || rawData.questions;

      if (!titulo || !preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
        return status.textContent = 'Error: El quiz debe tener título y preguntas.';
      }

      const quizValido = {
        titulo,
        preguntas: preguntas.map(p => ({
          intro: p.intro || p.introduccion || 'Texto no disponible.',
          question: p.question || p.pregunta || 'Pregunta no disponible.',
          options: Array.isArray(p.options) ? p.options : [],
          correct: Array.isArray(p.correct) ? p.correct : [p.correct],
          saber_mas: p.saber_mas || p.explicacion || '<p>No hay explicación adicional.</p>'
        }))
      };

      const quizzesGuardados = JSON.parse(localStorage.getItem('quizzes') || '[]');
      quizzesGuardados.push({ categoria: categoriaId, data: quizValido });
      localStorage.setItem('quizzes', JSON.stringify(quizzesGuardados));

      const btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.textContent = quizValido.titulo;
      btn.onclick = () => {
        localStorage.setItem('quizData', JSON.stringify(quizValido));
        window.location.href = 'quiz.html';
      };
      document.querySelector('.quizzes-list').appendChild(btn);

      status.textContent = `✅ "${titulo}" subido correctamente.`;
      setTimeout(() => status.textContent = '', 3000);
    } catch (err) {
      status.textContent = '❌ Error: Archivo JSON inválido.';
      console.error(err);
    }
  });

  dropArea.addEventListener('dragover', e => {
    e.preventDefault();
    dropArea.classList.add('highlight');
  });
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('highlight');
  });
  dropArea.addEventListener('drop', e => {
    e.preventDefault();
    dropArea.classList.remove('highlight');
    fileInput.files = e.dataTransfer.files;
    fileInput.dispatchEvent(new Event('change'));
  });
});
