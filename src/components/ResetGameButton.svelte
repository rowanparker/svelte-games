<script lang="ts">
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div class="reset">
    <button type="button" on:click={() => dispatch('resetGame')}>Reset Game</button>
</div>

<style>
    .reset {
        padding: 10px;
        text-align: center;
    }
    .reset button {
        border: 1px solid #cec4b3;
        background-color: #dcd4c6;
        font-size: 20px;
        color: #5e503a;
        padding: 15px 45px;
        cursor: pointer;
    }
</style>