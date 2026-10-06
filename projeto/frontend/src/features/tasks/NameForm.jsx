import { useState } from "react";
export default function NameForm({ label, placeholder, onSubmit, busy }) {
  const [name, setName] = useState("");
  return (
    <form
      className="inline-form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (name.trim() && (await onSubmit(name.trim()))) setName("");
      }}
    >
      <input
        aria-label={label}
        placeholder={placeholder}
        value={name}
        maxLength={50}
        required
        onChange={(event) => setName(event.target.value)}
      />
      <button className="primary" disabled={busy}>
        Adicionar
      </button>
    </form>
  );
}
