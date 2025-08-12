<template>
  <div class="folder-sidebar">
    <!-- Header with Create Folder Button -->
    <div class="folder-header">
      <h3 class="folder-title">
        <n-icon :size="18" class="folder-icon">
          <FolderIcon />
        </n-icon>
        Folders
      </h3>
      <n-button
        size="small"
        text
        @click="showCreateModal = true"
        class="create-button"
        :class="{ 'dark-button': themeStore.isDark }"
      >
        <n-icon :size="16">
          <AddIcon />
        </n-icon>
      </n-button>
    </div>

    <!-- Folder List -->
    <div class="folder-list">
      <!-- All Notes (Root) -->
      <div
        class="folder-item root-folder"
        :class="{ active: selectedFolderId === null, dark: themeStore.isDark }"
        @click="selectFolder(null)"
        @drop="onDrop(null, $event)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="folder-content">
          <n-icon :size="16" class="folder-icon-item">
            <NotesIcon />
          </n-icon>
          <span class="folder-name">All Notes</span>
          <span class="note-count">{{ allNotesCount }}</span>
        </div>
      </div>

      <!-- Dynamic Folders -->
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="folder-item"
        :class="{
          active: selectedFolderId === folder.id,
          dark: themeStore.isDark,
          expanded: expandedFolders.has(folder.id),
        }"
        @click="selectFolder(folder.id)"
        @contextmenu.prevent="showContextMenu($event, folder)"
        @drop="onDrop(folder.id, $event)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="folder-content">
          <n-icon
            :size="14"
            class="expand-icon"
            @click.stop="toggleFolder(folder.id)"
            v-if="getFolderNoteCount(folder.id) > 0"
          >
            <ChevronRightIcon v-if="!expandedFolders.has(folder.id)" />
            <ChevronDownIcon v-else />
          </n-icon>
          <n-icon
            :size="16"
            class="folder-icon-item"
            :style="{ color: folder.color || undefined }"
          >
            <FolderIcon />
          </n-icon>
          <span class="folder-name">{{ folder.name }}</span>
          <span class="note-count">{{ getFolderNoteCount(folder.id) }}</span>
        </div>

        <!-- Folder Notes (when expanded) -->
        <div v-if="expandedFolders.has(folder.id)" class="folder-notes">
          <div
            v-for="note in getFolderNotes(folder.id)"
            :key="note.id"
            class="note-item"
            :class="{ dark: themeStore.isDark }"
            @click.stop="$emit('noteSelected', note)"
            :draggable="true"
            @dragstart="onNoteDragStart($event, note)"
          >
            <n-icon :size="14" class="note-icon">
              <DocumentIcon />
            </n-icon>
            <span class="note-title">{{ truncateTitle(note.title) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Folder Modal -->
    <n-modal
      v-model:show="showCreateModal"
      class="custom-card"
      preset="card"
      title="Create New Folder"
      size="small"
      @positive-click="createFolder"
      @negative-click="showCreateModal = false"
      style="width: 400px"
    >
      <n-form
        ref="createFormRef"
        :model="newFolder"
        label-placement="top"
        @keyup.enter="createFolder"
      >
        <n-form-item label="Folder Name" path="name">
          <n-input
            v-model:value="newFolder.name"
            placeholder="Enter folder name"
            clearable
          />
        </n-form-item>
        <n-form-item label="Color (Optional)" path="color">
          <n-color-picker
            v-model:value="newFolder.color"
            :show-alpha="false"
            size="small"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="showCreateModal = false">Cancel</n-button>
          <n-button type="primary" @click="createFolder">Create</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- Context Menu -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :options="contextMenuOptions"
      :show="contextMenu.show"
      :on-clickoutside="() => (contextMenu.show = false)"
      @select="handleContextMenuSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  NButton,
  NIcon,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NColorPicker,
  NSpace,
  NDropdown,
  useMessage,
  type FormInst,
} from 'naive-ui';
import {
  FolderOpenOutline as FolderIcon,
  AddOutline as AddIcon,
  DocumentTextOutline as NotesIcon,
  DocumentOutline as DocumentIcon,
  ChevronForwardOutline as ChevronRightIcon,
  ChevronDownOutline as ChevronDownIcon,
} from '@vicons/ionicons5';
import { useNotesStore, type Note } from '@/stores/notes';
import { useFoldersStore, type Folder } from '@/stores/folders';
import { useThemeStore } from '@/stores/theme';

// Stores
const notesStore = useNotesStore();
const foldersStore = useFoldersStore();
const themeStore = useThemeStore();
const message = useMessage();

// Props & Emits
defineEmits<{
  noteSelected: [note: Note];
}>();

// Reactive data
const selectedFolderId = ref<number | null>(null);
const expandedFolders = ref(new Set<number>());
const showCreateModal = ref(false);
const createFormRef = ref<FormInst>();
const newFolder = ref({
  name: '',
  color: null as string | null,
});

// Context menu
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  folder: null as Folder | null,
});

// Computed
const folders = computed(() => foldersStore.sortedFolders);

const allNotesCount = computed(() => {
  return notesStore.notes.filter((note) => !note.folderId).length;
});

const contextMenuOptions = computed(() => [
  {
    label: 'Rename',
    key: 'rename',
  },
  {
    label: 'Delete',
    key: 'delete',
  },
]);

// Methods
function selectFolder(folderId: number | null) {
  selectedFolderId.value = folderId;
  // TODO: Filter notes by folder
}

