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
        subject: subjectWord
      }),
    });

    const data = await response.json();
    console.log("Ответ от сервера: ", data);
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
    console.log("Ответ от сервера: ", data);
    return data;
}