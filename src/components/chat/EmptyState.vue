<template>
    <div class="empty-state">
        <div class="avatar-container">
            <Avatar class="avatar" />
        </div>
        <h3 class="title">
            Greetings, fellow gamer!
        </h3>
        <p class="subtitle">
            I'm Ernest, keeper of Boardgame Warlock's ancient knowledge.
        </p>
        <p class="subtitle">Ready to cast some clarity on those tricky rules?</p>
    </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'
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

.avatar {
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