<script>
  import {
    ColorThemeSwitch,
    Header,
    LangSelector,
    ImageThemeTransition,
  } from "svelte-elegant";
  import { themeStore } from "svelte-elegant/stores";
  import { languageStore } from "$lib/stores/language";

  let lg = "en";
  let theme;

  $: if (lg) $languageStore = lg;
  // Подписываемся на изменения темы
  themeStore.subscribe((value) => {
    theme = value;
  });

  //Styles
  $: primary = theme?.palette.primary;
</script>

<Header {...$$props}>
  <a href="/home" style:text-decoration="none">
    <button>
      <ImageThemeTransition
        size="2.75rem"
        srcImages={["/light.png", "/dark.png"]}
        transitionSeconds="0.25"
      />
      <p class="logo-p">
        <span style:color={primary}> SQL Viewer </span>
      </p>
    </button>
  </a>
  <div
    style:display="flex"
    style:align-items="center"
    style:margin-left="auto"
    style:margin-right="0.25rem"
  >
    <LangSelector marginRight="0.25rem" />
    <ColorThemeSwitch />
  </div>
</Header>

<style>
  .logo-p {
    margin-left: 0.25rem;
    font-size: 26px;
  }

  .logo:hover {
    transform: scale(1.2);
  }
</style>
