<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { VAceEditor } from 'vue3-ace-editor';
  import Ajv from 'ajv';

  import 'ace-builds/src-noconflict/mode-json';
  import 'ace-builds/src-noconflict/theme-nord_dark';
  import 'ace-builds/src-noconflict/ext-language_tools';

  const code = ref(``);

  const ajv = new Ajv({ allErrors: true });

  const schema = {
    type: 'object',
    //required: ['key'],
    //properties: {
    // key: { type: 'string' },
    //},
    additionalProperties: true,
  };

  const validate = ajv.compile(schema);

  const editorRef = ref(null);

  function lint(editor) {
    if (!editor) return;

    const session = editor.getSession();
    let json;

    try {
      json = JSON.parse(editor.getValue());
    } catch (e) {
      session.setAnnotations([
        {
          row: 0,
          column: 0,
          text: 'Invalid JSON syntax',
          type: 'error',
        },
      ]);
      return;
    }

    // 2. Validate schema
    const valid = validate(json);

    if (!valid) {
      session.setAnnotations(
        validate.errors.map((err) => ({
          row: 0,
          column: 0,
          text: `${err.instancePath || '/'} ${err.message}`,
          type: 'error',
        }))
      );
    } else {
      session.clearAnnotations();
    }
  }

  // debounce-like watcher behavior
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
