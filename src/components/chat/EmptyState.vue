<template>
    <div class="empty-state">
        <div class="avatar-container">
            <WizardAvatar class="wizard-avatar" />
        </div>
        <h3 class="title">
            Welcome to Boardgame Wiz
        </h3>
        <p class="subtitle">
            Ready to conjure up some game rule magic? Ask me anything!
        </p>
    </div>
</template>

<script setup lang="ts">
import WizardAvatar from '@/components/ui/WizardAvatar.vue'
</script>

<style scoped>
.empty-state {
    text-align: center;
    padding: 3rem 1rem;
}

.avatar-container {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
}

.wizard-avatar {
    width: 4rem;
    height: 4rem;
}

.title {
    font-size: 1.125rem;
    font-weight: 500;
    color: #f3f4f6;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #9ca3af;
}
</style>