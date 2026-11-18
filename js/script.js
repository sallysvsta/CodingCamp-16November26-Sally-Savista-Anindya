/* To-Do List Life Dashboard
   Vanilla JS, all data stored in Local Storage */

(function () {
  'use strict';

  // ---------- Storage helpers ----------
  var KEYS = {
    tasks: 'dashboard_tasks',
    links: 'dashboard_links',
    theme: 'dashboard_theme',
    name: 'dashboard_username'
  };

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable, ignore */
    }
  }

  // ---------- Greeting, time and date ----------
  var clockEl = document.getElementById('clock');
  var dateEl = document.getElementById('date');
  var greetingEl = document.getElementById('greeting-text');
  var editNameBtn = document.getElementById('edit-name');
  var userName = load(KEYS.name, '');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    if (hour >= 18 && hour < 22) return 'Good Evening';
    return 'Good Night';
  }

  function updateClock() {
    var now = new Date();
    clockEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    var text = getGreeting(now.getHours());
    greetingEl.textContent = userName ? text + ', ' + userName : text;
  }

  editNameBtn.addEventListener('click', function () {
    var input = window.prompt('What should I call you?', userName);
    if (input === null) return;
    userName = input.trim();
    save(KEYS.name, userName);
    updateClock();
  });

  updateClock();
  setInterval(updateClock, 1000);

  // ---------- Focus timer (25 minutes) ----------
  var TIMER_SECONDS = 25 * 60;
  var timerDisplay = document.getElementById('timer-display');
  var remaining = TIMER_SECONDS;
  var timerId = null;
  var endTime = null;

  function renderTimer() {
    timerDisplay.textContent = pad(Math.floor(remaining / 60)) + ':' + pad(remaining % 60);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function tick() {
    remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    renderTimer();
    if (remaining === 0) {
      stopTimer();
      window.alert('Time is up! Take a short break.');
    }
  }

  document.getElementById('timer-start').addEventListener('click', function () {
    if (timerId !== null || remaining === 0) return;
    endTime = Date.now() + remaining * 1000;
    timerId = setInterval(tick, 250);
  });

  document.getElementById('timer-stop').addEventListener('click', stopTimer);

  document.getElementById('timer-reset').addEventListener('click', function () {
    stopTimer();
    remaining = TIMER_SECONDS;
    renderTimer();
  });

  renderTimer();

  // ---------- To-do list ----------
  var tasks = load(KEYS.tasks, []);
  var taskForm = document.getElementById('task-form');
  var taskInput = document.getElementById('task-input');
  var taskList = document.getElementById('task-list');
  var taskMessage = document.getElementById('task-message');

  function saveTasks() {
    save(KEYS.tasks, tasks);
  }

  function isDuplicate(text, ignoreId) {
    var lower = text.toLowerCase();
    return tasks.some(function (t) {
      return t.id !== ignoreId && t.text.toLowerCase() === lower;
    });
  }

  function showMessage(msg) {
    taskMessage.textContent = msg;
  }

  function startEdit(task, li) {
    var textEl = li.querySelector('.task-text');
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = task.text;
    li.replaceChild(input, textEl);
    input.focus();
    input.select();

    var finished = false;

    function commit() {
      if (finished) return;
      finished = true;
      var value = input.value.trim();
      if (value && value !== task.text) {
        if (isDuplicate(value, task.id)) {
          showMessage('That task already exists.');
        } else {
          task.text = value;
          saveTasks();
          showMessage('');
        }
      }
      renderTasks();
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') {
        finished = true;
        renderTasks();
      }
    });
    input.addEventListener('blur', commit);
  }

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' done' : '');

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', function () {
        task.done = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      var text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      var actions = document.createElement('div');
      actions.className = 'task-actions';

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-edit';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', function () {
        startEdit(task, li);
      });

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn btn-danger';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', function () {
        tasks = tasks.filter(function (t) {
          return t.id !== task.id;
        });
        saveTasks();
        showMessage('');
        renderTasks();
      });

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(actions);
      taskList.appendChild(li);
    });
  }

  taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = taskInput.value.trim();
    if (!value) return;
    if (isDuplicate(value, null)) {
      showMessage('That task already exists.');
      return;
    }
    tasks.push({ id: Date.now() + Math.random(), text: value, done: false });
    saveTasks();
    showMessage('');
    taskInput.value = '';
    renderTasks();
  });

  taskInput.addEventListener('input', function () {
    showMessage('');
  });

  renderTasks();

  // ---------- Quick links ----------
  var DEFAULT_LINKS = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'Gmail', url: 'https://mail.google.com' },
    { name: 'Calendar', url: 'https://calendar.google.com' }
  ];

  var links = load(KEYS.links, null);
  if (!Array.isArray(links)) {
    links = DEFAULT_LINKS.slice();
    save(KEYS.links, links);
  }

  var linkForm = document.getElementById('link-form');
  var linkNameInput = document.getElementById('link-name');
  var linkUrlInput = document.getElementById('link-url');
  var linkList = document.getElementById('link-list');

  function normalizeUrl(raw) {
    var url = raw.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    try {
      return new URL(url).href;
    } catch (e) {
      return null;
    }
  }

  function renderLinks() {
    linkList.innerHTML = '';
    links.forEach(function (link, index) {
      var wrap = document.createElement('div');
      wrap.className = 'link-item';

      var a = document.createElement('a');
      a.className = 'link-btn';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.name;

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'link-remove';
      remove.setAttribute('aria-label', 'Remove ' + link.name);
      remove.textContent = '✕';
      remove.addEventListener('click', function () {
        links.splice(index, 1);
        save(KEYS.links, links);
        renderLinks();
      });

      wrap.appendChild(a);
      wrap.appendChild(remove);
      linkList.appendChild(wrap);
    });
  }

  linkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = linkNameInput.value.trim();
    var url = normalizeUrl(linkUrlInput.value);
    if (!name || !url) {
      window.alert('Please enter a link name and a valid URL.');
      return;
    }
    links.push({ name: name, url: url });
    save(KEYS.links, links);
    linkNameInput.value = '';
    linkUrlInput.value = '';
    renderLinks();
  });

  renderLinks();

  // ---------- Light / dark mode ----------
  var themeToggle = document.getElementById('theme-toggle');
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  applyTheme(load(KEYS.theme, 'light'));

  themeToggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    save(KEYS.theme, next);
  });
})();