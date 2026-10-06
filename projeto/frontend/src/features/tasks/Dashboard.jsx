import NameForm from "./NameForm";
import TaskList from "./TaskList";
import { useTasks } from "./useTasks";
import { useState } from "react";
import { tasksApi } from "./api";
export default function Dashboard({ token, onLogout }) {
  const { lists, loading, error, busy, mutate } = useTasks(token, onLogout);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const items = lists.flatMap((list) => list.item_set),
    done = items.filter((item) => item.done).length;
  const visible =
    selected === null ? lists : lists.filter((list) => list.id === selected);
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <span className="eyebrow">SEU ESPAÇO</span>
        <button
          className={selected === null ? "nav-button active" : "nav-button"}
          onClick={() => setSelected(null)}
        >
          ▦ Todas as listas <span>{lists.length}</span>
        </button>
        <h3>MINHAS LISTAS</h3>
        {lists.map((list) => (
          <button
            key={list.id}
            className={
              selected === list.id ? "nav-button active" : "nav-button"
            }
            onClick={() => setSelected(list.id)}
          >
            ○ {list.name}
            <span>{list.item_set.length}</span>
          </button>
        ))}
        <div className="sidebar-note">
          Pequenos passos.
          <br />
          <strong>Grandes avanços.</strong>
        </div>
      </aside>
      <section className="workspace">
        <span className="eyebrow">UM POUCO DE ORGANIZAÇÃO, TODOS OS DIAS</span>
        <h1>
          Seu dia, com mais <em>leveza.</em>
        </h1>
        <p className="subtitle">
          Tire as tarefas da cabeça. Dê espaço às suas ideias.
        </p>
        <div className="stats">
          <article>
            <span>Listas criadas</span>
            <strong>{lists.length.toString().padStart(2, "0")}</strong>
          </article>
          <article>
            <span>Tarefas pendentes</span>
            <strong>{(items.length - done).toString().padStart(2, "0")}</strong>
          </article>
          <article>
            <span>Tarefas concluídas</span>
            <strong>
              {done.toString().padStart(2, "0")} <small>✓</small>
            </strong>
          </article>
        </div>
        <div className="section-heading">
          <h2>
            {selected === null
              ? "Minhas listas"
              : visible[0]?.name || "Minha lista"}
          </h2>
          <div className="filters">
            {[
              ["all", "Todas"],
              ["pending", "Pendentes"],
              ["done", "Concluídas"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={filter === value ? "selected" : ""}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {loading ? (
          <p role="status">Carregando suas listas…</p>
        ) : (
          <>
            <div className="list-grid">
              {visible.map((list) => (
                <TaskList
                  key={list.id}
                  list={list}
                  filter={filter}
                  busy={busy}
                  onDeleteList={() =>
                    mutate(async () => {
                      await tasksApi.deleteList(token, list.id);
                      if (selected === list.id) setSelected(null);
                    })
                  }
                  onToggleItem={(item) =>
                    mutate(() => tasksApi.toggleItem(token, item))
                  }
                  onDeleteItem={(id) =>
                    mutate(() => tasksApi.deleteItem(token, id))
                  }
                  onCreateItem={(name) =>
                    mutate(() => tasksApi.createItem(token, list.id, name))
                  }
                />
              ))}
            </div>
            {!lists.length && (
              <div className="empty-state">
                <h3>Um novo começo.</h3>
                <p>Crie sua primeira lista e adicione o que precisa fazer.</p>
              </div>
            )}
            <section className="new-list">
              <h3>Uma nova lista, um novo espaço.</h3>
              <NameForm
                label="Nome da nova lista"
                placeholder="Como você quer chamar sua lista?"
                busy={busy}
                onSubmit={(name) =>
                  mutate(() => tasksApi.createList(token, name))
                }
              />
            </section>
          </>
        )}
      </section>
    </main>
  );
}
