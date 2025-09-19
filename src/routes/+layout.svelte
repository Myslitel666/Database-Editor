<script>
  import { ThemeProvider, ScrollbarContainer } from "svelte-elegant";

  import Header from "../components/layout/Header.svelte";
</script>

<ThemeProvider>
  <Header height="3.5rem" />
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
