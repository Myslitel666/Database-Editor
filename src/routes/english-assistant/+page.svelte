<script>
  import { TextField, Button, AutoComplete, TextArea } from "svelte-elegant";
  import { onMount } from "svelte";
  import * as fetch from "./fetch";

  let specialWord = {
    value: "",
    translate: "",
    example_use: "",
  };

  let subjectWord = "";
  let subject = "";
  let updateValue = "";
  let updateSubject = "";
  let wordAction = "Create";
  let subjectAction = "Create";
  let subjects;
  let specialWords;

  async function getSpecialWords() {
    specialWords = await fetch.getSpecialWords(subjectWord);
    console.log(specialWords);
  }

  async function getSubjects() {
    subjects = await fetch.getSubjects();
    console.log(subjects);
  }

  function toggleWordForm() {
    specialWord = { value: "", translate: "", example_use: "" };
    updateValue = "";
  }

  function toggleSubjectForm() {
    subject = "";
    updateSubject = "";
  }

  $: if (subjectAction) {
    toggleSubjectForm();
  }

  $: if (wordAction) {
    toggleWordForm();
  }

  $: if (subjectWord) {
    getSpecialWords();
    toggleWordForm();
  }

  $: {
    if (updateValue) {
      console.log("update: " + updateValue);
      const updateWord = specialWords.find((s) => s.value === updateValue);
      if (updateWord) specialWord = updateWord; // данные с бэка
      console.log(specialWord);
    }
  }

  onMount(async () => {
    subjects = await fetch.getSubjects();
    subjectWord = subjects.includes("React") ? "React" : subjects[0];
    specialWords = await fetch.getSpecialWords(subjectWord);

    console.log(specialWords);
  });
</script>

<div class="page gap">
  <div class="special-words gap">
    <h2 style:margin="0">Special Words Form</h2>
    <div class="special-words-block gap">
      <AutoComplete
        isSelect
        options={["Create", "Update", "Delete"]}
        bind:value={wordAction}
        label="Action"
        width="181px"
      />
      <AutoComplete
        isSelect
        options={subjects}
        bind:value={subjectWord}
        label="Subject"
        width="182px"
      />
    </div>
    {#if wordAction !== "Create"}
      <AutoComplete
        options={specialWords.map((s) => s.value)}
        bind:value={updateValue}
        label="Editing Value"
        width="370px"
      />
    {/if}
    {#if wordAction !== "Delete"}
      <TextField bind:value={specialWord.value} label="Value" width="370px" />
      <TextField
        bind:value={specialWord.translate}
        label="Translate"
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
      <Button
        width="370px"
        onClick={() => {
          fetch
            .createSpecialWord(specialWord, subjectWord)
            .then(() => getSpecialWords())
            .then(() => toggleWordForm());
        }}
      >
        ADD SPECIAL WORD
      </Button>
    {:else if wordAction === "Update"}
      <Button
        width="370px"
        onClick={() => {
          //fetch.createSubject(subject);
          getSpecialWords();
        }}
      >
        UPDATE SPECIAL WORD
      </Button>
    {:else}
      <Button
        variant="Outlined"
        borderColor="red"
        color="red"
        bgColorHover="rgba(255,0,0,0.12)"
        width="370px"
        onClick={() => {
          fetch
            .deleteSpecialWord(updateValue, subjectWord)
            .then(() => getSpecialWords())
            .then(() => toggleWordForm());
        }}
      >
        DELETE SPECIAL WORD
      </Button>
    {/if}
  </div>

  <h2 style:margin="0" style:margin-top="29px">Subject Form</h2>
  <AutoComplete
    isSelect
    options={["Create", "Update", "Delete"]}
    bind:value={subjectAction}
    label="Action"
    width="370px"
  />
  {#if subjectAction !== "Create"}
    <AutoComplete
      isSelect
      bind:value={updateSubject}
      label="Editing Subject"
      width="370px"
      options={subjects}
    />
  {/if}
  {#if subjectAction !== "Delete"}
    <TextField bind:value={subject} label="Subject" width="370px" />
  {/if}
  {#if subjectAction === "Create"}
    <Button
      marginBottom="7px"
      width="370px"
      onClick={() => {
        const subjectCopy = subject;
        toggleSubjectForm();

        fetch.createSubject(subjectCopy).then(() => getSubjects());
      }}
    >
      ADD SUBJECT
    </Button>
  {:else if subjectAction === "Update"}
    <Button
      marginBottom="7px"
      width="370px"
      onClick={() => {
        const updateSubjectCopy = updateSubject;
        const subjectCopy = subject;
        toggleSubjectForm();

        fetch
          .updateSubject(updateSubjectCopy, subjectCopy)
          .then(() => getSubjects());
      }}
    >
      UPDATE SUBJECT
    </Button>
  {:else}
    <Button
      variant="Outlined"
      borderColor="red"
      color="red"
      bgColorHover="rgba(255,0,0,0.12)"
      width="370px"
      onClick={() => {
        const updateSubjectCopy = updateSubject;
        toggleSubjectForm();

        fetch.deleteSubject(updateSubjectCopy).then(() => getSubjects());
      }}
    >
      DELETE SUBJECT
    </Button>
  {/if}
</div>

<style>
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
