<template>
    <div class="select-wrapper">
        <select :id="id" :value="modelValue" @input="handleChange" class="select-input" :disabled="disabled">
            <option v-if="placeholder" value="" :disabled="!allowEmpty">
                {{ placeholder }}
            </option>
            <slot />
        </select>

        <div class="select-arrow">
            <ChevronDownIcon />
        </div>
    </div>
</template>

<script setup lang="ts">
import ChevronDownIcon from '@/components/ui/icons/ChevronDownIcon.vue'

interface Props {
    id?: string
    modelValue?: string | number | ''
    placeholder?: string
    allowEmpty?: boolean
    disabled?: boolean
}

interface Emits {
    (e: 'update:modelValue', value: string): void
}

withDefaults(defineProps<Props>(), {
    modelValue: '',
    allowEmpty: true,
    disabled: false
})

const emit = defineEmits<Emits>()

const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
}
</script>

<style scoped>
.select-wrapper {
    position: relative;
    width: 100%;
}

.select-input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    background-color: #374151;
    color: #f9fafb;
    font-size: 0.875rem;
    cursor: pointer;
    appearance: none;
}

.select-input:focus {
    outline: none;
    border-color: #3b82f6;
}

.select-arrow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-right: 0.75rem;
    pointer-events: none;
    color: #9ca3af;
}
</style>