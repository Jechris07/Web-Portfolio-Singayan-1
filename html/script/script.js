'use strict';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(max-width: 640px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });

const projects = [...document.querySelectorAll('.project')];
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    projects.forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
      if (!project.hidden) count++;
    });
    document.querySelector('#project-count').textContent = `Showing ${count} project${count === 1 ? '' : 's'}`;
  });
});

const notes = {
  snapgrade: {
    title: 'SnapGrade',
    role: 'My role / Creator & developer · Personal project',
    description: 'SnapGrade is an AI-powered study application that transforms notes into interactive quizzes and flashcards. With multiple question formats, answer explanations, mistake review, and progress tracking, it helps students test their understanding, identify learning gaps, and build confidence through practice.',
    image: 'images/snapgrade.png'
  },
  gym: { title: 'PUPQC Gym Reservation System', role: 'My role / Frontend developer', description: 'A gym reservation system for PUP Quezon City. My contribution was the frontend, using HTML, CSS, and JavaScript. This screenshot shows the project interface.', image: 'images/pupqc%20gym%20reservation.png' },
  library: { title: 'Integrated Library System', role: 'My role / Frontend & backend developer', description: 'I worked on the interface and backend of this library system, with PyCharm as the development environment. The frontend uses HTML and CSS. Open the screenshot for a closer look at the interface.', image: 'images/library%20system.png' },
  calculator: { title: 'Enhanced Calculator', role: 'My role / Layout & semantic diagram', description: 'A calculator application built with Python. I contributed the layout design and the semantic diagram. The project screenshot shows the calculator source in the development environment.', image: 'images/enhance%20calc.jpg' }
};
const dialog = document.querySelector('#project-dialog');
let projectTrigger;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = notes[button.dataset.project];
    projectTrigger = button;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-role').textContent = project.role;
    document.querySelector('#dialog-description').textContent = project.description;
    const image = document.querySelector('#dialog-image');
    image.src = project.image;
    image.alt = `${project.title} project screenshot`;
    document.querySelector('#dialog-original').href = project.image;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  projectTrigger?.focus({ preventScroll: true });
});

document.querySelector('.copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('jechrispalku56@gmail.com');
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'Select the email address above to copy it.';
  }
});

// A quiet, opt-in eight-step kick pattern. No audio files or autoplay.
const pattern = [true, false, true, false, true, false, false, true];
const steps = document.querySelector('.steps');
const play = document.querySelector('.beat-play');
const beatStatus = document.querySelector('.beat-status');
let audio;
let timer;
let playing = false;
let position = 0;
pattern.forEach((enabled, index) => {
  const step = document.createElement('button');
  step.className = 'step';
  step.textContent = String(index + 1).padStart(2, '0');
  step.setAttribute('aria-label', `Beat ${index + 1}`);
  step.setAttribute('aria-pressed', String(enabled));
  step.addEventListener('click', () => {
    pattern[index] = !pattern[index];
    step.setAttribute('aria-pressed', String(pattern[index]));
  });
  steps.append(step);
});
function kick() {
  const now = audio.currentTime;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.frequency.setValueAtTime(140, now);
  oscillator.frequency.exponentialRampToValueAtTime(45, now + 0.13);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
function tick() {
  [...steps.children].forEach((step, index) => step.classList.toggle('current', index === position));
  if (pattern[position]) kick();
  position = (position + 1) % pattern.length;
}
function stopBeat() {
  clearInterval(timer);
  playing = false;
  position = 0;
  play.setAttribute('aria-pressed', 'false');
  play.innerHTML = 'Play rhythm <span aria-hidden="true">▶</span>';
  [...steps.children].forEach(step => step.classList.remove('current'));
  beatStatus.textContent = 'Paused. Change the pattern and play again.';
  if (audio?.state === 'running') audio.suspend().catch(() => {});
}
play.addEventListener('click', async () => {
  if (playing) { stopBeat(); return; }
  play.disabled = true;
  try {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) throw new Error('Audio unavailable');
    audio ||= new AudioEngine();
    await audio.resume();
    if (document.hidden) { stopBeat(); return; }
    playing = true;
    play.setAttribute('aria-pressed', 'true');
    play.innerHTML = 'Pause rhythm <span aria-hidden="true">Ⅱ</span>';
    beatStatus.textContent = 'Playing at 100 BPM. Toggle a beat to change the pattern.';
    tick();
    timer = setInterval(tick, 300);
  } catch {
    beatStatus.textContent = 'Audio is unavailable in this browser. Try another browser.';
  } finally { play.disabled = false; }
});
document.addEventListener('visibilitychange', () => { if (document.hidden && playing) stopBeat(); });
window.addEventListener('pagehide', () => { if (playing) stopBeat(); });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navigation.querySelectorAll('a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
