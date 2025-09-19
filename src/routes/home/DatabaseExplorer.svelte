<!-- src/components/DatabaseMenu.svelte -->
<script>
  import { Button, Modal } from "svelte-elegant";
  import { DatabasePro, NotebookPro, Plus } from "svelte-elegant/icons-elegant";
  import { onMount } from "svelte";
  import { xMobile } from "$lib/stores/xMobileStore";
  import {
    databaseName,
    tablesList,
    selectedTable,
    databaseActions,
  } from "$lib/stores/databaseExplorerStore";

  export let width = "30%";

  let isOpenModal = false;

  onMount(() => {
    databaseActions.loadDatabase();
  });
</script>

<div class:menu={$xMobile} style:width>
  <Modal bind:isOpen={isOpenModal}>
    <div>
      <p>Name</p>
    </div>
  </Modal>

  <div style:justify-content="center">
    <div
      class="datapase-pro"
      style:display="flex"
      style:align-items="center"
      style:margin-left={$xMobile ? "-2.5rem" : "0.1rem"}
    >
      <DatabasePro size="2.5rem" />
      <p style:font-weight="600">{$databaseName}</p>
    </div>
    {#each $tablesList as table}
      <button
        class="table-btn"
        style:font-size="16px"
        style:display="flex"
        style:align-items="center"
        style:margin-left={$xMobile ? "" : "2.5rem"}
        style:margin-top="0.5rem"
        on:click={() => {
          databaseActions.loadTableColumns(table.table_name);
          $selectedTable = table.table_name;
        }}
      >
        <NotebookPro size="2rem" />
        <p
          style:margin-left="0.22rem"
          style:font-weight={table.table_name === $selectedTable ? 600 : 400}
          style:font-size="16px"
        >
          {table.table_name}
        </p>
      </button>
    {/each}
  </div>

  <Button
    marginTop="0.5rem"
    width="16rem"
    variant="Outlined"
    onclick={() => {
      isOpenModal = true;
    }}
  >
    <div style:margin-top="0.25rem" style:margin-left="-0.66rem">
      <Plus />
    </div>
    Create Table
  </Button>
</div>

<style>
  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
