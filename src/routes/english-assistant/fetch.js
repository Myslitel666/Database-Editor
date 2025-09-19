export async function getSubjects() {
    const response = await fetch("/api/english-assistant/subjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    return data.subjects.map(s => s.title);;
}

export async function createSubject(sub) {
    const response = await fetch("/api/english-assistant/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: sub,
      }),
    });

    const data = await response.json();
    console.log("Ответ от сервера: ", data);
    return data;
}