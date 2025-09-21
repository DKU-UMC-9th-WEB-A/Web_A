// src/script.ts

type ListKind = "todo" | "done";

interface TodoItemData {
  id: string;
  text: string;
  done: boolean;
}

/** 안전한 선택자: 없으면 null 반환(throw 안 함) */
const qs = <T extends Element>(sel: string, root: Document | Element = document): T | null =>
  root.querySelector(sel) as T | null;

/** 간단한 ID 생성 */
const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore - 브라우저에서 지원됨
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const state: { items: TodoItemData[] } = { items: [] };

/** 아이템 DOM 생성 */
const renderItem = (item: TodoItemData): HTMLLIElement => {
  const li = document.createElement("li");
  li.className = "list-container__item";
  li.dataset.id = item.id;

  const p = document.createElement("p");
  p.className = "list-container__item-text";
  p.textContent = item.text;

  const actions = document.createElement("div");
  actions.className = "list-container__item-actions";

  if (!item.done) {
    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className =
      "list-container__item-button list-container__item-button--complete";
    completeBtn.textContent = "완료";
    completeBtn.setAttribute("data-action", "complete");
    actions.appendChild(completeBtn);
  } else {
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className =
      "list-container__item-button list-container__item-button--delete";
    deleteBtn.textContent = "삭제";
    deleteBtn.setAttribute("data-action", "delete");
    actions.appendChild(deleteBtn);
  }

  li.append(p, actions);
  return li;
};

/** 해당 리스트(할 일/완료)에 아이템 붙이기 */
const mountItem = (item: TodoItemData): void => {
  const listSelector = item.done ? '[data-list="done"]' : '[data-list="todo"]';
  const list = qs<HTMLUListElement>(`.list-container ${listSelector}`);
  if (!list) {
    console.error("error", listSelector);
    return;
  }
  list.appendChild(renderItem(item));
};

/** 추가 */
const addItem = (text: string): void => {
  const trimmed = text.trim();
  if (!trimmed) return;

  const item: TodoItemData = { id: createId(), text: trimmed, done: false };
  state.items.push(item);
  mountItem(item);
};

/** 완료로 이동 */
const moveToDone = (id: string): void => {
  const item = state.items.find((i) => i.id === id);
  if (!item || item.done) return;

  item.done = true;

  const li = document.querySelector<HTMLLIElement>(`[data-id="${id}"]`);
  li?.parentElement?.removeChild(li);
  mountItem(item);
};

/** 완료 목록에서 삭제 */
const removeFromDone = (id: string): void => {
  const idx = state.items.findIndex((i) => i.id === id && i.done);
  if (idx === -1) return;

  state.items.splice(idx, 1);

  const li = document.querySelector<HTMLLIElement>(`[data-id="${id}"]`);
  li?.parentElement?.removeChild(li);
};

/** 폼 이벤트 연결 */
const wireForm = (): void => {
  const form = qs<HTMLFormElement>(".todo-container__form");
  const input = qs<HTMLInputElement>(".todo-container__input");
  if (!form || !input) {
    console.error("error");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    addItem(v);
    input.value = "";
    input.focus();
    // 디버그용
    console.log("추가됨:", v);
  });
};

/** 리스트(완료/삭제) 버튼 처리 - 이벤트 위임 */
const wireLists = (): void => {
  const container = qs<HTMLElement>(".list-container");
  if (!container) {
    console.error("'.list-container'를 못 찾았어요. HTML 구조 확인!");
    return;
  }

  container.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const action = target.getAttribute("data-action");
    if (!action) return;

    const li = target.closest<HTMLLIElement>(".list-container__item");
    const id = li?.dataset.id ?? "";
    if (!id) return;

    if (action === "complete") moveToDone(id);
    if (action === "delete") removeFromDone(id);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  wireForm();
  wireLists();
});
