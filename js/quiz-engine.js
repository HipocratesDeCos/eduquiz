// js/quiz-engine.js

document.addEventListener("DOMContentLoaded", async () => {
  const quizFile = localStorage.getItem('quizFile');
  let quiz = null;

  // === 1. Si el quiz fue subido (ruta simulada "subido/...") → cargar desde localStorage
  if (quizFile && quizFile.startsWith('subido/')) {
    const quizDataStr = localStorage.getItem('quizData');
    if (quizDataStr) {
      try {
        quiz = JSON.parse(quizDataStr);
      } catch (e) {
        console.error('Error al parsear quizData de localStorage:', e);
        alert('Error: No se pudo cargar el contenido del quiz.');
        return window.location.href = 'menu-quizzes.html';
      }
    } else {
      console.error('quizData no encontrado en localStorage');
      alert('Error: El contenido del quiz no se guardó correctamente.');
      return window.location.href = 'menu-quizzes.html';
    }
  }
  // === 2. Si es un quiz estático → cargar desde archivo
  else {
    try {
      const res = await fetch(`data/${quizFile}`);
      if (!res.ok) throw new Error('Archivo no encontrado');
      quiz = await res.json();
    } catch (e) {
      console.error('No se pudo cargar el archivo:', e);
      alert('Quiz no disponible. Inténtalo de nuevo.');
      return window.location.href = 'menu-quizzes.html';
    }
  }

  // === 3. Si no se cargó el quiz
  if (!quiz) {
    alert('Quiz no encontrado.');
    return window.location.href = 'menu-quizzes.html';
  }

  // === 4. Continuar con el motor del quiz (tu código actual)
  let currentQ = 0;
  let respuestas = [];
  let logros = [];
  const totalPreguntas = quiz.preguntas.length;

  // ... (resto del código: mostrarPregunta, validar, finalizar, etc.)
  // 👇 Puedes mantener el resto de tu código aquí
