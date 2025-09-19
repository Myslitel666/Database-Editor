<script>
  import { TextField, Button } from "svelte-elegant";
  import { onMount } from "svelte";
  import * as fetch from "./fetch";

  let subject = "";

  let subjects;

  onMount(async () => {
    subjects = await fetch.getSubjects();
    console.log(subjects);
  });
</script>

<div class="page">
  <TextField bind:value={subject} label="Subject" width="230px" />
  <Button
    width="230px"
    onClick={() => {
      fetch.createSubject(subject);
    }}>ADD SUBJECT</Button
  >
</div>

<style>
  .page {
    padding-top: 7px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 7px;
  }
</style>
