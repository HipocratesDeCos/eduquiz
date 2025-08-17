// menu-quizzes.html
document.addEventListener("DOMContentLoaded", async () => {
  const categoriaId = localStorage.getItem('categoriaActual');
  if (!categoriaId) return window.location.href = 'index.html';

  // Cargar título
  const categorias = await (await fetch('data/categorias.json')).json();
  const categoria = categorias.find(c => c.id === categoriaId);
  document.getElementById('categoria-titulo').textContent = categoria.nombre;

  // Cargar quizzes
  const quizzesList = document.querySelector('.quizzes-list');
  try {
    const res = await fetch(`data/${categoriaId}/`);
    // En producción: usar un archivo índice o servidor que liste archivos
    // Aquí simulamos con un array (en producción: usar API o JSON listado)
    const quizzes = [
      { file: 'introduccion.json', title: 'Introducción a la Contabilidad' }
    ];
    quizzes.forEach(q => {
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
    quizzesList.innerHTML = '<p>No hay quizzes disponibles.</p>';
  }

  // Subida de archivo
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

    const json = await file.text();
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      return status.textContent = 'Error: Archivo JSON inválido.';
    }

    // Validar con plantilla
    const plantilla = await (await fetch('data/plantilla-quiz.json')).json();
   // ✅ Ahora (flexible)
if (!data.titulo || !data.preguntas || data.preguntas.length === 0) {
  return status.textContent = 'Error: El quiz debe tener un título y al menos una pregunta.';
}

// Opcional: advertencia si hay muy pocas o demasiadas
if (data.preguntas.length < 5) {
  status.textContent = 'Advertencia: Este quiz tiene solo ' + data.preguntas.length + ' preguntas. Se recomiendan al menos 5.';
} else if (data.preguntas.length > 30) {
  status.textContent = 'Advertencia: Más de 30 preguntas puede ser demasiado extenso.';
} else {
  status.textContent = '';
}

    // Guardar en localStorage o en servidor (aquí simulamos)
    const quizzesGuardados = JSON.parse(localStorage.getItem('quizzes') || '[]');
    quizzesGuardados.push({ categoria: categoriaId, data });
    localStorage.setItem('quizzes', JSON.stringify(quizzesGuardados));

    status.textContent = `✅ Quiz "${data.titulo}" subido correctamente.`;
    setTimeout(() => location.reload(), 1000);
  });
});
