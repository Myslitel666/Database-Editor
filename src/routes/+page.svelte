<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  function navigate() {
    goto("/english-assistant");
  }

  onMount(() => {
    navigate();
  });
</script>
