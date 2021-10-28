import {
  getCssSquareFromSize,
  Status,
  getCssSquareSizeNumber,
  tweenPercentDone,
} from "./utilities.js";

export class Bubble {
  constructor(start_size, end_size, duration) {
    this.block = $(".bubble");
    this.start_size = start_size;
    this.end_size = end_size;
    this.current_size = 0;
    this.status = Status.growing;
    this.duration = duration;
    this.update();
  }

  update() {
    let bubble = this.block;
    this.current_size = getCssSquareSizeNumber(bubble);
  }

  updateStatus(event) {
    this.status = Status[event];
  }

  stop() {
    this.block.stop();
  }

  setDuration(duration) {
    this.duration = duration;
  }

  animate(to_size, onComplete, onMaxSizeReached) {
    if (to_size=== undefined) return
    console.log(to_size);
    this.changed_color = false;
    this.onMaxSizeReached = onMaxSizeReached;
    this.block.animate(
      to_size > 0
        ? getCssSquareFromSize(to_size)
        : {
            opacity: 0,
          },
      {
        duration: to_size > 0 ? this.duration : 0.1,
        easing: "easeOutBounce",
        complete: onComplete,
        step: function (now, tween) {
          if (this.changed_color) return;
          let percentage_done = tweenPercentDone(tween);
          if (percentage_done < 0.98) return;
          
          this.onMaxSizeReached();
          this.changed_color = true;
        }.bind(this),
      }
    );
  }

  reset() {
    this.block.css({
      opacity:1,
      ...getCssSquareFromSize(0),
    });
  }

  reachedEnd() {
    return (
      (this.status === Status.shrinking &&
        this.current_size <= this.start_size) ||
      (this.status === Status.growing && this.current_size >= this.end_size)
    );
  }

  updateColor(color) {
    this.block.css({
      "background-color": color,
    });
  }
}
