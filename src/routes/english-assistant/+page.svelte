<script>
  import { TextField, Button } from "svelte-elegant";

  let subject = "";

  async function createSubject(sub) {
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
    console.log("Ответ от сервера:", data);
  }
</script>

<div class="page">
  <TextField bind:value={subject} label="Subject" width="230px" />
  <Button
    width="230px"
    onClick={() => {
      createSubject(subject);
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
