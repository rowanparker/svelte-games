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

{#if $activeGame === null}
    <div class="menu">
        <div class="game snake active"
             on:click={() => $activeGame = 'snake'}
        >
            <div class="info">
                <div class="title">Snake</div>
                <div class="subTitle">To kill time</div>
            </div>
            <div class="img"><img src="assets/img/snake-100x50.gif" alt="Snake" /></div>
        </div>
        <div class="game boiRacer">
            <div class="info">
                <div class="title">Boi Racer</div>
                <div class="subTitle">Coming... after COVID?</div>
            </div>
            <div class="img"><img src="assets/img/boi-racer-100x50.gif" alt="Boi Racer" /></div>
        </div>
    </div>
{/if}

<style>
    .menu {
        padding: 10px;
    }
    .title {
        font-family: "Bangers", sans-serif;
        font-size: 40px;
        color: #fff;
    }
    .subTitle {
        color: #40392d;
        font-size: 90%;
    }
    .game.active {
        cursor: pointer;
        background-color: #b7b7a4;
    }
    .game.active:hover {
        background-color: #6b705c;
    }
    .game.active:hover .subTitle {
        color: #fff;
    }
    .game {
        display: grid;
        grid-template-columns: 1fr min-content;
        max-width: 480px;
        padding: 10px;
        margin: 10px auto;
        background-color: #dcd4c6;
        border-radius: 10px;
        border: 1px solid #cec4b3;
    }
    .snake .img {
        background-color: #8fac9d;
    }
    .boiRacer .img {
        background-color: #c75146;
    }
    .img {
        border-radius: 10px;
        border: 2px solid #fff;
        padding: 5px;
        display: flex;
    }
    img {
        width: 100px;
    }
</style>

