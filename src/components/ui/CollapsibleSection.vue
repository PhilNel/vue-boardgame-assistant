<template>
    <div class="collapsible-section">
        <div class="header-row">
            <span class="header-text">{{ title }}</span>
            <button @click="toggle" class="toggle-button">
                <span class="toggle-icon">{{ isExpanded ? '-' : '+' }}</span>
            </button>
        </div>

        <div v-show="isExpanded" class="content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    title: string
    initiallyExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    initiallyExpanded: false
})

const isExpanded = ref(props.initiallyExpanded)

const toggle = () => {
    isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.collapsible-section {
    width: 100%;
}

.header-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.header-text {
    font-size: 1rem;
    font-weight: bold;
    color: #f3f4f6;
}

.toggle-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
}

.toggle-button:hover {
    background-color: rgba(59, 130, 246, 0.1);
}

.toggle-icon {
    color: #3b82f6;
    font-size: 1rem;
    font-weight: bold;
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content {
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>