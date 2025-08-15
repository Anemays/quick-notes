<template>
  <n-message-provider>
    <div class="notes-view-container">
      <!-- FOLDER SIDEBAR -->
      <div class="folder-sidebar">
        <SimpleFolderSidebar />
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="main-content">
        <!-- ADD NEW NOTE FORM -->
        <n-card
          class="add-note-card"
          :class="{ 'dark-theme': themeStore.isDark }"
        >
          <template #header>
            <div class="add-note-header">
              <n-icon :size="18">
                <EditIcon />
              </n-icon>
              <span>Add New Note</span>
            </div>
          </template>

          <n-form :model="noteForm" label-placement="top">
            <div class="form-row">
              <n-form-item label="Title" class="form-item">
                <n-input
                  v-model:value="title"
                  placeholder="Enter note title..."
                  clearable
                />
              </n-form-item>

              <n-form-item label="Attachment" class="form-item-attachment">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*,application/pdf"
                  class="hidden"
                  @change="onFileChange"
                />
                <n-button
                  @click="handleFileClick"
                  :type="file ? 'primary' : 'default'"
                >
                  <template #icon>
                    <n-icon>
                      <AttachmentIcon />
                    </n-icon>
                  </template>
                  {{ file ? file.name : 'Choose File' }}
                </n-button>
              </n-form-item>
            </div>

            <n-form-item label="Content">
              <n-input
                type="textarea"
                v-model:value="content"
                placeholder="Write your note content..."
                :rows="3"
                clearable
              />
            </n-form-item>

            <div class="form-actions">
              <n-button
                type="primary"
                @click="addNote"
                :disabled="!title.trim()"
                :loading="store.loading"
              >
                <template #icon>
                  <n-icon>
                    <AddIcon />
                  </n-icon>
                </template>
                Add Note
              </n-button>
              <n-button @click="store.fetch" :loading="store.loading">
                <template #icon>
                  <n-icon>
                    <RefreshIcon />
                  </n-icon>
                </template>
                Refresh
              </n-button>
            </div>
          </n-form>
        </n-card>

        <!-- SEARCH AND NOTES SECTION -->
        <div class="notes-section">
          <!-- Search Bar -->
          <div class="search-section">
            <n-input
              v-model:value="searchQuery"
              placeholder="Search notes by title..."
              @input="handleSearch"
              clearable
              size="large"
            >
              <template #prefix>
                <n-icon>
                  <SearchIcon />
                </n-icon>
              </template>
            </n-input>
            <div v-if="store.searchTerm" class="search-info">
              Searching for: <strong>"{{ store.searchTerm }}"</strong>
              <n-button size="tiny" text @click="clearSearch">Clear</n-button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="store.loading" class="loading-state">
            <n-spin size="large" />
            <p>Loading notes...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="store.notes.length === 0" class="empty-state">
            <n-icon :size="48" class="large-icon">
              <NoteIcon />
            </n-icon>
            <h3>{{ store.searchTerm ? 'No notes found' : 'No notes yet' }}</h3>
            <p>
              {{
                store.searchTerm
                  ? `No notes found for "${store.searchTerm}"`
                  : 'Create your first note to get started!'
              }}
            </p>
          </div>

          <!-- Notes Grid -->
          <div v-else class="notes-grid">
            <n-card
              v-for="note in store.notes"
              :key="note.id"
              class="note-card"
              :class="{ editing: editingNoteId === note.id }"
              hoverable
              draggable="true"
              @dragstart="onNoteDragStart($event, note)"
            >
              <!-- EDIT MODE -->
              <div v-if="editingNoteId === note.id" class="edit-form">
                <n-form label-placement="top">
                  <n-form-item label="Title">
                    <n-input
                      v-model:value="eTitle"
                      placeholder="Enter note title..."
                      clearable
                    />
                  </n-form-item>
                  <n-form-item label="Content">
                    <n-input
                      type="textarea"
                      v-model:value="eContent"
                      placeholder="Write your note content..."
                      :rows="4"
                    />
                  </n-form-item>
                </n-form>
                <div class="edit-actions">
                  <n-button @click="cancelEdit" size="small">Cancel</n-button>
                  <n-button
                    type="primary"
                    @click="saveEdit"
                    :loading="store.loading"
                    size="small"
                  >
                    Save
                  </n-button>
                </div>
              </div>

              <!-- VIEW MODE -->
              <div v-else>
                <div class="note-header">
                  <h3 class="note-title">{{ note.title || 'Untitled' }}</h3>
                  <div class="note-actions">
                    <n-button
                      size="small"
                      circle
                      @click="startEdit(note)"
                      title="Edit note"
                    >
                      <template #icon>
                        <n-icon>
                          <EditIcon />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button
                      size="small"
                      circle
                      type="error"
                      @click="deleteNote(note)"
                      title="Delete note"
                    >
                      <template #icon>
                        <n-icon>
                          <DeleteIcon />
                        </n-icon>
                      </template>
                    </n-button>
                  </div>
                </div>

                <div class="note-content" v-if="note.content">
                  {{ note.content }}
                </div>

                <div class="note-footer">
                  <div class="note-meta">
                    <span class="note-date">
                      {{ formatDate(note.updatedAt || note.createdAt) }}
                    </span>
                    <n-tag
                      v-if="note.folderId"
                      size="small"
                      type="info"
                      :bordered="false"
                    >
                      <template #icon>
                        <n-icon>
                          <FolderIcon />
                        </n-icon>
                      </template>
                      In Folder
                    </n-tag>
                  </div>

                  <n-button
                    v-if="note.fileUrl"
                    size="small"
                    text
                    tag="a"
                    :href="note.fileUrl"
                    target="_blank"
                    class="attachment-btn"
                  >
                    <template #icon>
                      <n-icon>
                        <AttachmentIcon />
                      </n-icon>
                    </template>
                    Attachment
                  </n-button>
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </div>
    </div>
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NIcon,
  NMessageProvider,
  NSpin,
  NTag,
} from 'naive-ui';
import {
  AttachOutline as AttachmentIcon,
  CreateOutline as EditIcon,
  AddOutline as AddIcon,
  RefreshOutline as RefreshIcon,
  SearchOutline as SearchIcon,
  TrashOutline as DeleteIcon,
  DocumentTextOutline as NoteIcon,
  FolderOutline as FolderIcon,
} from '@vicons/ionicons5';
import { useNotesStore, type Note } from '@/stores/notes';
import { useThemeStore } from '@/stores/theme';
import SimpleFolderSidebar from '@/components/SimpleFolderSidebar.vue';

