<template>
  <n-message-provider>
    <div class="h-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- LEFT FORM -->
      <n-card
        :class="[
          'shadow-sm border flex flex-col rounded-lg',
          themeStore.isDark
            ? '!bg-gray-800 !border-gray-700'
            : '!bg-white !border-gray-200',
        ]"
      >
        <template #header>
          <div
            :class="[
              'flex items-center gap-2 text-lg font-medium',
              themeStore.isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            📝 Add New Note
          </div>
        </template>

        <p
          :class="[
            'mb-4 text-sm',
            themeStore.isDark ? 'text-gray-400' : 'text-gray-600',
          ]"
        >
          Create a new note to keep your thoughts organized.
        </p>

        <n-form label-placement="top" class="flex-1">
          <n-form-item label="Title">
            <n-input v-model:value="title" placeholder="Enter a short title" />
          </n-form-item>

          <n-form-item label="Content">
            <n-input
              type="textarea"
              v-model:value="content"
              placeholder="Write something memorable..."
              rows="4"
            />
          </n-form-item>

          <n-form-item label="Attachment (optional)">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*,application/pdf"
              class="hidden"
              @change="onFileChange"
            />
            <n-button
              :class="[
                themeStore.isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
              ]"
              @click="handleFileClick"
            >
              📎 Choose File
            </n-button>
            <p
              v-if="file?.name"
              :class="[
                'text-xs mt-1 italic truncate',
                themeStore.isDark ? 'text-gray-400' : 'text-gray-500',
              ]"
            >
              Selected: {{ file.name }}
            </p>
          </n-form-item>

          <n-divider />

          <div class="flex gap-3 mt-2">
            <n-button
              type="primary"
              class="w-full"
              @click="addNote"
              :disabled="!title.trim()"
            >
              ➕ Add Note
            </n-button>
            <n-button ghost class="w-full" @click="store.fetch"
              >↻ Refresh</n-button
            >
          </div>
        </n-form>

        <p
          :class="[
            'mt-6 text-xs text-center italic',
            themeStore.isDark ? 'text-gray-500' : 'text-gray-600',
          ]"
        >
          "Even the smallest note can spark the brightest ideas."
        </p>
      </n-card>

      <!-- RIGHT LIST -->
      <div
        class="flex flex-col overflow-y-auto pr-2 max-h-[calc(100vh-3.5rem)] min-h-0"
      >
        <div class="flex items-center justify-between mb-4">
          <h2
            :class="[
              'text-xl font-semibold',
              themeStore.isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            📋 Notes List
          </h2>
        </div>

        <!-- Search Section -->
        <div class="mb-4">
          <n-input
            v-model:value="searchQuery"
            placeholder="Search notes by title..."
            @input="handleSearch"
            clearable
            class="mb-2"
          />
          <div
            v-if="store.searchTerm"
            :class="[
              'flex items-center gap-2 text-sm',
              themeStore.isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            <span>Searching for: "{{ store.searchTerm }}"</span>
            <n-button size="tiny" @click="clearSearch">Clear</n-button>
          </div>
        </div>

        <div v-if="store.loading" class="text-center py-4">
          <n-spin size="medium" />
        </div>

        <div
          v-else-if="store.notes.length === 0"
          :class="[
            'text-center py-8',
            themeStore.isDark ? 'text-gray-400' : 'text-gray-500',
          ]"
        >
          <div v-if="store.searchTerm">
            No notes found for "{{ store.searchTerm }}"
          </div>
          <div v-else>No notes yet. Create your first note!</div>
        </div>

        <n-card
          v-for="note in store.notes"
          :key="note.id"
          :class="[
            'mb-4 shadow-sm border rounded-lg',
            themeStore.isDark
              ? '!bg-gray-800 !border-gray-700'
              : '!bg-white !border-gray-200',
          ]"
        >
          <div class="flex justify-between items-center mb-2">
            <h3
              :class="[
                'text-lg font-medium',
                themeStore.isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ note.title }}
            </h3>
            <div class="space-x-2">
              <n-button size="small" @click="startEdit(note)">Edit</n-button>
              <n-button
                size="small"
                type="error"
                @click="() => store.remove(note.id)"
                >Delete</n-button
              >
            </div>
          </div>

          <div v-if="editing && editing.id === note.id">
            <n-input
              v-model:value="eTitle"
              placeholder="New Title"
              class="mb-2"
            />
            <n-input
              type="textarea"
              rows="3"
              v-model:value="eContent"
              placeholder="New Content"
              class="mb-2"
            />
            <div class="flex gap-2">
              <n-button type="primary" size="small" @click="saveEdit"
                >Save</n-button
              >
              <n-button size="small" @click="cancelEdit">Cancel</n-button>
            </div>
          </div>
          <p
            v-else
            :class="[
              'whitespace-pre-line',
              themeStore.isDark ? 'text-gray-300' : 'text-gray-700',
            ]"
          >
            {{ note.content }}
          </p>

          <a
            v-if="note.fileUrl"
            :href="note.fileUrl"
            target="_blank"
            :class="[
              'underline mt-2 block',
              themeStore.isDark ? 'text-blue-400' : 'text-blue-600',
            ]"
          >
            📎 View Attachment
          </a>
        </n-card>
      </div>
    </div>
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNotesStore, type Note } from '@/stores/notes';
import { useThemeStore } from '@/stores/theme';

const store = useNotesStore();
const themeStore = useThemeStore();

const title = ref('');
const content = ref('');
const file = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Search functionality
const searchQuery = ref('');

const editing = ref<Note | null>(null);
const eTitle = ref('');
const eContent = ref('');

function handleFileClick(e: Event) {
  e.preventDefault();
  fileInputRef.value?.click();
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
  }
}

async function addNote() {
  if (!title.value.trim()) return;
  await store.add(title.value, content.value, file.value ?? undefined);
  title.value = '';
  content.value = '';
  file.value = null;
}

function startEdit(n: Note) {
  editing.value = { ...n };
  eTitle.value = n.title;
  eContent.value = n.content;
}

async function saveEdit() {
  if (!editing.value) return;
  await store.update(editing.value.id, {
    title: eTitle.value,
    content: eContent.value,
  });
  editing.value = null;
}

function cancelEdit() {
  editing.value = null;
}

// Search functionality with debounce
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

function handleSearch() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim()) {
      store.searchByTitle(searchQuery.value.trim());
    } else {
      store.clearSearch();
    }
  }, 300); // Debounce 300ms
}

function clearSearch() {
  searchQuery.value = '';
  store.clearSearch();
}

onMounted(() => {
  store.fetch();
});
</script>
