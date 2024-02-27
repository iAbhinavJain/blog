// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Abhinav J Blog";
export const SITE_DESCRIPTION =
  "All about web development, design and everything in between.";
export const TWITTER_HANDLE = "@iAbhinavJ";
export const MY_NAME = "Abhinav Jain";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
