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

  let section = {
    title: "",
    position: "",
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
  let sectionTecnology = "";
  let updateSectionTitle = "";
  let updateTechnology = "";
  let sectionAction = "Create";
  let subjectAction = "Create";
  let technologies;
  let sections;

  // async function getSections() {
  //   specialWords = await fetch.getSpecialWords(subjectWord);
  // }

  async function getTechnologies() {
    technologies = await fetch.getTechnologies();
  }

  function handleAddingSection() {
    section.value = clearUselessSpaces(section.value);
    section.translate = clearUselessSpaces(section.translate);
    section.level = clearUselessSpaces(section.level);
    section.example_use = clearUselessSpaces(section.example_use);
    sectionTecnology = clearUselessSpaces(sectionTecnology);

    if (section.value && section.translate && sectionTecnology) {
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

  function handleUpdatingSection() {
    section.value = clearUselessSpaces(section.value);
    section.translate = clearUselessSpaces(section.translate);
    section.level = clearUselessSpaces(section.level);
    section.example_use = clearUselessSpaces(section.example_use);
    updateSectionTitle = clearUselessSpaces(updateSectionTitle);
    sectionTecnology = clearUselessSpaces(sectionTecnology);

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

  function handleDeletingSection() {
    updateSectionTitle = clearUselessSpaces(updateSectionTitle);
    sectionTecnology = clearUselessSpaces(sectionTecnology);

    if (updateSectionTitle && sectionTecnology) {
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
      if (sectionAction === "Create") {
        handleAddingSection();
      } else if (sectionAction === "Update") {
        handleUpdatingSection();
      } else if (sectionAction === "Delete") {
        handleDeletingSection();
      }
    }
  }

  function toggleSectionForm() {
    section = { position: "", title: "" };
    updateSectionTitle = "";
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

  $: if (section.value) {
    section.value = section.value.toLowerCase();
  }

  $: if (section.translate) {
    section.translate = section.translate.toLowerCase();
  }

  $: if (section.level) {
    section.level = section.level.toUpperCase();
  }

  $: if (subjectAction) {
    toggleSubjectForm();
  }

  $: if (sectionAction) {
    toggleSectionForm();
  }

  $: if (sectionTecnology) {
    //getSpecialWords();
    toggleSectionForm();
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
    //subjectWord = subjects.includes("React") ? "React" : subjects[0];
    //specialWords = await fetch.getSpecialWords(subjectWord);
  });
</script>

<div class="page gap">
  <div
    class="special-words gap"
    style:position="relative"
    on:keydown={(e) => handleEnter(e)}
  >
    <h2 style:margin="0">Section Form</h2>
    <div class="special-words-block gap">
      <AutoComplete
        options={["Create", "Update", "Delete"]}
        bind:value={sectionAction}
        label="Action"
        width="111px"
      />
      <AutoComplete
        options={technologies ? technologies.map((t) => t.name) : []}
        bind:value={sectionTecnology}
        label="Tecnology"
        width="252px"
      />
    </div>
    {#if sectionAction !== "Create"}
      <AutoComplete
        bind:value={updateSectionTitle}
        label="Editing Section"
        width="370px"
      />
    {/if}
    {#if sectionAction !== "Delete"}
      <TextField bind:value={section.value} label="Section" width="370px" />
      <TextField bind:value={section.position} label="Position" width="370px" />
    {/if}
    {#if sectionAction === "Create"}
      <Button width="370px" onClick={handleAddingSection}>ADD SECTION</Button>
    {:else if sectionAction === "Update"}
      <Button width="370px" onClick={handleUpdatingSection}
        >UPDATE SECTION</Button
      >
    {:else}
      <Button
        variant="Outlined"
        borderColor="red"
        color="red"
        bgColorHover="rgba(255,0,0,0.12)"
        width="370px"
        onClick={handleDeletingSection}
      >
        DELETE SECTION
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
  <h2 style:margin="0" style:margin-top="29px">Technology Form</h2>
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
      options={technologies ? technologies.map((t) => t.name) : []}
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
      UPDATE TECHNOLOGY
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
      DELETE TECHNOLOGY
    </Button>
  {/if}
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
