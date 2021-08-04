import {Writable, writable} from "svelte/store";

export const animateCellsFalling: Writable<Array<number>> = writable([]);
