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
    level: "B",
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

  function handleAddingWord() {
    specialWord.value = clearUselessSpaces(specialWord.value);
    specialWord.translate = clearUselessSpaces(specialWord.translate);
    specialWord.level = clearUselessSpaces(specialWord.level);
    subjectWord = clearUselessSpaces(subjectWord);

    if (specialWord.value && specialWord.translate && subjectWord) {
      if (specialWords.map((s) => s.value).includes(specialWord.value)) {
        showMessage(
          true,
          "Such the Special Word is already in this dictionary"
        );
      } else {
        const specialWordCopy = { ...specialWord };
        const subjectWordCopy = subjectWord;
        toggleWordForm();
        showMessage(false, "The special word added successfully");

        fetch
          .createSpecialWord(specialWordCopy, subjectWordCopy)
          .then(() => getSpecialWords());
      }
    } else {
      showMessage(true, "Fill in all the fields");
    }
  }

  function handleUpdatingWord() {
    specialWord.value = clearUselessSpaces(specialWord.value);
    specialWord.translate = clearUselessSpaces(specialWord.translate);
    specialWord.level = clearUselessSpaces(specialWord.level);
    updateValue = clearUselessSpaces(updateValue);
    subjectWord = clearUselessSpaces(subjectWord);

    if (
      specialWord.value &&
      specialWord.translate &&
      updateValue &&
      subjectWord
    ) {
      console.log(specialWords);
      if (specialWords.map((s) => s.value).includes(updateValue)) {
        if (
          specialWords.map((s) => s.value).includes(specialWord.value) &&
          updateValue !== specialWord.value
        ) {
          showMessage(
            true,
            "Such the Special Word is already in this dictionary"
          );
        } else {
          const specialWordCopy = { ...specialWord };
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
        }
      } else {
        showMessage(true, "The Special Word you are editing is missing");
      }
    } else {
      showMessage(true, "Fill in all the fields");
    }
  }

  function handleDeletingWord() {
    updateValue = clearUselessSpaces(updateValue);
    subjectWord = clearUselessSpaces(subjectWord);

    if (updateValue && subjectWord) {
      if (specialWords.map((s) => s.value).includes(updateValue)) {
        const updateValueCopy = updateValue;
        const subjectWordCopy = subjectWord;
        toggleWordForm();
        showMessage(false, "The special word deleted successfully");
        fetch
          .deleteSpecialWord(updateValueCopy, subjectWordCopy)
          .then(() => getSpecialWords());
      } else {
        showMessage(true, "The Special Word you are deleting is missing");
      }
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
    specialWord = { value: "", translate: "", example_use: "", level: "B" };
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
    getSpecialWords();
    toggleWordForm();
  }

  $: if (updateValue) {
    const updateWord = specialWords.find((s) => s.value === updateValue);
    if (updateWord) specialWord = { ...updateWord }; // данные с бэка
  }

  function clearUselessSpaces(str) {
    return str.trim().replace(/\s+/g, " ");
  }

  onMount(async () => {
    subjects = await fetch.getSubjects();
    subjectWord = subjects.includes("React") ? "React" : subjects[0];
    specialWords = await fetch.getSpecialWords(subjectWord);
  });
</script>

<div class="page gap">
  <div
    class="special-words gap"
    style:position="relative"
    on:keydown={(e) => handleEnter(e)}
  >
    <h2 style:margin="0">Special Words Form</h2>
    <div class="special-words-block gap">
      <AutoComplete
        options={["Create", "Update", "Delete"]}
        bind:value={wordAction}
        label="Action"
        width="181px"
      />
      <AutoComplete
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
      <TextField
        bind:value={specialWord.value}
        oninput={(e) => {
          const symbol = e.data;
          const errorSymbols = "йцукенгшщзфывапролджэячсмить";
          const rightSymbols = "qwertyuiopasdfghjklzxcvbnm";

          const index = errorSymbols.indexOf(symbol); // <- индекс символа

          if (index !== -1) {
            specialWord.value = specialWord.value.substring(
              0,
              specialWord.value.length - 1
            );

            specialWord.value += rightSymbols[index];
          }
        }}
        label="Value"
        width="370px"
      />
      <TextField
        bind:value={specialWord.translate}
        oninput={(e) => {
          const symbol = e.data;
          const errorSymbols = "qwertyuiop[]asdfghjkl;'zxcvbnm,.";
          const rightSymbols = "йцукенгшщзхъфывапролджэячсмитьбю";

          const index = errorSymbols.indexOf(symbol); // <- индекс символа

          if (index !== -1) {
            specialWord.translate = specialWord.translate.substring(
              0,
              specialWord.translate.length - 1
            );

            specialWord.translate += rightSymbols[index];
          }
        }}
        label="Translate"
        width="370px"
      />
      <TextField bind:value={specialWord.level} label="Level" width="370px" />
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
  <h2 style:margin="0" style:margin-top="29px">Subject Form</h2>
  <AutoComplete
    options={["Create", "Update", "Delete"]}
    bind:value={subjectAction}
    label="Action"
    width="370px"
  />
  {#if subjectAction !== "Create"}
    <AutoComplete
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
        subject = clearUselessSpaces(subject);

        if (subject) {
          console.log(subjects);
          if (subjects.includes(subject)) {
            showMessage(
              true,
              "The subject with that name has already been created"
            );
          } else {
            const subjectCopy = subject;
            toggleSubjectForm();
            showMessage(false, "The subject added successfully");

            fetch.createSubject(subjectCopy).then(() => getSubjects());
          }
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
        updateSubject = clearUselessSpaces(updateSubject);
        subject = clearUselessSpaces(subject);

        if (updateSubject && subject) {
          if (subjects.includes(updateSubject)) {
            console.log(subjects);
            if (subjects.includes(subject)) {
              showMessage(
                true,
                "The subject with that name has already been created"
              );
            } else {
              const updateSubjectCopy = updateSubject;
              const subjectCopy = subject;
              toggleSubjectForm();
              showMessage(false, "The subject updated successfully");

              fetch
                .updateSubject(updateSubjectCopy, subjectCopy)
                .then(() => getSubjects());
            }
          } else {
            showMessage(true, "The subject you are editing is missing.");
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
        updateSubject = clearUselessSpaces(updateSubject);

        if (updateSubject) {
          if (subjects.includes(updateSubject)) {
            const updateSubjectCopy = updateSubject;
            toggleSubjectForm();
            showMessage(false, "The subject deleted successfully");
            fetch.deleteSubject(updateSubjectCopy).then(() => getSubjects());
          } else {
            showMessage(true, "The subject you are deleting is missing.");
          }
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
