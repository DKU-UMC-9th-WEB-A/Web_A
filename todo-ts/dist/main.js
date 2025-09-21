const state = {
    todos: [],
};
const $input = document.getElementById('todo-input');
const $add = document.getElementById('todo-add');
const $pending = document.getElementById('todo-pending');
const $done = document.getElementById('todo-done');
function createId() {
    if ('randomUUID' in crypto)
        return crypto.randomUUID();
    return Math.random().toString(36).slice(2);
}
const isBlank = (s) => s.trim().length === 0;
function addTodo(title) {
    if (isBlank(title))
        return;
    const todo = { id: createId(), title: title.trim(), done: false };
    state.todos.push(todo);
    render();
}
function toggleDone(id) {
    const t = state.todos.find((t) => t.id === id);
    if (!t)
        return;
    t.done = !t.done;
    render();
}
function removeTodo(id) {
    const i = state.todos.findIndex((t) => t.id === id);
    if (i >= 0) {
        state.todos.splice(i, 1);
        render();
    }
}
function renderList(target, items, done) {
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
        }
        else {
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
function render() {
    const pending = state.todos.filter((t) => !t.done);
    const done = state.todos.filter((t) => t.done);
    renderList($pending, pending, false);
    renderList($done, done, true);
}
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
    const target = e.target;
    if (target.matches('[data-action="toggle"]')) {
        const li = target.closest('.todo__item');
        if (!li)
            return;
        const id = li.dataset.id;
        toggleDone(id);
    }
});
$done.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('[data-action="remove"]')) {
        const li = target.closest('.todo__item');
        if (!li)
            return;
        const id = li.dataset.id;
        removeTodo(id);
    }
});
render();
export {};
