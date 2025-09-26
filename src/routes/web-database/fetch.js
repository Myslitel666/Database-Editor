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
    return data.technologies;
}

export async function createTechnology(technology) {
    const response = await fetch("/api/web-database/technologies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: technology.name,
        description: technology.description,
        logo: technology.logo
      }),
    });

    const data = await response.json();
    return data;
}

export async function deleteTechnology(name) {
    const response = await fetch("/api/web-database/technologies", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    });

    const data = await response.json();
    return data;
}

export async function updateTechnology(technology, updatename) {
  console.log(technology)
  console.log('updatename: ' + updatename)
    const response = await fetch("/api/web-database/technologies", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updatename,
        description: technology.description,
        logo: technology.logo,
        newname: technology.name,
      }),
    });

    const data = await response.json();
    return data;
}