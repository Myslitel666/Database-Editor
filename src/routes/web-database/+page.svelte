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
  let selectedTecnology = "";
  let updateSectionTitle = "";
  let updateTechnology = "";
  let sectionAction = "Create";
  let subjectAction = "Create";
  let technologies;
  let sections;
  let sectionTypes;
  let sectionType = "Chapter";

  async function getSections() {
    sections = await fetch.getSections(selectedTecnology, sectionType);
  }

  async function getTechnologies() {
    technologies = await fetch.getTechnologies();
  }

  $: if (selectedTecnology) {
    getSections();
  }

  function handleAddingSection() {
    if (sectionType && section.title && selectedTecnology) {
      section.title = clearUselessSpaces(section.title);
      selectedTecnology = clearUselessSpaces(selectedTecnology);
      sectionType = clearUselessSpaces(sectionType);

      if (sections.map((s) => s.title).includes(section.title)) {
        showMessage(true, "Such the section is already in this summary");
      } else {
        const sectionCopy = { ...section };
        const selectedTecnologyCopy = selectedTecnology;
        const sectionTypeCopy = sectionType;
        toggleSectionForm();
        showMessage(false, "The section added successfully");
        fetch
          .createSection(selectedTecnologyCopy, sectionTypeCopy, sectionCopy)
          .then(() => getSections());
      }
    } else {
      showMessage(true, "Fill in all the fields");
    }
  }

  function handleUpdatingSection() {
    if (
      selectedTecnology &&
      sectionType &&
      section.title &&
      section.position &&
      updateSectionTitle
    ) {
      section.title = clearUselessSpaces(section.title);
      updateSectionTitle = clearUselessSpaces(updateSectionTitle);
      selectedTecnology = clearUselessSpaces(selectedTecnology);
      sectionType = clearUselessSpaces(sectionType);

      if (sections.map((s) => s.title).includes(updateSectionTitle)) {
        if (
          sections.map((s) => s.title).includes(section.title) &&
          updateSectionTitle !== section.title
        ) {
          showMessage(true, "Such the section is already in this summary");
        } else {
          const sectionCopy = { ...section };
          const sectionTitleCopy = updateSectionTitle;
          const technologyCopy = selectedTecnology;
          const sectionTypeCopy = sectionType;
          toggleSectionForm();
          showMessage(false, "The section updated successfully");

          fetch
            .updateSection(
              technologyCopy,
              sectionTypeCopy,
              sectionTitleCopy,
              sectionCopy
            )
            .then(() => getSections());
        }
      } else {
        showMessage(true, "The section you are editing is missing");
      }
    } else {
      showMessage(true, "Fill in all the fields");
    }
  }

  function handleDeletingSection() {
    if (selectedTecnology && sectionType && updateSectionTitle) {
      updateSectionTitle = clearUselessSpaces(updateSectionTitle);
      selectedTecnology = clearUselessSpaces(selectedTecnology);
      sectionType = clearUselessSpaces(sectionType);

      if (sections.map((s) => s.title).includes(updateSectionTitle)) {
        const sectionTitleCopy = updateSectionTitle;
        const technologyCopy = selectedTecnology;
        const sectionTypeCopy = sectionType;
        toggleSectionForm();
        showMessage(false, "The section deleted successfully");
        fetch
          .deleteSection(technologyCopy, sectionTypeCopy, sectionTitleCopy)
          .then(() => getSections());
      } else {
        showMessage(true, "The section you are deleting is missing");
      }
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

  function toggleTechnologyForm() {
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

  $: if (sectionAction) {
    toggleSectionForm();
  }

  $: if (selectedTecnology && sectionType) {
    getSections();
    toggleSectionForm();
  }

  $: if (updateTechnology) {
    const upTechnologyObj = technologies.find(
      (s) => s.name === updateTechnology
    );
    if (upTechnologyObj) technology = { ...upTechnologyObj }; // данные с бэка
  }

  $: if (updateSectionTitle) {
    //Создаём копию объекта, чтобы не редачить section, как элемент списка sections
    section = { ...sections.find((s) => s.title === updateSectionTitle) };
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
    technologies = await fetch.getTechnologies();
    const sectionTypesJSON = await fetch.getSectionTypes();
    sectionTypes = sectionTypesJSON.map((s) => s.value);
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
        options={sectionTypes ? sectionTypes : []}
        bind:value={sectionType}
        label="Type"
        width="120px"
      />
      <AutoComplete
        options={technologies ? technologies.map((t) => t.name) : []}
        bind:value={selectedTecnology}
        label="Tecnology"
        width="195px"
      />
    </div>
    {#if sectionAction !== "Create"}
      <AutoComplete
        bind:value={updateSectionTitle}
        options={sections ? sections.map((t) => t.title) : []}
        label="Editing Section"
        width="440px"
      />
    {/if}
    {#if sectionAction !== "Delete"}
      <TextField bind:value={section.title} label="Section" width="440px" />
      <TextField bind:value={section.position} label="Position" width="440px" />
    {/if}
    {#if sectionAction === "Create"}
      <Button width="440px" onClick={handleAddingSection}>ADD SECTION</Button>
    {:else if sectionAction === "Update"}
      <Button width="440px" onClick={handleUpdatingSection}
        >UPDATE SECTION</Button
      >
    {:else}
      <Button
        variant="Outlined"
        borderColor="red"
        color="red"
        bgColorHover="rgba(255,0,0,0.12)"
        width="440px"
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
    width="440px"
  />
  {#if subjectAction !== "Create"}
    <AutoComplete
      bind:value={updateTechnology}
      label="Editing Name"
      width="440px"
      options={technologies ? technologies.map((t) => t.name) : []}
    />
  {/if}
  {#if subjectAction !== "Delete"}
    <TextField bind:value={technology.name} label="Name" width="440px" />
    <TextField
      bind:value={technology.description}
      label="Description"
      width="440px"
    />
    <TextField bind:value={technology.logo} label="Logo" width="440px" />
    <TextField
      bind:value={technology.data_source}
      label="Data Source"
      width="440px"
    />
  {/if}
  {#if subjectAction === "Create"}
    <Button
      marginBottom="7px"
      width="440px"
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
            toggleTechnologyForm();
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
      width="440px"
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
              toggleTechnologyForm();
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
      width="440px"
      onClick={() => {
        updateTechnology = clearUselessSpaces(updateTechnology);

        if (updateTechnology) {
          if (technologies.map((t) => t.name).includes(updateTechnology)) {
            const updateTechnologyCopy = updateTechnology;
            toggleTechnologyForm();
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
    width="440px"
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
