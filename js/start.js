import { getBubbles } from "./bubbles.js";

$(document).ready(function () {
  let rings = 6;
  let start_size = 1;
  let end_size = 40.0;
  let duration = 5000;

  const bubbles = getBubbles(rings, start_size, end_size, duration);
});
