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
  let wordAction = "Create";
  let subjectAction = "Create";
  let subjects;
  let specialWords;

  async function getSpecialWords() {
    specialWords = await fetch.getSpecialWords(subjectWord);
    console.log(specialWords);
  }

  $: {
    if (subjectWord) {
      getSpecialWords();
      specialWord = { value: "", translate: "", example_use: "" };
    }
  }

  $: {
    if (updateValue) {
      (specialWord = specialWords.find((s) => s.value === updateValue)), // данные с бэка
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
    {#if wordAction === "Update"}
      <AutoComplete
        options={specialWords.map((s) => s.value)}
        bind:value={updateValue}
        label="Editing Value"
        width="370px"
      />
    {/if}
    <TextField bind:value={specialWord.value} label="Value" width="370px" />
    {#if wordAction !== "Delete"}
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
          fetch.createSpecialWord(specialWord, subjectWord);
        }}
      >
        ADD SPECIAL WORD
      </Button>
    {:else if wordAction === "Update"}
      <Button
        width="370px"
        onClick={() => {
          //fetch.createSubject(subject);
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
          //fetch.createSubject(subject);
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
  {#if subjectAction === "Update"}
    <AutoComplete
      isSelect
      label="Editing Subject"
      width="370px"
      options={subjects}
    />
  {/if}
  <TextField bind:value={subject} label="Subject" width="370px" />
  {#if subjectAction === "Create"}
    <Button
      marginBottom="7px"
      width="370px"
      onClick={() => {
        fetch.createSubject(subject);
      }}
    >
      ADD SUBJECT
    </Button>
  {:else if subjectAction === "Update"}
    <Button
      marginBottom="7px"
      width="370px"
      onClick={() => {
        fetch.createSubject(subject);
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
        //fetch.createSubject(subject);
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
