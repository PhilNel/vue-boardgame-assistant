<template>
  <div class="footnote-container">
    <div class="footnote-text" v-html="processedHtml" @click="handleFootnoteClick"></div>
    
    <ReferencesSection :references="props.references" />

    <FootnoteModal 
      :show="showModal" 
      :reference="selectedReference"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ReferencesSection from './ReferencesSection.vue'
import FootnoteModal from './FootnoteModal.vue'
import { getFootnoteNumber, getFootnoteSymbolsPattern, formatReferenceText } from '@/utils/stringUtils'
import { ReferenceInfo } from '@/types/chat'

interface Props {
  response: string
  references?: ReferenceInfo[]
}

const props = defineProps<Props>()
const showModal = ref(false)
const selectedReference = ref<ReferenceInfo | null>(null)

const processedHtml = computed(() => {
  if (!props.references || props.references.length === 0) {
    return props.response
  }

  const footnoteSymbols = getFootnoteSymbolsPattern()
  const footnoteRegex = new RegExp(`(${footnoteSymbols})`, 'g')

  return props.response.replace(footnoteRegex, (match) => {
    const footnoteNumber = getFootnoteNumber(match)
    if (!footnoteNumber) return match

    const reference = props.references?.find(ref => ref.id === footnoteNumber)
    if (!reference) return match

    const tooltipContent = createTooltipContent(reference)

    return `<span class="footnote-link" data-tooltip="${tooltipContent}" data-ref-id="${footnoteNumber}">${match}</span>`
  })
})

const createTooltipContent = (reference: ReferenceInfo): string => {
  return formatReferenceText(reference)
}

const openModal = (refId: number) => {
  const reference = props.references?.find(ref => ref.id === refId)
  if (reference) {
    selectedReference.value = reference
    showModal.value = true
  }
}

const closeModal = () => {
  showModal.value = false
  selectedReference.value = null
}

const handleFootnoteClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.classList.contains('footnote-link')) {
    event.preventDefault()
    const refId = parseInt(target.getAttribute('data-ref-id') || '0')
    if (refId) {
      openModal(refId)
    }
  }
}
</script>

<style scoped>
.footnote-container {
  position: relative;
  width: 100%;
}

.footnote-text {
  position: relative;
}

:deep(.footnote-link) {
  color: #3b82f6;
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: pointer;
  position: relative;
  display: inline-block;
  transition: color 0.2s ease;
}

:deep(.footnote-link:hover) {
  color: #1d4ed8;
}

/* Clean tooltips - desktop only */
@media (min-width: 769px) {
  :deep(.footnote-link::before) {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: #1f2937;
    color: #f9fafb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    white-space: nowrap;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
    z-index: 10;
    pointer-events: none;
  }

  :deep(.footnote-link::after) {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.125rem;
    border: 0.25rem solid transparent;
    border-top-color: #1f2937;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
    z-index: 10;
  }

  :deep(.footnote-link:hover::before),
  :deep(.footnote-link:hover::after) {
    opacity: 1;
    visibility: visible;
  }
}
</style> 