<script>
  import {
    TextField,
    Button,
    AutoComplete,
    TextArea,
    Message,
  } from "svelte-elegant";
  import { onMount } from "svelte";
  import * as fetch from "./fetch";

  let specialWord = {
    value: "",
    translate: "",
    example_use: "",
    level: "D",
  };

  let technology = {
    name: "",
    description: "",
    logo: "",
    data_source: "",
  };

  let feedbackTimer = null;
  let messageFeedback = "";
  let isVisibleFeedback = false;
  let isErrorFeedback = false;
  let subjectWord = "";
  let updateValue = "";
  let updateTechnology = "";
  let wordAction = "Create";
  let subjectAction = "Create";
  let technologies;
  let specialWords;

  // async function getSpecialWords() {
  //   specialWords = await fetch.getSpecialWords(subjectWord);
  // }

  async function getTechnologies() {
    technologies = await fetch.getTechnologies();
  }

  function handleAddingWord() {
    specialWord.value = clearUselessSpaces(specialWord.value);
    specialWord.translate = clearUselessSpaces(specialWord.translate);
    specialWord.level = clearUselessSpaces(specialWord.level);
    specialWord.example_use = clearUselessSpaces(specialWord.example_use);
    subjectWord = clearUselessSpaces(subjectWord);

    if (specialWord.value && specialWord.translate && subjectWord) {
      // if (specialWords.map((s) => s.value).includes(specialWord.value)) {
      //   showMessage(
      //     true,
      //     "Such the Special Word is already in this dictionary"
      //   );
      // } else {
      //   const specialWordCopy = { ...specialWord };
      //   const subjectWordCopy = subjectWord;
      //   toggleWordForm();
      //   showMessage(false, "The special word added successfully");
      //   // fetch
      //   //   .createSpecialWord(specialWordCopy, subjectWordCopy)
      //   //   .then(() => getSpecialWords());
      // }
    } else {
      showMessage(true, "Fill in all the fields");
    }
  }

  function handleUpdatingWord() {
    specialWord.value = clearUselessSpaces(specialWord.value);
    specialWord.translate = clearUselessSpaces(specialWord.translate);
    specialWord.level = clearUselessSpaces(specialWord.level);
    specialWord.example_use = clearUselessSpaces(specialWord.example_use);
    updateValue = clearUselessSpaces(updateValue);
    subjectWord = clearUselessSpaces(subjectWord);

    // if (
    //   specialWord.value &&
    //   specialWord.translate &&
    //   updateValue &&
    //   subjectWord
    // ) {
    //   if (specialWords.map((s) => s.value).includes(updateValue)) {
    //     if (
    //       specialWords.map((s) => s.value).includes(specialWord.value) &&
    //       updateValue !== specialWord.value
    //     ) {
    //       showMessage(
    //         true,
    //         "Such the Special Word is already in this dictionary"
    //       );
    //     } else {
    //       const specialWordCopy = { ...specialWord };
    //       const updateValueCopy = updateValue;
    //       const subjectWordCopy = subjectWord;
    //       toggleWordForm();
    //       showMessage(false, "The special word updated successfully");

    //       // fetch
    //       //   .updateSpecialWord(
    //       //     specialWordCopy,
    //       //     updateValueCopy,
    //       //     subjectWordCopy
    //       //   )
    //       //   .then(() => getSpecialWords());
    //     }
    //   } else {
    //     showMessage(true, "The Special Word you are editing is missing");
    //   }
    // } else {
    //   showMessage(true, "Fill in all the fields");
    // }
  }

  function handleDeletingWord() {
    updateValue = clearUselessSpaces(updateValue);
    subjectWord = clearUselessSpaces(subjectWord);

    if (updateValue && subjectWord) {
      // if (specialWords.map((s) => s.value).includes(updateValue)) {
      //   const updateValueCopy = updateValue;
      //   const subjectWordCopy = subjectWord;
      //   toggleWordForm();
      //   showMessage(false, "The special word deleted successfully");
      //   // fetch
      //   //   .deleteSpecialWord(updateValueCopy, subjectWordCopy)
      //   //   .then(() => getSpecialWords());
      // } else {
      //   showMessage(true, "The Special Word you are deleting is missing");
      // }
    } else {
      showMessage(true, "Fill in all the fields");
    }
  }

  function handleEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault(); // чтобы не срабатывал submit по умолчанию
      if (wordAction === "Create") {
        handleAddingWord();
      } else if (wordAction === "Update") {
        handleUpdatingWord();
      } else if (wordAction === "Delete") {
        handleDeletingWord();
      }
    }
  }

  function toggleWordForm() {
    specialWord = { value: "", translate: "", example_use: "", level: "D" };
    updateValue = "";
  }

  function toggleSubjectForm() {
    technology = {
      name: "",
      description: "",
      logo: "",
      data_source: "",
    };
    updateTechnology = "";
  }

  function showMessage(isError, message) {
    // 1. Сбрасываем предыдущий таймер
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = null;
    }

    // 2. Показываем новое сообщение
    isErrorFeedback = isError;
    messageFeedback = message;
    isVisibleFeedback = true;

    // 3. Запускаем новый таймер
    feedbackTimer = setTimeout(() => {
      isVisibleFeedback = false;
      feedbackTimer = null;
    }, 2750);
  }

  function rusToEng(word, e) {
    const symbol = e.data;
    const errorSymbols = "йцукенгшщзфывапролдячсмить";
    const rightSymbols = "qwertyuiopasdfghjklzxcvbnm";

    const index = errorSymbols.indexOf(symbol); // <- индекс символа

    if (index !== -1) {
      word = word.slice(0, -1) + rightSymbols[index];
    }

    return word;
  }

  $: if (specialWord.value) {
    specialWord.value = specialWord.value.toLowerCase();
  }

  $: if (specialWord.translate) {
    specialWord.translate = specialWord.translate.toLowerCase();
  }

  $: if (specialWord.level) {
    specialWord.level = specialWord.level.toUpperCase();
  }

  $: if (subjectAction) {
    toggleSubjectForm();
  }

  $: if (wordAction) {
    toggleWordForm();
  }

  $: if (subjectWord) {
    //getSpecialWords();
    toggleWordForm();
  }

  $: if (updateTechnology) {
    const upTechnologyObj = technologies.find(
      (s) => s.name === updateTechnology
    );
    if (upTechnologyObj) technology = { ...upTechnologyObj }; // данные с бэка
  }

  function clearUselessSpaces(str) {
    return str.trim().replace(/\s+/g, " ");
  }

  async function downloadBackup() {
    const data = await fetch.getDatabase();

    // создаём Blob из JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    // создаём ссылку и кликаем по ней
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "english-assistant.json"; // имя файла
    a.click();
    URL.revokeObjectURL(url);
  }

  onMount(async () => {
    const test = await fetch.getDatabase();
    //console.log(test);

    technologies = await fetch.getTechnologies();
    console.log("get technologies");
    console.log(technologies);
    //subjectWord = subjects.includes("React") ? "React" : subjects[0];
    //specialWords = await fetch.getSpecialWords(subjectWord);
  });