const store = useNotesStore();
const themeStore = useThemeStore();

// Form data
const title = ref('');
const content = ref('');
const file = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Reactive forms for validation
const noteForm = reactive({
  title: '',
  content: '',
  file: null as File | null,
});

// Search functionality
const searchQuery = ref('');

// Inline editing
const editingNoteId = ref<number | null>(null);
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
  // Close any other editing note first
  if (editingNoteId.value && editingNoteId.value !== n.id) {
    editingNoteId.value = null;
  }

  editing.value = { ...n };
  eTitle.value = n.title;
  eContent.value = n.content;
  editingNoteId.value = n.id;
}

function cancelEdit() {
  editingNoteId.value = null;
  editing.value = null;
  eTitle.value = '';
  eContent.value = '';
}

async function deleteNote(note: Note) {
  await store.remove(note.id);
}

async function saveEdit() {
  if (!editing.value) return;
  await store.update(editing.value.id, {
    title: eTitle.value,
    content: eContent.value,
  });
  editingNoteId.value = null;
  editing.value = null;
  eTitle.value = '';
  eContent.value = '';
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

function onNoteDragStart(event: Event, note: Note) {
  const dragEvent = event as any;
  if (dragEvent.dataTransfer) {
    dragEvent.dataTransfer.setData('text/plain', note.id.toString());
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  // Reset time to midnight for accurate day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const noteDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = today.getTime() - noteDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day - show time
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
}

// Handle note selection from folder sidebar (currently unused but kept for future use)
// function selectNote(note: Note) {
//   startEdit(note);
// }

onMounted(() => {
  store.fetch();
});
</script>

<style scoped>
.notes-view-container {
  display: flex;
  height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}

.folder-sidebar {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid var(--n-border-color);
  background: var(--n-color);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
  overflow-y: auto;
  background: var(--n-body-color);
}

/* Add Note Card */
.add-note-card {
  flex-shrink: 0;
  border: 1px solid var(--n-border-color);
  background: var(--n-card-color);
}

.add-note-card.dark-theme {
  background: var(--n-card-color);
  border-color: var(--n-border-color);
}

.add-note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--n-text-color);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: end;
}

.form-item {
  min-width: 0;
}

.form-item-attachment {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

/* Notes Section */
.notes-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--n-text-color-disabled);
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: var(--n-text-color-disabled);
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: var(--n-text-color);
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Notes Grid */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding-bottom: 20px;
}

/* Note Cards */
.note-card {
  cursor: grab;
  transition: all 0.2s ease;
  border: 1px solid var(--n-border-color);
  background: var(--n-card-color);
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--n-color-primary);
}

.note-card:active {
  cursor: grabbing;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.note-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--n-text-color);
  line-height: 1.4;
  flex: 1;
  word-break: break-word;
}

.note-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.note-card:hover .note-actions {
  opacity: 1;
}

/* Inline Edit Form */
.note-card.editing {
  border-color: var(--n-primary-color);
  background-color: var(--n-card-color-hover);
}

.edit-form {
  padding: 4px 0;
}

.edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
}

.note-content {
  color: var(--n-text-color);
  line-height: 1.6;
  margin-bottom: 16px;
  white-space: pre-wrap;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.note-date {
  font-size: 12px;
  color: var(--n-text-color-disabled);
  font-style: italic;
}

.attachment-btn {
  font-size: 12px;
}

/* Modal */
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .notes-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .notes-view-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .folder-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--n-border-color);
  }

  .main-content {
    padding: 16px;
    gap: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .notes-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .note-actions {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 12px;
  }

  .note-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .note-actions {
    justify-content: flex-end;
  }
}

/* Icon Styling */
.large-icon {
  color: var(--n-text-color-disabled);
  margin-bottom: 16px;
}
</style>
