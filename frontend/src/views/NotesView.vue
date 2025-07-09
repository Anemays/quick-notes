<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotesStore, type Note } from '@/stores/notes'

const store = useNotesStore()

const title = ref('')
const content = ref('')
const file = ref<File | null>(null)

function pickFile(e: Event) {
  file.value = (e.target as HTMLInputElement).files?.[0] ?? null
}

async function add() {
  if (!title.value.trim()) return
  await store.add(title.value, content.value, file.value || undefined)
  title.value = content.value = ''
  file.value = null
}

const editing = ref<Note | null>(null)
const eTitle = ref('')
const eContent = ref('')
function startEdit(n: Note) {
  editing.value = { ...n }
  eTitle.value = n.title
  eContent.value = n.content
}
async function saveEdit() {
  if (!editing.value) return
  await store.update(editing.value.id, { title: eTitle.value, content: eContent.value })
  editing.value = null
}

onMounted(store.fetch)

const isImg = (u: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(u)
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-10">Quick Notes</h1>

    <!-- Form tambah -->
    <div class="bg-white shadow-md rounded-xl p-6 mb-10">
      <div class="grid md:grid-cols-2 gap-4">
        <input v-model="title" type="text" placeholder="Title"
               class="text-gray-700 w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500" />
        <input type="file" @change="pickFile"
               class="text-gray-700 w-full file:bg-blue-100 file:text-blue-600 file:px-4 file:py-2 file:rounded-lg file:border-none" />
      </div>
      <textarea v-model="content" rows="4" placeholder="Content"
                class="text-gray-700 w-full mt-4 border border-gray-500 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring focus:ring-blue-500" />
      <div class="mt-4 flex gap-4">
        <button @click="add"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg">
          Add
        </button>
        <button @click="store.fetch"
                class="text-gray-500 hover:text-gray-700">
          Refresh ↻
        </button>
      </div>
    </div>

    <!-- Daftar notes -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in store.notes" :key="n.id" class="bg-white rounded-xl shadow-md p-5">
        <template v-if="editing && editing.id === n.id">
          <input v-model="eTitle" class="text-gray-700 w-full border rounded-lg px-3 py-2 mb-2" />
          <textarea v-model="eContent" rows="3" class="text-gray-700 w-full border rounded-lg px-3 py-2 mb-2" />
          <div class="flex justify-end gap-3">
            <button @click="saveEdit" class="bg-green-600 text-white px-4 py-1 rounded-lg">Save</button>
            <button @click="editing = null" class="text-gray-500">Cancel</button>
          </div>
        </template>

        <template v-else>
          <h2 class="text-gray-700 font-semibold text-lg mb-2 break-words">{{ n.title }}</h2>
          <p class="text-gray-700 whitespace-pre-line mb-3 break-words">{{ n.content }}</p>

          <!-- preview file -->
          <div v-if="n.fileUrl" class="mb-3">
            <img v-if="isImg(n.fileUrl)" :src="n.fileUrl"
                 class="w-full max-h-48 object-contain rounded" />
            <a v-else :href="n.fileUrl" target="_blank"
               class="text-blue-600 underline text-sm">📎 Download file</a>
          </div>

          <div class="flex justify-end gap-4 text-sm">
            <button @click="startEdit(n)" class="text-blue-600 hover:underline">Edit</button>
            <button @click="store.remove(n.id)" class="text-red-600 hover:underline">Delete</button>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
