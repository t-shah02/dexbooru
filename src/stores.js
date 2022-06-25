import {writable} from "svelte/store"
import { browser } from '$app/env';

export const homePageQuery = writable("");
export const searchMatches = writable([]);
export const files = writable([]);
