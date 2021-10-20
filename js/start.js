import { getBubbles } from "./bubbles.js";

$(document).ready(function () {
  let radiuses = 10;
  let start_size = 1;
  let end_size = 40.0;
  let duration = 3000;

  const bubbles = getBubbles(radiuses, start_size, end_size, duration);
});
