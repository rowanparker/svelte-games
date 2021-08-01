import {writable} from "svelte/store";

export const showNavbarDropdown = writable(false);
export const activeGame = writable(null);
export const appName = writable('Loading');