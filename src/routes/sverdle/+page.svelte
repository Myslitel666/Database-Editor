<script>
  import { onMount } from "svelte";

  let data = [{ id: -1, test_field1: "", test_field2: "" }];

  onMount(async () => {
    const response = await fetch("/api/data"); // вызываем API эндпоинт
    if (!response.ok)
      throw new Error(`Ошибка загрузки данных: ${response.statusText}`);

    data = await response.json(); // разбираем JSON-ответ

    console.log(data);
  });
</script>

<div class="content">
  <div
    class="main-box"
    style:margin-top="0.25rem"
    style:border="solid #d2d2d2 1px"
    style:background-color="#fafafa"
  >
    {#each data as item}
      <li>
        <strong>ID:</strong>
        {item.id} <br />
        <strong>Test Field 1:</strong>
        {item.test_field1} <br />
        <strong>Test Field 2:</strong>
        {item.test_field2}
      </li>
    {/each}
  </div>
</div>

<style>
  .content {
    margin-left: 1rem;
    margin-right: 1rem;
    display: flex;
    flex-direction: column; /* Располагает элементы в колонку */
    align-items: center;
    justify-content: center; /* Центрирует по горизонтали */
  }

  .main-box {
    position: relative;
    padding: 1rem;
    display: flex;
    flex-direction: column; /* Располагает элементы вертикально */
    align-items: center; /* Опционально: центрирует элементы по горизонтали */
    width: 650px;
    border-radius: 7px;
    gap: 0.2rem;
  }

  @media (max-width: 725px) {
    .main-box {
      width: 100%; /* Ширина main-box станет 100% на экранах меньше 768px */
    }

    .content {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>
