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
  };

  let feedbackTimer = null;
  let messageFeedback = "";
  let isVisibleFeedback = false;
  let isErrorFeedback = false;
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
  }

  async function getSubjects() {
    subjects = await fetch.getSubjects();
  }

  function toggleWordForm() {
    specialWord = { value: "", translate: "", example_use: "" };
    updateValue = "";
  }

  function toggleSubjectForm() {
    subject = "";
    updateSubject = "";
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

  $: if (updateValue) {
    const updateWord = specialWords.find((s) => s.value === updateValue);
    if (updateWord) specialWord = updateWord; // данные с бэка
  }

  onMount(async () => {
    subjects = await fetch.getSubjects();
    subjectWord = subjects.includes("React") ? "React" : subjects[0];
    specialWords = await fetch.getSpecialWords(subjectWord);
  });
</script>

<div class="page gap">
  <div class="special-words gap" style:position="relative">
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
          if (specialWord.value && specialWord.translate && subjectWord) {
            const specialWordCopy = {
              value: specialWord.value,
              translate: specialWord.translate,
              example_use: specialWord.example_use,
            };
            const subjectWordCopy = subjectWord;
            toggleWordForm();
            showMessage(false, "The special word added successfully");

            fetch
              .createSpecialWord(specialWordCopy, subjectWordCopy)
              .then(() => getSpecialWords());
          } else {
            showMessage(true, "Fill in all the fields");
          }
        }}
      >
        ADD SPECIAL WORD
      </Button>
    {:else if wordAction === "Update"}
      <Button
        width="370px"
        onClick={() => {
          if (
            specialWord.value &&
            specialWord.translate &&
            updateValue &&
            subjectWord
          ) {
            const specialWordCopy = {
              value: specialWord.value,
              translate: specialWord.translate,
              example_use: specialWord.example_use,
            };
            const updateValueCopy = updateValue;
            const subjectWordCopy = subjectWord;
            toggleWordForm();
            showMessage(false, "The special word updated successfully");

            fetch
              .updateSpecialWord(
                specialWordCopy,
                updateValueCopy,
                subjectWordCopy
              )
              .then(() => getSpecialWords());
          } else {
            showMessage(true, "Fill in all the fields");
          }
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
          if (updateValue && subjectWord) {
            const updateValueCopy = updateValue;
            const subjectWordCopy = subjectWord;
            toggleWordForm();
            showMessage(false, "The special word deleted successfully");

            fetch
              .deleteSpecialWord(updateValueCopy, subjectWordCopy)
              .then(() => getSpecialWords());
          } else {
            showMessage(true, "Fill in all the fields");
          }
        }}
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
        if (subject) {
          const subjectCopy = subject;
          toggleSubjectForm();
          showMessage(false, "The subject added successfully");

          fetch.createSubject(subjectCopy).then(() => getSubjects());
        } else {
          showMessage(true, "Fill in all the fields");
        }
      }}
    >
      ADD SUBJECT
    </Button>
  {:else if subjectAction === "Update"}
    <Button
      marginBottom="7px"
      width="370px"
      onClick={() => {
        if (updateSubject && subject) {
          const updateSubjectCopy = updateSubject;
          const subjectCopy = subject;
          toggleSubjectForm();
          showMessage(false, "The subject updated successfully");

          fetch
            .updateSubject(updateSubjectCopy, subjectCopy)
            .then(() => getSubjects());
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
        if (updateSubject) {
          const updateSubjectCopy = updateSubject;
          toggleSubjectForm();
          showMessage(false, "The subject deleted successfully");

          fetch.deleteSubject(updateSubjectCopy).then(() => getSubjects());
        } else {
          showMessage(true, "Fill in all the fields");
        }
      }}
    >
      DELETE SUBJECT
    </Button>
  {/if}
</div>

<style>
  .message {
    position: absolute;
    bottom: 0;
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
