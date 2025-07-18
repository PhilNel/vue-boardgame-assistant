<template>
    <BaseModal :show="show" :title="modalTitle" submit-text="Submit" @close="handleClose" @submit="handleSubmit">
        <template #body>
            <p class="feedback-description">
                {{ feedbackDescription }}
            </p>

            <!-- Issue selection for negative feedback -->
            <div v-if="feedbackType === 'negative'" class="form-group">
                <label for="issue-select" class="form-label">What was the issue? (optional)</label>
                <Select id="issue-select" v-model="selectedIssue" placeholder="Select an issue...">
                    <option v-for="issue in FEEDBACK_ISSUES" :key="issue" :value="issue">
                        {{ FEEDBACK_ISSUE_LABELS[issue] }}
                    </option>
                </Select>
            </div>

            <div class="form-group">
                <label for="description" class="form-label">
                    {{ descriptionLabel }}
                </label>
                <textarea id="description" v-model="description" :placeholder="descriptionPlaceholder"
                    class="textarea-input" rows="3" maxlength="256" />
                <div class="character-count">{{ description.length }}/256</div>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import Select from '@/components/ui/Select.vue'
import { FEEDBACK_ISSUES, FEEDBACK_ISSUE_LABELS, type FeedbackIssue, type FeedbackType } from '@/types/feedback'

interface Props {
    show: boolean
    feedbackType: FeedbackType
}

interface Emits {
    (e: 'close'): void
    (e: 'submit', data: {
        issues?: FeedbackIssue[]
        description?: string
    }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedIssue = ref<FeedbackIssue | ''>('')
const description = ref('')

const modalTitle = computed(() => {
    return props.feedbackType === 'positive' ? 'Thanks for the feedback!' : 'Help us improve'
})

const feedbackDescription = computed(() => {
    return props.feedbackType === 'positive'
        ? "We're glad this response was helpful! Any additional thoughts?"
        : "What went wrong with this response? Your feedback helps us improve Ernest's answers."
})

const descriptionLabel = computed(() => {
    return props.feedbackType === 'positive'
        ? 'Additional thoughts (optional)'
        : 'Additional details (optional)'
})

const descriptionPlaceholder = computed(() => {
    return props.feedbackType === 'positive'
        ? 'What did you find helpful about this response?'
        : 'Tell us more about what was wrong...'
})

const resetForm = () => {
    selectedIssue.value = ''
    description.value = ''
}

const handleClose = () => {
    resetForm()
    emit('close')
}

const handleSubmit = () => {
    const submissionData: {
        issues?: FeedbackIssue[]
        description?: string
    } = {}

    // Add issues for negative feedback (only if selected)
    if (props.feedbackType === 'negative' && selectedIssue.value) {
        submissionData.issues = [selectedIssue.value]
    }

    // Add description if provided
    if (description.value.trim()) {
        submissionData.description = description.value.trim()
    }

    emit('submit', submissionData)
    resetForm()
    emit('close')
}

watch(() => props.show, (newShow) => {
    if (!newShow) {
        resetForm()
    }
})
</script>

<style scoped>
.feedback-description {
    color: #d1d5db;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #f9fafb;
    margin-bottom: 0.5rem;
}

.textarea-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    background-color: #374151;
    color: #f9fafb;
    font-size: 0.875rem;
    resize: vertical;
    min-height: 4rem;
    transition: border-color 0.2s;
}

.textarea-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
}

.textarea-input::placeholder {
    color: #9ca3af;
}

.character-count {
    font-size: 0.75rem;
    color: #9ca3af;
    text-align: right;
    margin-top: 0.25rem;
}
</style>