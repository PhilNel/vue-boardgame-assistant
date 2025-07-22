<template>
    <div v-if="references && references.length > 0" class="references-section">
        <CollapsibleSection title="References">
            <div class="references-list">
                <div v-for="reference in references" :key="reference.id" :id="`reference-${reference.id}`"
                    class="reference-item">
                    <span class="reference-number">{{ reference.id }}.</span>
                    <span class="reference-content" v-html="formatReference(reference)"></span>
                </div>
            </div>
        </CollapsibleSection>
    </div>
</template>

<script setup lang="ts">
import CollapsibleSection from '@/components/ui/CollapsibleSection.vue'
import { ReferenceInfo } from '@/types/chat';

interface Props {
    references?: ReferenceInfo[]
}

defineProps<Props>()

const formatReference = (reference: ReferenceInfo): string => {
    const parts = []

    if (reference.title) {
        parts.push(`<strong>${reference.title}</strong>`)
    }

    if (reference.section) {
        parts.push(reference.section)
    }

    if (reference.page) {
        parts.push(reference.page)
    }

    return parts.join(' - ')
}
</script>

<style scoped>
.references-section {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #374151;
}

.references-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.reference-item {
    display: flex;
    align-items: flex-start;
    font-size: 0.875rem;
    line-height: 1.4;
    padding: 0.25rem;
    border-radius: 0.25rem;
}

.reference-number {
    color: #3b82f6;
    margin-right: 0.5rem;
    font-weight: 500;
    flex-shrink: 0;
}

.reference-content {
    color: #d1d5db;
}

:deep(.reference-content strong) {
    color: #f3f4f6;
    font-weight: 600;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .references-section {
        margin-top: 1rem;
        padding-top: 0.75rem;
    }
}
</style>