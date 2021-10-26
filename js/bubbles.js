import {
  tweenPercentDone,
  getCssSize,
  getCssSquareFromSize,
  getCssSquareSizeNumber,
  Status,
  Colors,
} from "./utilities.js";

import { Rings } from "./rings.js";

// How often ( in milliseconds ) does the size update

const update_interval = 100;

class Bubbles {
  constructor(rings = 10, start_size = 0.33, end_size = 10.0, duration = 5000) {
    this.rings = new Rings(rings, start_size, end_size);
    this.initiateBlocks();
    this.initiateBubble(start_size, end_size, duration);
    this.initiateEvents();
    this.addEventsToButton();
    this.initiatePatternRecognition();
  }

  initiateBlocks() {
    this.blocks = {
      bubble: $(".bubble"),
      button: $("button.action-button"),
    };
  }

  initiateBubble(start_size, end_size, duration) {
    this.blocks.bubble.css(getCssSquareFromSize(start_size));
    this.bubble = {
      start_size: start_size,
      end_size: end_size,
      current_size: 0,
      status: Status.growing,
      duration: duration,
      next_ring: 1,
    };
    this.updateBubble();
  }

  initiateEvents() {
    this.events = {
      start:
        "ontouchstart" in document.documentElement ? "touchstart" : "mousedown",
      end: "ontouchend" in document.documentElement ? "touchend" : "mouseup",
    };
    this.eventHandler = {
      start: null,
      end: null,
    };
  }

  initiatePatternRecognition() {
    this.pattern_to_recognize = [1, 2, 3];
    this.current_attempt = [];
  }

  update() {
    this.updateBubble();
    if (this.reachedEnd()) return;

    if (this.bubble.next_ring === 0)
      this.animation_timeout = setTimeout(
        function () {
          this.animateBubble();
          this.current_attempt = [];
        }.bind(this),
        this.bubble.duration * 1.5
      );
    else this.animateBubble();
  }

  getNextRing() {
    let next_ring = 0;
    if (this.bubble.status === Status.growing) {
      next_ring = this.rings.getNextBiggerRing(this.bubble.current_size);
    } else {
      next_ring = this.rings.getNextSmallerRing(this.bubble.current_size);
    }
    return next_ring;
  }

  stopUpdate() {
    this.blocks.bubble.stop();
  }

  updateBubble() {
    let bubble = this.blocks.bubble;
    this.bubble.current_size = getCssSquareSizeNumber(bubble);
    this.bubble.next_ring = this.getNextRing();
  }

  updateBubbleStatus(event) {
    this.bubble.status = Status[event];
  }

  updateCurrentAttempt() {
    if (this.bubble.status === Status.growing)
      this.current_attempt = [
        ...this.current_attempt,
        this.bubble.next_ring - 1,
      ];
    else
      this.current_attempt = [
        ...this.current_attempt,
        this.bubble.next_ring + 1,
      ];
  }

  reachedEnd() {
    return (
      (this.bubble.status === Status.shrinking &&
        this.bubble.current_size <= this.bubble.start_size) ||
      (this.bubble.status === Status.growing &&
        this.bubble.current_size >= this.bubble.end_size)
    );
  }

  addEventsToButton() {
    for (var event in this.events) {
      this.blocks.button.on(this.events[event], this.getEventHandler(event));
    }
  }

  getEventHandler(event) {
    this.eventHandler[event] = function (e) {
      e.preventDefault();
      this.stopUpdate();
      this.updateBubbleStatus(event);
      this.update();
      if (this.bubble.next_ring > 1) this.updateCurrentAttempt();
    };
    return this.eventHandler[event].bind(this);
  }

  animateBubble() {
    if (this.animation_timeout) {
      clearTimeout(this.animation_timeout);
      this.animation_timeout = null;
    }
    this.changed_color = false;
    this.blocks.bubble.animate(this.getAnimatedProperties(), {
      duration: this.bubble.duration,
      easing: "easeOutBounce",
      complete: this.update.bind(this),
      step: function (now, tween) {
        if (this.changed_color) return;
        let percentage_done = tweenPercentDone(tween);
        if (percentage_done < 0.9) return;
        this.setColor();
        this.changed_color = true;
      }.bind(this),
    });
  }

  getAnimatedProperties() {
    let next_ring = this.bubble.next_ring;
    let next_size = 0;
    if (next_ring === 0) {
      next_size = this.bubble.start_size;
    } else if (next_ring === this.rings.total) next_size = this.bubble.end_size;
    else next_size = this.rings.sizes[next_ring - 1];
    return getCssSquareFromSize(next_size);
  }

  setColor() {
    this.rings.resetRingsColor();
    if (this.bubble.next_ring === 0) {
      this.blocks.bubble.css({
        "background-color": "",
      });
      return;
    }

    this.updateBubbleColor();
    this.rings.updateRingColor(this.bubble.next_ring - 1);
  }

  updateBubbleColor() {
    this.blocks.bubble.css({
      "background-color": Colors[this.bubble.next_ring - 1],
    });
  }
}

export function getBubbles(
  rings = 10,
  start_size = 0.33,
  end_size = 10.0,
  duration = 5000
) {
  return new Bubbles(rings, start_size, end_size, duration);
}
