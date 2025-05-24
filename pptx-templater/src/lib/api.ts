export async function uploadDeck(form: FormData): Promise<Response> {
  return fetch("/generate", {
    method: "POST",
    body: form,
  });
}
