"use strict";
const qs = (sel, root = document) => root.querySelector(sel);
const createId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};
const state = { items: [] };
const renderItem = (item) => {
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
    }
    else {
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
const mountItem = (item) => {
    const listSelector = item.done ? '[data-list="done"]' : '[data-list="todo"]';
    const list = qs(`.list-container ${listSelector}`);
    if (!list) {
        console.error("error", listSelector);
        return;
    }
    list.appendChild(renderItem(item));
};
const addItem = (text) => {
    const trimmed = text.trim();
    if (!trimmed)
        return;
    const item = { id: createId(), text: trimmed, done: false };
    state.items.push(item);
    mountItem(item);
};
const moveToDone = (id) => {
    var _a;
    const item = state.items.find((i) => i.id === id);
    if (!item || item.done)
        return;
    item.done = true;
    const li = document.querySelector(`[data-id="${id}"]`);
    (_a = li === null || li === void 0 ? void 0 : li.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(li);
    mountItem(item);
};
const removeFromDone = (id) => {
    var _a;
    const idx = state.items.findIndex((i) => i.id === id && i.done);
    if (idx === -1)
        return;
    state.items.splice(idx, 1);
    const li = document.querySelector(`[data-id="${id}"]`);
    (_a = li === null || li === void 0 ? void 0 : li.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(li);
};
const wireForm = () => {
    const form = qs(".todo-container__form");
    const input = qs(".todo-container__input");
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
        console.log("추가됨:", v);
    });
};
const wireLists = () => {
    const container = qs(".list-container");
    if (!container) {
        console.error("'.list-container'를 못 찾았어요. HTML 구조 확인!");
        return;
    }
    container.addEventListener("click", (e) => {
        var _a;
        const target = e.target;
        if (!target)
            return;
        const action = target.getAttribute("data-action");
        if (!action)
            return;
        const li = target.closest(".list-container__item");
        const id = (_a = li === null || li === void 0 ? void 0 : li.dataset.id) !== null && _a !== void 0 ? _a : "";
        if (!id)
            return;
        if (action === "complete")
            moveToDone(id);
        if (action === "delete")
            removeFromDone(id);
    });
};
document.addEventListener("DOMContentLoaded", () => {
    wireForm();
    wireLists();
});
