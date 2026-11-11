'use strict';

(() => {
  const screen = document.querySelector('#demo-screen');
  if (!screen) return;
  const lessons = {
    web: {
      title: 'Web requests',
      notes: [
        'HTTP lets a client, such as a browser, communicate with a server through requests and responses.',
        'GET requests retrieve data. POST requests submit data for processing.',
        'A 200 response indicates success. A 404 response means the requested resource was not found.'
      ],
      questions: [
        { prompt: 'Which method retrieves data from a server?', options: ['POST', 'GET', '404'], answer: 1, explanation: 'GET retrieves data. POST submits data for processing, while 404 is a response status rather than a request method.' },
        { prompt: 'A browser requests a page that does not exist. Which status fits?', options: ['200', 'GET', '404'], answer: 2, explanation: '404 means the requested resource was not found. A 200 response would indicate a successful request.' },
        { prompt: 'Which method would submit a completed form for processing?', options: ['POST', '200', 'GET'], answer: 0, explanation: 'POST submits data for processing. GET retrieves data, and 200 is a response status.' }
      ]
    },
    data: {
      title: 'Database keys',
      notes: [
        'A relational database stores records in tables. Each row represents a record.',
        'A primary key uniquely identifies each row in a table.',
        'A foreign key references a key in another table, linking related records. For example, a quiz result can reference the student who earned it.'
      ],
      questions: [
        { prompt: 'What uniquely identifies a row in a table?', options: ['A table name', 'A foreign key', 'A primary key'], answer: 2, explanation: 'A primary key uniquely identifies a row. A foreign key links a record to a referenced key, and its values can repeat.' },
        { prompt: 'What links a quiz result to its student record?', options: ['A foreign key', 'A column label alone', 'The order of the rows'], answer: 0, explanation: 'A foreign key references a key in the student table. Row order and column labels do not establish that relationship.' },
        { prompt: 'In a table of students, what does one row represent?', options: ['Every student', 'One student record', 'A database connection'], answer: 1, explanation: 'Each row represents one record. In a students table, that is one student; the table holds the collection of records.' }
      ]
    }
  };
  let topic = 'web';
  let current = 0;
  let selected = null;
  let answers = [];
  let checked = false;

  function stage(name) {
    document.querySelectorAll('[data-stage]').forEach(item => {
      if (item.dataset.stage === name) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  }
  function focusHeading() {
    screen.querySelector('h4')?.focus({ preventScroll: true });
    document.querySelector('.study-demo').scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function renderNotes(focus = false) {
    stage('notes');
    const lesson = lessons[topic];
    screen.innerHTML = `
      <p class="eyebrow">Start with a short lesson</p>
      <h4 tabindex="-1">A few notes. Three questions.</h4>
      <label class="topic-label" for="demo-topic">Choose a sample topic</label>
      <select id="demo-topic"><option value="web">Web requests</option><option value="data">Database keys</option></select>
      <div class="sample-notes"><span class="eyebrow">Sample notes / ${lesson.title}</span><ul>${lesson.notes.map(note => `<li>${note}</li>`).join('')}</ul></div>
      <p class="demo-hint">Read the notes, then test what you remember.</p>
      <button class="demo-primary" data-action="start">Start sample quiz <span aria-hidden="true">→</span></button>`;
    screen.querySelector('select').value = topic;
    screen.querySelector('select').addEventListener('change', event => {
      topic = event.target.value;
      renderNotes();
      screen.querySelector('select').focus({ preventScroll: true });
    });
    if (focus) focusHeading();
  }
  function renderQuestion() {
    stage('quiz');
    checked = false;
    selected = null;
    const question = lessons[topic].questions[current];
    screen.innerHTML = `
      <div class="quiz-meta"><span class="eyebrow">${lessons[topic].title}</span><span>Question ${current + 1} of 3</span></div>
      <label class="progress-label" for="quiz-progress">${current} of 3 answered</label>
      <progress id="quiz-progress" value="${current}" max="3">${current} of 3 answered</progress>
      <h4 tabindex="-1" id="sample-question">${question.prompt}</h4>
      <div class="quiz-options" role="group" aria-labelledby="sample-question">${question.options.map((option, index) => `<button class="quiz-option" data-option="${index}" aria-pressed="false"><span class="option-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span>${option}</span><span class="option-result"></span></button>`).join('')}</div>
      <div class="quiz-feedback" role="status" aria-atomic="true"></div>
      <button class="demo-primary" data-action="check" disabled>Check answer <span aria-hidden="true">→</span></button>
      <details class="notes-reminder"><summary>Look back at the notes</summary><ul>${lessons[topic].notes.map(note => `<li>${note}</li>`).join('')}</ul></details>`;
    focusHeading();
  }
  function checkAnswer() {
    if (selected === null || checked) return;
    checked = true;
    const question = lessons[topic].questions[current];
    answers.push(selected);
    const correct = selected === question.answer;
    screen.querySelectorAll('[data-option]').forEach(button => {
      const index = Number(button.dataset.option);
      button.disabled = true;
      if (index === question.answer) {
        button.classList.add('correct-answer');
        button.querySelector('.option-result').textContent = 'Correct';
      } else if (index === selected) {
        button.classList.add('incorrect-answer');
        button.querySelector('.option-result').textContent = 'Your answer';
      }
    });
    const feedback = screen.querySelector('.quiz-feedback');
    feedback.classList.add(correct ? 'is-correct' : 'is-incorrect');
    feedback.innerHTML = `<strong>${correct ? 'You got it.' : 'Let’s revisit that.'}</strong><p>${question.explanation}</p>`;
    screen.querySelector('progress').value = current + 1;
    screen.querySelector('.progress-label').textContent = `${current + 1} of 3 answered`;
    const next = screen.querySelector('[data-action="check"]');
    next.dataset.action = 'next';
    next.innerHTML = `${current === 2 ? 'See my results' : 'Next question'} <span aria-hidden="true">→</span>`;
  }
  function renderResults() {
    stage('results');
    const questions = lessons[topic].questions;
    const mistakes = questions.map((question, index) => ({question, selected: answers[index]})).filter(item => item.selected !== item.question.answer);
    const score = questions.length - mistakes.length;
    screen.innerHTML = `
      <p class="eyebrow">Practice complete / ${lessons[topic].title}</p>
      <h4 tabindex="-1">${score === 3 ? 'Three for three. Nice work.' : 'Now you know what to revisit.'}</h4>
      <div class="sample-score"><span>${score}<small> / 3</small></span><p>correct on this attempt<br><strong>${Math.round(score / 3 * 100)}% accuracy</strong></p></div>
      <label class="progress-label" for="quiz-progress">3 of 3 answered</label><progress id="quiz-progress" value="3" max="3">3 of 3 answered</progress>
      <div class="mistake-review"><h5>${mistakes.length ? `Review ${mistakes.length} mistake${mistakes.length === 1 ? '' : 's'}` : 'All concepts covered'}</h5>${mistakes.length ? mistakes.map(({question, selected: chosen}) => `<details class="review-item"><summary>${question.prompt}</summary><p>Your answer: <strong>${question.options[chosen]}</strong><br>Correct answer: <strong>${question.options[question.answer]}</strong></p><p>${question.explanation}</p></details>`).join('') : '<p>You identified request methods and status codes correctly.</p>'}</div>
      <button class="demo-primary" data-action="restart">Try another round <span aria-hidden="true">↺</span></button>`;
    if (!mistakes.length && topic === 'data') screen.querySelector('.mistake-review > p').textContent = 'You identified records, primary keys, and foreign keys correctly.';
    focusHeading();
  }
  screen.addEventListener('click', event => {
    const option = event.target.closest('[data-option]');
    if (option && !checked) {
      selected = Number(option.dataset.option);
      screen.querySelectorAll('[data-option]').forEach(button => button.setAttribute('aria-pressed', String(button === option)));
      screen.querySelector('[data-action="check"]').disabled = false;
      return;
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'start') { current = 0; answers = []; renderQuestion(); }
    if (action === 'check') checkAnswer();
    if (action === 'next' && checked) {
      if (current === 2) renderResults();
      else { current++; renderQuestion(); }
    }
    if (action === 'restart') { current = 0; answers = []; renderNotes(true); }
  });
  renderNotes();
})();
