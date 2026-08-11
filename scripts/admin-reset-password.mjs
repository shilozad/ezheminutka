import { args, password, hash, pool } from "./admin-cli-common.mjs";
const username = args().username?.trim().toLowerCase();
if (!username) throw new Error("Укажите --username.");
const db = await pool();
try {
  const result = await db.query(
    "UPDATE admin_users SET password_hash=$2,session_version=session_version+1,updated_at=NOW() WHERE username=$1",
    [username, await hash(await password())],
  );
  if (!result.rowCount) throw new Error("Пользователь не найден.");
  console.log(`Пароль ${username} изменён, старые сессии завершены.`);
} finally {
  await db.end();
}
