export async function getSpecialWords(sub) {
    const response = await fetch(`/api/english-assistant/special-words?subject=${sub}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    return data.special_words;
}

export async function getSubjects() {
    const response = await fetch("/api/english-assistant/subjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    return data.subjects.map(s => s.title);
}

export async function createSpecialWord(specialWord, subjectWord) {
    const response = await fetch("/api/english-assistant/special-words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: specialWord.value,
        translate: specialWord.translate,
        example_use: specialWord.example_use,
        level: specialWord.level,
        subject: subjectWord
      }),
    });

    const data = await response.json();
    return data;
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
    return data;
}

export async function deleteSpecialWord(value, subject) {
    const response = await fetch("/api/english-assistant/special-words", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: value,
        subject: subject
      }),
    });

    const data = await response.json();
    return data;
}

export async function deleteSubject(title) {
    const response = await fetch("/api/english-assistant/subjects", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title
      }),
    });

    const data = await response.json();
    return data;
}

export async function updateSpecialWord(specialWord, value, subject) {
    const response = await fetch("/api/english-assistant/special-words", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newValue: specialWord.value,
        translate: specialWord.translate,
        example_use: specialWord.example_use,
        value: value,
        subject: subject,
        level: specialWord.level
      }),
    });

    const data = await response.json();
    return data;
}

export async function updateSubject(title, newTitle) {
    const response = await fetch("/api/english-assistant/subjects", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        newTitle: newTitle
      }),
    });

    const data = await response.json();
    return data;
}