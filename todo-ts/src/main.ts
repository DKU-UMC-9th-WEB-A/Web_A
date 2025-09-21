// ===== Types =====
export type TodoId = string;

export interface Todo {
  id: TodoId;
  title: string;
  done: boolean;
}

// ===== State =====
const state = {
  todos: [] as Todo[],
};

// ===== DOM =====
const $input = document.getElementById('todo-input') as HTMLInputElement;
const $add = document.getElementById('todo-add') as HTMLButtonElement;
const $pending = document.getElementById('todo-pending') as HTMLUListElement;
const $done = document.getElementById('todo-done') as HTMLUListElement;

// ===== Utils =====
function createId(): TodoId {
  if ('randomUUID' in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}
const isBlank = (s: string) => s.trim().length === 0;

// ===== Actions =====
function addTodo(title: string): void {
  if (isBlank(title)) return;
  const todo: Todo = { id: createId(), title: title.trim(), done: false };
  state.todos.push(todo);
  render();
}

function toggleDone(id: TodoId): void {
  const t = state.todos.find((t) => t.id === id);
  if (!t) return;
  t.done = !t.done;
  render();
}

function removeTodo(id: TodoId): void {
  const i = state.todos.findIndex((t) => t.id === id);
  if (i >= 0) {
    state.todos.splice(i, 1);
    render();
  }
}

// ===== Render =====
function renderList(target: HTMLUListElement, items: Todo[], done: boolean): void {
  target.innerHTML = '';
  const frag = document.createDocumentFragment();

  for (const t of items) {
    const li = document.createElement('li');
    li.className = 'todo__item' + (t.done ? ' todo__item--done' : '');
    li.dataset.id = t.id;

    const title = document.createElement('span');
    title.className = 'todo__title-text';
    title.textContent = t.title;

    const actions = document.createElement('div');
    actions.className = 'todo__actions';

    if (!done) {
      const doneBtn = document.createElement('button');
      doneBtn.className = 'btn btn--primary';
      doneBtn.textContent = '완료';
      doneBtn.setAttribute('data-action', 'toggle');
      actions.appendChild(doneBtn);
    } else {
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn--danger';
      delBtn.textContent = '삭제';
      delBtn.setAttribute('data-action', 'remove');
      actions.appendChild(delBtn);
    }

    li.append(title, actions);
    frag.appendChild(li);
  }

  target.appendChild(frag);
}

function render(): void {
  const pending = state.todos.filter((t) => !t.done);
  const done = state.todos.filter((t) => t.done);

  renderList($pending, pending, false);
  renderList($done, done, true);
}

// ===== Events =====
$add.addEventListener('click', () => {
  addTodo($input.value);
  $input.value = '';
  $input.focus();
});

$input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTodo($input.value);
    $input.value = '';
  }
});

$pending.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('[data-action="toggle"]')) {
    const li = target.closest('.todo__item') as HTMLLIElement | null;
    if (!li) return;
    const id = li.dataset.id as TodoId;
    toggleDone(id);
  }
});

$done.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('[data-action="remove"]')) {
    const li = target.closest('.todo__item') as HTMLLIElement | null;
    if (!li) return;
    const id = li.dataset.id as TodoId;
    removeTodo(id);
  }
});

// ===== Init =====
render();
