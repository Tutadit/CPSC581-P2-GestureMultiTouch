import {
  getCssSquareFromSize,
  Status,
  getCssSquareSizeNumber,
  tweenPercentDone  
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
      this.block.stop()
  }

  setDuration(duration) {
    this.duration = duration;
  }

  animate(to_size, onComplete, onMaxSizeReached) {
    this.changed_color = false;
    this.onMaxSizeReached = onMaxSizeReached;    
    this.block.animate(getCssSquareFromSize(to_size), {
      duration: this.duration,
      easing: "easeOutBounce",
      complete: onComplete,
      step: function (now, tween) {
        if (this.changed_color) return;
        let percentage_done = tweenPercentDone(tween);
        if (percentage_done < 0.9) return;        
        this.onMaxSizeReached();
        this.changed_color = true;
      }.bind(this),
    });
  }

  reachedEnd() {
    return (
      (this.status === Status.shrinking &&
        this.current_size <= this.start_size) ||
      (this.status === Status.growing &&
        this.current_size >= this.end_size)
    );
  }

  updateColor(color) {
    this.block.css({
      "background-color": color,
    });
  }
}
