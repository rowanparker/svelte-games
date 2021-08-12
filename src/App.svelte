<script lang="ts">
    import Navbar from "./components/Navbar.svelte";
    import TicTacToe from "./games/TicTacToe.svelte";
    import Snake from "./games/Snake.svelte";
    import JewelSwap from "./games/JewelSwap.svelte";
    import PuppyChase from "./games/PuppyChase.svelte";
    import {onMount} from "svelte";
    import {activeGame, appName} from "./stores/navbar";

    export let title;

    onMount(() => {
        window.document.title = title;
        appName.set(title);
    })
</script>

<Navbar />

{#if $activeGame === 'puppyChase'}
    <PuppyChase />
{/if}

{#if $activeGame === 'ticTacToe'}
    <TicTacToe />
{/if}

{#if $activeGame === 'snake'}
    <Snake />
{/if}

{#if $activeGame === 'jewelSwap'}
    <JewelSwap />
{/if}

{#if $activeGame === null}
    <div class="menu">
        <div class="game puppyChase active"
             on:click={() => $activeGame = 'puppyChase'}
        >
            <div class="info">
                <div class="title">Puppy Chase</div>
            </div>
            <div class="img"><img src="assets/img/puppyChase-100x50.gif" alt="Puppy Chase" /></div>
        </div>
        <div class="game ticTacToe active"
             on:click={() => $activeGame = 'ticTacToe'}
        >
            <div class="info">
                <div class="title">Tic Tac Toe</div>
            </div>
            <div class="img"><img src="assets/img/ticTacToe-100x50.gif" alt="Tic Tac Toe" /></div>
        </div>
        <div class="game jewelSwap active"
             on:click={() => $activeGame = 'jewelSwap'}
        >
            <div class="info">
                <div class="title">Jewel Swap</div>
            </div>
            <div class="img"><img src="assets/img/jewelSwap-100x50.gif" alt="Snake" /></div>
        </div>
        <div class="game snake active"
             on:click={() => $activeGame = 'snake'}
        >
            <div class="info">
                <div class="title">Snake</div>
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
    .img img {
        border-radius: 10px;
    }
    .img {
        border-radius: 10px;
        border: 2px solid #fff;
        padding: 0;
        display: flex;
    }
    img {
        width: 100px;
    }
</style>