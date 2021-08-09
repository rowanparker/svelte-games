<script lang="ts">
    import GameTitle from "../components/GameTitle.svelte";
    import {onMount} from "svelte";

    let grabbing: boolean = false;

    let bone: HTMLElement;
    let yard: HTMLElement;

    onMount(() => {
        const gameContainer: HTMLElement = document.querySelector('.gameContainer');
        const gameContainerY = gameContainer.getBoundingClientRect().top + 10;
        gameContainer.style.height = `calc(100vh - ${gameContainerY}px)`;
        bone = document.querySelector('#game-bone');
        yard = document.querySelector('#game-yard');
        bone.style.left = Math.floor(yard.getBoundingClientRect().width / 2 - bone.getBoundingClientRect().width) + 'px';
        bone.style.top = Math.floor(yard.getBoundingClientRect().height / 2 - bone.getBoundingClientRect().height) + 'px';
    })

    const handleBoneMove = (bone: HTMLElement, yard: HTMLElement, rawX: number, rawY: number) => {
        const rectBone = bone.getBoundingClientRect();
        const rectYard = yard.getBoundingClientRect();

        let actualX = rawX - rectYard.left - (rectBone.width / 2);
        let actualY = rawY - rectYard.top - (rectBone.height / 2);

        if (actualY < 0) {
            actualY = 0;
        } else if (actualY + rectBone.height > rectYard.height) {
            actualY = rectYard.height - rectBone.height;
        }

        if (actualX < 0) {
            actualX = 0;
        } else if (actualX + rectBone.width > rectYard.width) {
            actualX = rectYard.width - rectBone.width;
        }

        bone.style.left = actualX + 'px';
        bone.style.top = actualY + 'px';
    };

    const handleMouseMove = (e) => {
        if (e.buttons === 0) {
            return;
        }

        handleBoneMove(bone, yard, e.clientX, e.clientY);
    }

    const handleTouchMove = (e) => {
        handleBoneMove(bone, yard, e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    }
</script>

<div class="gameContainer">
    <GameTitle name={'Puppy Chase'}/>
    <div class="yardContainer">
        <div id="game-yard">
            <img alt="Bone"
                 id="game-bone"
                 draggable="false"
                 src="assets/img/puppyChase/bone-48x48.gif"
                 on:touchmove={handleTouchMove}
                 on:mousemove={handleMouseMove}
            />
        </div>
    </div>
</div>

<style>
    .gameContainer {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content 1fr;
        overflow-y: hidden;
    }
    .yardContainer {
        padding: 10px;
    }
    #game-yard {
        margin: 0 auto;
        width: 100%;
        height: 100%;
        max-width: 800px;
        max-height: 1600px;
        background-color: #32913d;
        position: relative;
    }
    #game-bone {
        position: absolute;
    }
</style>