</script>

<div class="page gap">
  <h2 style:margin="0">Technology Form</h2>
  <AutoComplete
    options={["Create", "Update", "Delete"]}
    bind:value={subjectAction}
    label="Action"
    width="370px"
  />
  {#if subjectAction !== "Create"}
    <AutoComplete
      bind:value={updateTechnology}
      label="Editing Name"
      width="370px"
      options={technologies.map((t) => t.name)}
    />
  {/if}
  {#if subjectAction !== "Delete"}
    <TextField bind:value={technology.name} label="Name" width="370px" />
    <TextField
      bind:value={technology.description}
      label="Description"
      width="370px"
    />
    <TextField bind:value={technology.logo} label="Logo" width="370px" />
    <TextField
      bind:value={technology.data_source}
      label="Data Source"
      width="370px"
    />
  {/if}
  {#if subjectAction === "Create"}
    <Button
      marginBottom="7px"
      width="370px"
      onClick={() => {
        //technology = clearUselessSpaces(technology.name);

        if (technology.name) {
          if (
            technologies &&
            technologies.map((t) => t.name).includes(technology.name)
          ) {
            showMessage(
              true,
              "The technology with that name has already been created"
            );
          } else {
            const technologyCopy = technology;
            toggleSubjectForm();
            showMessage(false, "The technology added successfully");

            fetch
              .createTechnology(technologyCopy)
              .then(() => getTechnologies());
          }
        } else {
          showMessage(true, "Fill in all the fields");
        }
      }}
    >
      ADD TECHNOLOGY
    </Button>
  {:else if subjectAction === "Update"}
    <Button
      marginBottom="7px"
      width="370px"
      onClick={() => {
        updateTechnology = clearUselessSpaces(updateTechnology);
        technology.name = clearUselessSpaces(technology.name);

        if (updateTechnology && technology.name) {
          if (technologies.map((t) => t.name).includes(updateTechnology)) {
            if (
              technologies.map((t) => t.name).includes(technology.name) &&
              updateTechnology !== technology.name
            ) {
              showMessage(
                true,
                "The technology with that name has already been created"
              );
            } else {
              const updateTechnologyCopy = updateTechnology;
              const technologyCopy = technology;
              toggleSubjectForm();
              showMessage(false, "The technology updated successfully");

              fetch
                .updateTechnology(technologyCopy, updateTechnologyCopy)
                .then(() => getTechnologies());
            }
          } else {
            showMessage(true, "The technology you are editing is missing.");
          }
        } else {
          showMessage(true, "Fill in all the fields");
        }
      }}
    >
      UPDATE SUBJECT
    </Button>
  {:else}
    <Button
      marginBottom="7px"
      variant="Outlined"
      borderColor="red"
      color="red"
      bgColorHover="rgba(255,0,0,0.12)"
      width="370px"
      onClick={() => {
        updateTechnology = clearUselessSpaces(updateTechnology);

        if (updateTechnology) {
          if (technologies.map((t) => t.name).includes(updateTechnology)) {
            const updateTechnologyCopy = updateTechnology;
            toggleSubjectForm();
            showMessage(false, "The technology deleted successfully");
            fetch
              .deleteTechnology(updateTechnologyCopy)
              .then(() => getTechnologies());
          } else {
            showMessage(true, "The technology you are deleting is missing.");
          }
        } else {
          showMessage(true, "Fill in all the fields");
        }
      }}
    >
      DELETE SUBJECT
    </Button>
  {/if}
  <div
    class="special-words gap"
    style:position="relative"
    on:keydown={(e) => handleEnter(e)}
  >
    <h2 style:margin="0" style:margin-top="29px">Special Words Form</h2>
    <div class="special-words-block gap">
      <AutoComplete
        options={["Create", "Update", "Delete"]}
        bind:value={wordAction}
        label="Action"
        width="181px"
      />
      <AutoComplete
        options={technologies}
        bind:value={subjectWord}
        label="Subject"
        width="182px"
      />
    </div>
    {#if wordAction !== "Create"}
      <AutoComplete
        bind:value={updateValue}
        oninput={(e) => {
          const symbol = e.data;
          const errorSymbols = "йцукенгшщзфывапролдячсмить";
          const rightSymbols = "qwertyuiopasdfghjklzxcvbnm";

          const index = errorSymbols.indexOf(symbol); // <- индекс символа

          if (index !== -1) {
            updateValue = updateValue.slice(0, -1) + rightSymbols[index];
          }
        }}
        label="Editing Value"
        width="370px"
      />
    {/if}
    {#if wordAction !== "Delete"}
      <TextField
        bind:value={specialWord.value}
        oninput={(e) => {
          specialWord.value = rusToEng(specialWord.value, e);
        }}
        label="Value"
        width="370px"
      />
      <TextField
        bind:value={specialWord.translate}
        oninput={(e) => {
          const symbol = e.data;
          const errorSymbols = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
          const rightSymbols = "йцукенгшщзхъфывапролджэячсмитьбюё";

          const index = errorSymbols.indexOf(symbol); // <- индекс символа

          if (index !== -1) {
            specialWord.translate =
              specialWord.translate.slice(0, -1) + rightSymbols[index];
          }
        }}
        label="Translate"
        width="370px"
      />
      <TextField
        bind:value={specialWord.level}
        label="Level"
        oninput={(e) => {
          specialWord.level = rusToEng(specialWord.level, e);
          if (specialWord.level.length > 1)
            specialWord.level = specialWord.level.slice(1);
        }}
        width="370px"
      />
      <p>Example of Use:</p>
      <TextArea
        bind:value={specialWord.example_use}
        width="370px"
        label="Example of Use"
      />
    {/if}
    {#if wordAction === "Create"}
      <Button width="370px" onClick={handleAddingWord}>ADD SPECIAL WORD</Button>
    {:else if wordAction === "Update"}
      <Button width="370px" onClick={handleUpdatingWord}>
        UPDATE SPECIAL WORD
      </Button>
    {:else}
      <Button
        variant="Outlined"
        borderColor="red"
        color="red"
        bgColorHover="rgba(255,0,0,0.12)"
        width="370px"
        onClick={handleDeletingWord}
      >
        DELETE SPECIAL WORD
      </Button>
    {/if}
    <div class="message">
      <Message
        bind:isVisible={isVisibleFeedback}
        bind:isError={isErrorFeedback}
      >
        {messageFeedback}
      </Message>
    </div>
  </div>
  <h2 style:margin="0" style:margin-top="30px">Export the Database</h2>
  <Button
    marginTop="7px"
    marginBottom="7px"
    width="370px"
    onclick={downloadBackup}>Download</Button
  >
</div>

<style>
  .message {
    position: absolute;
    left: 0;
    margin-bottom: -40px;
  }
  .gap {
    display: flex;
    gap: 7px;
  }

  .special-words {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
  }
  .special-words-block {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page {
    padding-top: 7px;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
</style>
