<script lang="ts">
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    export let text: string;
    export let pulse: boolean = false;
</script>

<div class="reset">
    <button type="button" on:click={() => dispatch('click')}
        class:pulse={pulse}
    >{text}</button>
</div>

<style>
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.8);
        }
        100% {
            transform: scale(1);
        }
    }
    .pulse {
        animation-name: pulse;
        animation-iteration-count: infinite;
        animation-duration: 1000ms;
        animation-timing-function: ease-in-out;
    }
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