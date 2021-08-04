<script lang="ts">
    import {onMount} from "svelte";
    import ExplosionShard from './explosionGenerator/ExplosionShard.svelte';
    import {getRandomIntInclusive} from "../../utils";

    let shards: Array<any> = [];

    onMount((): void => {
        let i: number;
        for (i = 0; i < 20; i++) {
            shards = [...shards, {
                transformX: getRandomIntInclusive(-100, 100),
                transformY: getRandomIntInclusive(-100, 100),
                red: getRandomIntInclusive(50, 200),
                green: getRandomIntInclusive(50, 200),
                blue: getRandomIntInclusive(50, 200),
            }];
        }
        setTimeout(() => {
            shards = [];
        }, 500);
    })
</script>

<div class="explosionGenerator">
    {#each shards as shard}
        <ExplosionShard {...shard} />
    {/each}
</div>


<style>
    div {
        position: relative;
    }

</style>

