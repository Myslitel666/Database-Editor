export async function getDatabase() {
  const response = await fetch("/api/english-assistant/export");

  const data = await response.json();
  return data.data; // здесь { subjects: [...], special_words: [...] }
}

export async function getTechnologies() {
    const response = await fetch(`/api/web-database/technologies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    return data.special_words;
}

export async function createTechnology(technology) {
    const response = await fetch("/api/web-database/technologies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: technology.title,
        description: technology.description,
        logo: technology.logo
      }),
    });

    const data = await response.json();
    return data;
}

export async function deleteTechnology(title) {
    const response = await fetch("/api/web-database/technologies", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    const data = await response.json();
    return data;
}

export async function updateTechnology(technology, updateTitle) {
    const response = await fetch("/api/web-database/technologies", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updateTitle,
        description: technology.description,
        logo: technology.logo,
        newTitle: technology.title,
      }),
    });

    const data = await response.json();
    return data;
}