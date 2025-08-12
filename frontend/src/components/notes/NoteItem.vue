<template>
  <div
    class="note-item"
    :class="{ selected: isSelected }"
    draggable="true"
    @dragstart="onDragStart"
    @click="$emit('noteSelected', note.id)"
  >
    <div class="note-header">
      <h4 class="note-title">{{ note.title || 'Untitled' }}</h4>
      <div class="note-actions">
        <n-button
          size="tiny"
          text
          @click.stop="$emit('editNote', note)"
          class="action-button"
        >
          <n-icon :size="14">
            <EditIcon />
          </n-icon>
        </n-button>
        <n-button
          size="tiny"
          text
          @click.stop="$emit('deleteNote', note)"
          class="action-button delete-button"
        >
          <n-icon :size="14">
            <DeleteIcon />
          </n-icon>
        </n-button>
      </div>
    </div>

    <div class="note-content">
      {{ truncatedContent }}
    </div>

    <div class="note-meta">
      <span class="note-date">
        {{ formatDate(note.updatedAt || note.createdAt) }}
      </span>
      <span v-if="note.folderId" class="note-folder">
        <n-icon :size="12">
          <FolderIcon />
        </n-icon>
        In folder
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NButton, NIcon } from 'naive-ui';
import {
  CreateOutline as EditIcon,
  TrashOutline as DeleteIcon,
  FolderOpenOutline as FolderIcon,
} from '@vicons/ionicons5';
import type { Note } from '@/stores/notes';

// Props
const props = defineProps<{
  note: Note;
  isSelected?: boolean;
}>();

// Emits
defineEmits<{
  noteSelected: [noteId: number];
  editNote: [note: Note];
  deleteNote: [note: Note];
}>();

// Computed
const truncatedContent = computed(() => {
  const content = props.note.content || '';
  return content.length > 100 ? content.substring(0, 100) + '...' : content;
});

// Methods
const onDragStart = (event: Event) => {
  const dragEvent = event as any;
  dragEvent.dataTransfer?.setData('text/plain', props.note.id.toString());
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
};
</script>

<style scoped>
.note-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-border-color);
  cursor: pointer;
  transition: all 0.2s;
  background: var(--n-color);
  user-select: none;
}

.note-item:hover {
  background: var(--n-color-hover);
}

.note-item.selected {
  background: var(--n-color-pressed);
  border-left: 3px solid var(--n-color-primary);
}

.note-item:last-child {
  border-bottom: none;
}

.note-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.note-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--n-text-color);
  line-height: 1.3;
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

.note-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s;
  margin-left: 8px;
}

.note-item:hover .note-actions {
  opacity: 1;
}

.action-button {
  padding: 2px;
  border-radius: 2px;
}

.delete-button:hover {
  color: var(--n-color-error);
}

.note-content {
  font-size: 12px;
  color: var(--n-text-color-disabled);
  line-height: 1.4;
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-word;
}

.note-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--n-text-color-disabled);
}

.note-date {
  font-style: italic;
}

.note-folder {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--n-color-target);
  padding: 2px 6px;
  border-radius: 8px;
}

/* Drag styles */
.note-item[dragging] {
  opacity: 0.5;
  transform: rotate(2deg);
}
</style>
