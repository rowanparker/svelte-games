<script lang="ts">
    import Navbar from "./components/Navbar.svelte";
    import TicTacToe from "./games/TicTacToe.svelte";
    import {activeGame,appName} from "./stores/navbar";
    import Snake from "./games/Snake.svelte";
    import {onMount} from "svelte";

    export let title;

    onMount(() => {
        window.document.title = title;
        appName.set(title);
    })
</script>

<Navbar />

{#if $activeGame === 'ticTacToe'}
    <TicTacToe />
{/if}

{#if $activeGame === 'snake'}
    <Snake />
{/if}
