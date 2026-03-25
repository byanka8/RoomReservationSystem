// helper function for re-authentication

export async function reAuthenticate(userId: string, password: string) {
  const res = await fetch("/api/reAuthenticate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return true; // verification passed
}