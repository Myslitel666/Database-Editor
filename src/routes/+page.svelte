<script>
  //Styles
  import { themeStore } from "svelte-elegant/stores";
  import { languageStore } from "../lib/stores/language";

  let theme;
  // Подписываемся на изменения темы
  themeStore.subscribe((value) => {
    theme = value;
  });

  $: lg = $languageStore;
  $: primary = theme?.palette.primary;
</script>

<div style:padding-right="0.75rem">
  {#if lg === "en"}
    <p class="title" style:color={primary}>Getting Started</p>
    <p class="text">
      Welcome to SQL Viewer — the powerful tool designed for easy interaction
      with databases.
    </p>
    <p class="text">
      SQL Viewer is aimed at simplifying the processes of reading, editing, and
      deleting records in a database, providing users with an intuitive
      interface and quick access to data.
    </p>
    <p class="title" style:color={primary}>Key Features</p>
    <ul class="list">
      <li>
        data Reading: Easily view all records in your tables. Access important
        information with just a few clicks;
      </li>

      <li>
        record Editing: Modify existing data without diving into SQL queries.
        Select the desired record, make changes, and save them with the click of
        a button;
      </li>

      <li>
        data Deletion: Remove unnecessary records from your tables, eliminating
        clutter in your database while using an intuitive interface.
      </li>
    </ul>
    <p class="title" style:color={primary}>PostgreSQL Support</p>
    <p class="text">
      Currently, SQL Viewer only supports PostgreSQL databases, ensuring
      reliable and secure interaction with this database management system. We
      plan to expand functionality and support other DBMSs in the future.
    </p>
    <p class="title" style:color={primary}>Why Use SQL Viewer?</p>
    <p class="text">
      Not all cloud platforms and hosting services provide an interface for data
      management. Usually, you have to rely on third-party libraries and
      utilities for these tasks. Additionally, there are still few universal
      tools in SQL programming that allow interaction with various DBMSs through
      a single interface.
    </p>
    <p class="text">With SQL Viewer, you can:</p>
    <ul class="list">
      <li>simplify data handling without the need for additional libraries;</li>
      <li>focus on important information without unnecessary effort;</li>
      <li>easily manage and access data anytime.</li>
    </ul>
    <p class="title" style:color={primary}>Conclusion</p>
    <p class="text">
      We hope that SQL Viewer becomes your indispensable assistant in the world
      of databases. If you have any suggestions or ideas for improvement, feel
      free to reach out to us!
    </p>
    <p class="text">
      Start right now and discover the convenience of working with databases!
    </p>
  {:else}
    <p class="title" style:color={primary}>Начало работы</p>
    <p class="text">
      Добро пожаловать в SQL Viewer — мощный инструмент, созданный для удобного
      взаимодействия с базами данных.
    </p>
    <p class="text">
      SQL Viewer предназначен для упрощения процессов чтения, редактирования и
      удаления записей в базе данных, предоставляя пользователям интуитивно
      понятный интерфейс и быстрый доступ к данным.
    </p>
    <p class="title" style:color={primary}>Ключевые особенности</p>
    <ul class="list">
      <li>
        чтение данных: с лёгкостью просматривайте все записи в ваших таблицах.
        Получите доступ к важной информации всего в несколько кликов;
      </li>

      <li>
        редактирование записей: Изменяйте существующие данные, не погружаясь в
        работу с SQL-запросами. Выберите нужную запись, внесите изменения и
        сохраните их одним нажатием кнопки;
      </li>

      <li>
        удаление данных: Удаляйте ненужные записи из ваших таблиц, чтобы
        избавиться от лишней информации в Вашей базе данных, используя при этом
        интуитивно понятный интерфейс.
      </li>
    </ul>
    <p class="title" style:color={primary}>Поддержка PostgreSQL</p>
    <p class="text">
      На данный момент SQL Viewer поддерживает только базы данных PostgreSQL,
      обеспечивая надежное и безопасное взаимодействие с этой системой
      управления. Мы планируем расширять функциональность и поддерживать другие
      СУБД в будущем.
    </p>
    <p class="title" style:color={primary}>Зачем использовать SQL Viewer?</p>
    <p class="text">
      Не все облачные платформы и хостинги предоставляют интерфейс для
      управления данными. Обычно для этих задач вам приходится полагаться на
      сторонние библиотеки и утилиты. Кроме того, в SQL-программировании,
      по-прежнему, мало универсальных инструментов, которые позволяют
      взаимодействовать с различными СУБД через единый интерфейс.
    </p>
    <p class="text">С помощью SQL Viewer вы сможете:</p>
    <ul class="list">
      <li>
        упростить работу с данными, избегая использования дополнительных
        библиотек;
      </li>
      <li>сосредоточиться на важной информации без лишних усилий;</li>
      <li>легко управлять данными и получить доступ к ним в любое время.</li>
    </ul>
    <p class="title" style:color={primary}>Заключение</p>
    <p class="text">
      Мы надеемся, что SQL Viewer станет вашим незаменимым помощником в мире баз
      данных. Если у вас есть предложения или идеи по улучшению, не стесняйтесь
      обращаться к нам!
    </p>
    <p class="text">
      Начните прямо сейчас и откройте для себя удобство работы с базами данных!
    </p>
  {/if}
</div>

<style>
  .title {
    font-size: 24px;
    margin-left: 4rem;
    margin-top: 0.25rem;
    line-height: 1.5; /* Полуторный межстрочный интервал */
  }

  .text {
    margin-top: 0.5rem;
    margin-left: 1rem;
    margin-bottom: 0.5rem;
    text-indent: 3rem; /* Отступ первой строки */
    line-height: 1.5; /* Полуторный межстрочный интервал */
  }

  .list {
    margin-top: 0.5rem;
    margin-left: 3.5rem;
    text-indent: 0.1rem; /* Отступ первой строки */
    margin-bottom: 0.5rem;
    line-height: 1.5; /* Полуторный межстрочный интервал */
  }
</style>
