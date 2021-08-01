<script lang="ts">
    import {showNavbarDropdown} from "../stores/navbar";
    import {activeGame, appName} from "../stores/navbar";
</script>

<div class="nav-bg">
    <nav>
        <div class="menu" on:click={() => showNavbarDropdown.set(!$showNavbarDropdown)}>
            <div class="button">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
            {#if $showNavbarDropdown}
                <div class="dropdown"
                >
                    <div class="item" on:click={() => $activeGame = null}>Home</div>
                    <div class="item" on:click={() => $activeGame = 'snake'}>Snake</div>
                </div>
            {/if}
        </div>
        <div class="title"><div class="value">{$appName}</div></div>
        <img class="logo" src="assets/img/logo-75x75.gif" alt="Logo"/>
    </nav>
</div>

<style>
    .nav-bg {
        background-color: #dcd4c6;
        width: 100%;
    }
    nav {
        height: 75px;
        border-bottom: 1px solid #cec4b3;
        display: grid;
        grid-template-columns: 75px 1fr 75px;
        align-items: center;
        max-width: 500px;
        margin: 0 auto;
    }

    .menu {
        border-right: 1px solid #cec4b3;
        height: 100%;
        background-color: #cec4b3;
        cursor: pointer;
    }
    .menu:hover {
        background-color: #cdbfa7;
    }
    .dropdown {
        position: absolute;
        max-width: 500px;
        width: 100%;
        background-color: #f0f0f0;
        border-top: 1px solid #cec4b3;
        border-bottom: 1px solid #cec4b3;
        display: flex;
    }
    .dropdown .item {
        padding: 1rem;
    }
    .button {
        margin: 20px 0;
        font-size: 40px;
        color: #fff;
        text-shadow: 1px 1px 2px #000;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 35px;
    }
    .button .bar {
        background-color: #e8e3da;
        height: 6px;
        width: 30px;
    }

    .title {
        display: inline-block;
        font-family: "Bangers", sans-serif;
        font-size: 35px;
        padding-left: 10px;
        color: #fff;
        text-shadow: 2px 2px 4px #999;
    }
    @media (min-width: 300px) {
        .title {
            display: inline-block;
        }
    }
    @media (min-width: 400px) {
        .title {
            font-size: 60px;
        }
    }

    .logo {
        border-right: 1px solid #cec4b3;
    }
</style>