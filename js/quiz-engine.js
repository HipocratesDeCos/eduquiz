// Al inicio de quiz-engine.js (reemplaza la carga de fetch)
const quizFile = localStorage.getItem('quizFile');
let quiz = null;

if (quizFile && quizFile.startsWith('subido/')) {
  // Viene de subida dinámica
  const quizData = localStorage.getItem('quizData');
  if (quizData) {
    quiz = JSON.parse(quizData);
  }
} else {
  // Viene de archivo estático
  try {
    const res = await fetch(`data/${quizFile}`);
    quiz = await res.json();
  } catch (e) {
    console.error('No se pudo cargar el quiz:', e);
    alert('Quiz no disponible. Inténtalo de nuevo.');
    window.location.href = 'menu-quizzes.html';
  }
}

if (!quiz) {
  alert('Quiz no encontrado.');
  window.location.href = 'menu-quizzes.html';
}
