<template>
  <!-- https://github.com/ueberdosis/tiptap -->
  <div>
    <div v-if="editable" class="main-box">
      <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
        <div class="grey lighten-3 editor-bar">
          <v-btn text small color="#FCA326" @click="commands.undo">
            <v-icon color="grey darken-1">
              mdi-undo
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.redo">
            <v-icon color="grey darken-1">
              mdi-redo
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.bold">
            <v-icon :color="isActive.bold() ? '#FCA326' : 'grey darken-1'">
              mdi-format-bold
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.italic">
            <v-icon :color="isActive.italic() ? '#FCA326' : 'grey darken-1'">
              mdi-format-italic
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.underline">
            <v-icon :color="isActive.underline() ? '#FCA326' : 'grey darken-1'">
              mdi-format-underline
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.heading({ level: 1 })">
            <v-icon
              :color="isActive.heading({ level: 1 }) ? '#FCA326' : 'grey darken-1'"
            >
              mdi-format-header-1
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.heading({ level: 2 })">
            <v-icon
              :color="isActive.heading({ level: 2 }) ? '#FCA326' : 'grey darken-1'"
            >
              mdi-format-header-2
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.heading({ level: 3 })">
            <v-icon
              :color="isActive.heading({ level: 3 }) ? '#FCA326' : 'grey darken-1'"
            >
              mdi-format-header-3
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.bullet_list">
            <v-icon
              :color="isActive.bullet_list() ? '#FCA326' : 'grey darken-1'"
            >
              mdi-format-list-bulleted
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="commands.ordered_list">
            <v-icon
              :color="isActive.ordered_list() ? '#FCA326' : 'grey darken-1'"
            >
              mdi-format-list-numbered
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="loadImage(commands.image)">
            <v-icon color="grey darken-1">
              mdi-image
            </v-icon>
          </v-btn>

          <v-btn text small color="#FCA326" @click="setLink(commands.link)">
            <v-icon :color="isActive.link() ? '#FCA326' : 'grey darken-1'">
              mdi-link-variant-plus
            </v-icon>
          </v-btn>
        </div>
      </editor-menu-bar>

      <v-divider />
      <editor-content class="text-box pa-1" :editor="editor" />
    </div>
    <!-- Read only -->
    <editor-content v-else style="outline-color: none !important;" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Underline,
  History,
  Strike,
  Image,
} from 'tiptap-extensions'
import i18n from '@/i18n'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new BulletList(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new Link(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Image(),
        ],
        content: '',
        editable: this.editable,
        onUpdate: ({ getJSON, getHTML }) => {
          this.json = getJSON()
          this.html = getHTML()
        },
      }),
      json: null,
      html: null,
    }
  },
  watch: {
    json() {
      this.$emit('updateJson', this.json)
    },
    html() {
      this.$emit('updateHtml', this.html)
    },
    text() {
      this.editor.setContent(this.text)
    },
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  mounted() {
    this.$emit('mounted')
    if(this.text.length > 0) this.editor.setContent(this.text)
  },
  methods: {
    loadImage(command) {
      const url = prompt(i18n.t('alerts.imageURL'))
      if (url)
        command({
          src: url,
        })
    },
    getJson() {
      return this.json
    },
    getHtml() {
      return this.html
    },
    setLink(command) {
      let link = prompt('Link: ')

      if (link) {
        if (link.indexOf('http://') !== 0 && link.indexOf('https://') !== 0) {
          link = 'http://'.concat(link)
        }

        command({ href: link })
      }
    },
    setContent(text) {
      this.editor.setContent(text)
    },
    resetContent() {
      this.editor.clearContent()
    },
  },
}
</script>

<style scoped>
.editor-bar {
  border-radius: 4px;
}
.text-box {
  border-radius: 4px;
  max-height: 300px;
  height: 300px;
  overflow: auto;
  caret-color: #fca326;
  line-height: 1.3em;
  outline-color: none !important;

  /* overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word; */
}
.main-box {
  border: 1px solid #3f3d56;
  border-radius: 4px;
}
/* width */
::-webkit-scrollbar {
  width: 7px;
}
/* Track */
::-webkit-scrollbar-track {
  background: none;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #ffcd86;
  border-radius: 2px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #fca326;
}
</style>