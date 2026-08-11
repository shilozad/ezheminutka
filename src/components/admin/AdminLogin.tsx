"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminLogin() {
  const router = useRouter(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(response.status === 503 ? json.error.message : "Неверные данные для входа");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Сервис временно недоступен.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-login-card" onSubmit={submit}>
      <strong className="admin-brand">Ежеминутка</strong>
      <h1>Вход для сотрудников</h1>
      <label>
        Логин
        <input name="username" autoComplete="username" required />
      </label>
      <label>
        Пароль
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <button className="admin-primary" disabled={busy}>
        {busy ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}
