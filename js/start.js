import { getBubbles } from "./bubbles.js";
import { extendJqueryEase } from "./utilities.js";

$(document).ready(function () {
  let rings = 4;
  let start_size = 1;
  let end_size = 40.0;
  let duration = 500;
  extendJqueryEase();
  const bubbles = getBubbles(rings, start_size, end_size, duration);
});
