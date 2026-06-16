<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { VAceEditor } from 'vue3-ace-editor';

  import 'ace-builds/src-noconflict/mode-json';
  import 'ace-builds/src-noconflict/theme-nord_dark';
  import 'ace-builds/src-noconflict/ext-language_tools';

  const code = ref(``);

  const editorRef = ref(null);

  function lint(editor) {
    if (!editor) return;

    const session = editor.getSession();

    try {
      JSON.parse(editor.getValue());

      session.clearAnnotations();
    } catch (e) {
      const match = e.message.match(/position (\d+)/);

      let row = 0;
      let column = 0;

      if (match) {
        const pos = Number(match[1]);

        const text = editor.getValue();
        const before = text.slice(0, pos);

        const lines = before.split('\n');

        row = lines.length - 1;
        column = lines[lines.length - 1].length;
      }

      session.setAnnotations([
        {
          row,
          column,
          text: e.message,
          type: 'error',
        },
      ]);
    }
  }
  let timeout;
  function onChange(value, editor) {
    clearTimeout(timeout);
    timeout = setTimeout(() => lint(editor), 150);
  }
</script>

<template>
  <v-ace-editor
    ref="editorRef"
    v-model:value="code"
    lang="json"
    theme="nord_dark"
    style="font-size: 10px"
    @init="(editor) => lint(editor)"
    @input="onChange"
    class="bg-base-200!"
  />
</template>
