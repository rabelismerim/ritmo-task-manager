import NameForm from "./NameForm";
export default function TaskList({
  list,
  filter,
  busy,
  onDeleteList,
  onToggleItem,
  onDeleteItem,
  onCreateItem,
}) {
  const completed = list.item_set.filter((item) => item.done).length;
  const filtered = list.item_set.filter(
    (item) => filter === "all" || (filter === "done" ? item.done : !item.done),
  );
  return (
    <article className="list-card">
      <header>
        <div>
          <span className="eyebrow">LISTA DE TAREFAS</span>
          <h3>{list.name}</h3>
        </div>
        <button
          className="icon-button"
          aria-label={`Excluir lista ${list.name}`}
          disabled={busy}
          onClick={() => {
            if (
              window.confirm(`Excluir a lista "${list.name}" e suas tarefas?`)
            )
              onDeleteList();
          }}
        >
          ×
        </button>
      </header>
      <div className="progress-label">
        <span>
          {completed} de {list.item_set.length} concluídas
        </span>
        <span>
          {list.item_set.length
            ? Math.round((completed / list.item_set.length) * 100)
            : 0}
          %
        </span>
      </div>
      <progress value={completed} max={list.item_set.length || 1} />
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            <label className={item.done ? "task done" : "task"}>
              <input
                type="checkbox"
                checked={item.done}
                disabled={busy}
                onChange={() => onToggleItem(item)}
              />
              <span>{item.name}</span>
            </label>
            <button
              className="icon-button"
              aria-label={`Excluir tarefa ${item.name}`}
              disabled={busy}
              onClick={() => onDeleteItem(item.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {!filtered.length && <p className="empty">Nenhuma tarefa por aqui.</p>}
      <NameForm
        label={`Nova tarefa em ${list.name}`}
        placeholder="+ Adicionar uma tarefa"
        busy={busy}
        onSubmit={(name) => onCreateItem(name)}
      />
    </article>
  );
}