function toggleFolder(folderId: number) {
  if (expandedFolders.value.has(folderId)) {
    expandedFolders.value.delete(folderId);
  } else {
    expandedFolders.value.add(folderId);
  }
}

function getFolderNoteCount(folderId: number): number {
  return notesStore.notes.filter((note) => note.folderId === folderId).length;
}

function getFolderNotes(folderId: number): Note[] {
  return notesStore.notes.filter((note) => note.folderId === folderId);
}

function truncateTitle(title: string, maxLength = 20) {
  return title.length > maxLength
    ? title.substring(0, maxLength) + '...'
    : title;
}

async function createFolder() {
  if (!newFolder.value.name.trim()) {
    message.error('Please enter a folder name');
    return;
  }

  try {
    console.log('Creating folder:', newFolder.value);
    const result = await foldersStore.createFolder({
      name: newFolder.value.name,
      color: newFolder.value.color || undefined,
    });
    console.log('Folder created:', result);

    // Force refresh folders list to ensure UI updates
    await foldersStore.fetchFolders();
    console.log(
      'Folders refreshed, current count:',
      foldersStore.folders.length,
    );

    message.success('Folder created successfully');
    newFolder.value = { name: '', color: null };
    showCreateModal.value = false;
  } catch (error) {
    console.error('Error creating folder:', error);
    message.error('Failed to create folder');
  }
}

function showContextMenu(event: Event, folder: Folder) {
  const mouseEvent = event as any;
  contextMenu.value = {
    show: true,
    x: mouseEvent.clientX,
    y: mouseEvent.clientY,
    folder,
  };
}

function handleContextMenuSelect(key: string) {
  const folder = contextMenu.value.folder;
  if (!folder) return;

  switch (key) {
    case 'rename':
      console.log('Rename folder:', folder.name);
      break;
    case 'delete':
      deleteFolder(folder);
      break;
  }
  contextMenu.value.show = false;
}

async function deleteFolder(folder: Folder) {
  try {
    await foldersStore.deleteFolder(folder.id);
    message.success(`Folder "${folder.name}" deleted successfully`);
  } catch {
    message.error('Failed to delete folder');
  }
}

function onDrop(folderId: number | null, event: Event) {
  const dragEvent = event as any;
  dragEvent.preventDefault();
  const noteId = dragEvent.dataTransfer?.getData('text/plain');

  if (!noteId) return;

  moveNoteToFolder(parseInt(noteId), folderId);
}

function onNoteDragStart(event: Event, note: Note) {
  const dragEvent = event as any;
  if (dragEvent.dataTransfer) {
    dragEvent.dataTransfer.setData('text/plain', note.id.toString());
  }
}

async function moveNoteToFolder(noteId: number, folderId: number | null) {
  try {
    console.log('Move note', noteId, 'to folder', folderId);
    message.success('Note moved successfully');
  } catch {
    message.error('Failed to move note');
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([foldersStore.fetchFolders(), notesStore.fetch()]);
});
</script>

<style scoped>
.folder-sidebar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--n-color);
  border-right: 1px solid var(--n-border-color);
  min-height: 500px;
}

.folder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-border-color);
  background: var(--n-color-target);
}

.folder-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--n-text-color);
}

.folder-icon {
  color: var(--n-text-color);
}

.create-button {
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.create-button:hover {
  background: var(--n-color-hover);
}

.create-button.dark-button {
  color: var(--n-text-color);
}

.folder-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.folder-item {
  cursor: pointer;
  margin: 2px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  user-select: none;
}

.folder-item:hover {
  background: var(--n-color-hover);
}

.folder-item.active {
  background: var(--n-color-pressed);
  color: var(--n-text-color);
}

.folder-item.dark {
  color: var(--n-text-color);
}

.folder-item.root-folder {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--n-border-color);
}

.folder-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  min-height: 32px;
}

.folder-name {
  flex: 1;
  font-size: 13px;
  color: var(--n-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-count {
  font-size: 11px;
  color: var(--n-text-color-disabled);
  background: var(--n-color-target);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.folder-icon-item {
  color: var(--n-text-color);
  flex-shrink: 0;
}

.expand-icon {
  color: var(--n-text-color-disabled);
  cursor: pointer;
  transition: transform 0.2s;
  padding: 2px;
}

.expand-icon:hover {
  color: var(--n-text-color);
}

.folder-notes {
  padding-left: 32px;
  border-left: 1px solid var(--n-border-color);
  margin-left: 24px;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px 0;
  font-size: 12px;
  transition: all 0.2s;
}

.note-item:hover {
  background: var(--n-color-hover);
}

.note-item.dark {
  color: var(--n-text-color);
}

.note-icon {
  color: var(--n-text-color-disabled);
  flex-shrink: 0;
}

.note-title {
  color: var(--n-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Drag and drop styles */
.folder-item[dragover] {
  background: var(--n-color-primary);
  color: white;
}

.note-item[draggable='true'] {
  cursor: grab;
}

.note-item[draggable='true']:active {
  cursor: grabbing;
}

/* Dark theme adjustments */
.dark .folder-sidebar {
  background: var(--n-color);
  border-right-color: var(--n-border-color);
}

.dark .folder-header {
  background: var(--n-color-target);
  border-bottom-color: var(--n-border-color);
}

.dark .folder-item.root-folder {
  border-bottom-color: var(--n-border-color);
}

.dark .folder-notes {
  border-left-color: var(--n-border-color);
}
</style>
