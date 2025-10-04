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

export async function getSections(technologyName) {
    const response = await fetch(`/api/web-database/sections?technology=${technologyName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    console.log(data)
    return data.sections;
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
        logo: technology.logo,
        data_source: technology.data_source,
      }),
    });

    const data = await response.json();
    return data;
}

export async function createSection(technologyName, section) {
    const response = await fetch("/api/web-database/sections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: section.title,
        position: section.position,
        technologyName: technologyName
      }),
    });

    const data = await response.json();
    return data;
}

export async function deleteSection(technologyName, title) {
    const response = await fetch("/api/web-database/sections", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        technologyName: technologyName,
      }),
    });

    const data = await response.json();
    return data;
}

export async function updateSection(technologyName, sectionTitle, section) {
    const response = await fetch("/api/web-database/sections", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        technologyName: technologyName,
        title: sectionTitle,
        newTitle: section.title,
        position: section.position,
      }),
    });

    const data = await response.json();
    return data;
}