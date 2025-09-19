<script>
  import { ThemeProvider, ScrollbarContainer } from "svelte-elegant";

  import Header from "../components/layout/Header.svelte";
</script>

<Header height="3.5rem" />
<ThemeProvider>
  <ScrollbarContainer>
    <div class="app">
      <main>
        <slot />
      </main>
    </div>
  </ScrollbarContainer>
</ThemeProvider>

<style>
  .app {
    padding-left: 0.5rem;
  }
</style>
