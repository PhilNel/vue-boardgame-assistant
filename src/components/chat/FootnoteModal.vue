<template>
    <BottomSheet :show="show" title="Reference" @close="handleClose">
        <div v-if="reference" class="reference-detail">
            <div class="reference-content">
                <span class="reference-number">{{ reference.id }}.</span>
                <span class="reference-text">{{ formatReferenceText(reference) }}</span>
                <a v-if="reference.url" :href="reference.url" target="_blank" class="external-link"
                    title="Open external link">
                    <ExternalLinkIcon />
                </a>
            </div>
            <div v-if="reference.url" class="reference-url">
                <a :href="reference.url" target="_blank">{{ reference.url }}</a>
            </div>
        </div>
    </BottomSheet>
</template>

<script setup lang="ts">
import BottomSheet from '@/components/ui/BottomSheet.vue'
import ExternalLinkIcon from '@/components/ui/icons/ExternalLinkIcon.vue'
import { ReferenceInfo } from '@/types/chat'
import { formatReferenceText } from '@/utils/stringUtils'

interface Props {
    show: boolean
    reference: ReferenceInfo | null
}

interface Emits {
    (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
    emit('close')
}
</script>

<style scoped>
.reference-detail {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.reference-content {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.5;
}

.reference-number {
  font-size: 1rem;
  font-weight: 600;
  color: #3b82f6;
  flex-shrink: 0;
  line-height: 1.5;
}

.reference-text {
  font-size: 1rem;
  color: #f3f4f6;
  flex-grow: 1;
  line-height: 1.5;
}

.external-link {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background-color: rgba(59, 130, 246, 0.1);
    flex-shrink: 0;
}

.external-link:hover {
    color: #1d4ed8;
    background-color: rgba(59, 130, 246, 0.2);
}

.reference-url {
    padding-top: 0.5rem;
    border-top: 1px solid #374151;
}

.reference-url a {
    color: #9ca3af;
    text-decoration: underline;
    font-size: 0.875rem;
    word-break: break-all;
}

.reference-url a:hover {
    color: #d1d5db;
}
</style>