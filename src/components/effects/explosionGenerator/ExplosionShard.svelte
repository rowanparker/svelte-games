<script lang="ts">
    export let transformX: number;
    export let transformY: number;
    export let red: number;
    export let green: number;
    export let blue: number;
</script>

<div class="explosionShard"
     style="
        --translate-x: {transformX}px;
        --translate-y: {transformY}px;
        --bg-color: rgb({red},{green},{blue});
    "
>

</div>

<style>
    @keyframes shard {
        0% {
            transform: translate(0, 0) scale(1);
        }
        100% {
            transform: translate(var(--translate-x), var(--translate-y)) scale(10);
        }
    }
    .explosionShard {
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 3px;
        background-color: var(--bg-color);
        animation: 500ms linear 0s 1 forwards shard;
    }
</style>