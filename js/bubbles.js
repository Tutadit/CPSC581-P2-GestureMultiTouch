import {
  tweenPercentDone,
  getCssSize,
  getCssSquareFromSize,
  getCssSquareSizeNumber,
} from "./utilities.js";

// How often ( in milliseconds ) does the size update

const Status = {
  growing: "growing",
  shrinking: "shrinking",
  start: "growing",
  end: "shrinking",
};

const Colors = [
  "#FFE66D",
  "#4ECDC4",
  "#FF6B6B",
  "#802392",
  "#2E4057",
  "#750D37",
  "#562C2C",
  "#136F63",
  "#F686BD",
  "#007C77",
];

const update_interval = 100;

class Bubbles {
  constructor(rings = 10, start_size = 0.33, end_size = 10.0, duration = 5000) {
    this.initiateBlocks();
    this.initiateBubble(start_size, end_size, duration);
    this.initiateEvents();
    this.initiateRings(rings);
    this.addEventsToButton();
  }

  initiateBlocks() {
    this.blocks = {
      bubble: $(".bubble"),
      button: $("button.action-button"),
      rings: $(".bubble-rings"),
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

  initiateRings(total_rings) {
    let start = this.bubble.start_size;
    let end = this.bubble.end_size;
    this.rings = {
      total: total_rings,
      next_ring: 1,
      duration_per_ring: this.bubble.duration / total_rings,
      radius_increment: (end - start) / total_rings,
      sizes: [],
    };
    this.renderRings();
  }

  renderRings() {
    let total_rings = this.rings.total;
    let radius_increment = this.rings.radius_increment;
    let start = this.bubble.start_size;
    for (var ring = 1; ring <= total_rings; ring++) {
      let diameter_size = radius_increment * ring + start;
      let diameter_css_size = getCssSize(diameter_size);
      this.rings.sizes = [...this.rings.sizes, diameter_size];
      this.blocks.rings.append(
        "<div class='bubble-wrapper'><div style='width:" +
          diameter_css_size +
          "; height:" +
          diameter_css_size +
          ";' class='bubble-ring ring-" +
          ring +
          "'></div></div>"
      );
    }
  }

  update() {
    this.updateBubble();
    this.updateRings();
    if (this.reachedEnd()) return;
    this.animateBubble();
  }

  stopUpdate() {
    this.blocks.bubble.stop();
  }

  updateBubble() {
    let bubble = this.blocks.bubble;
    this.bubble.current_size = getCssSquareSizeNumber(bubble);
  }

  updateBubbleStatus(event) {
    this.bubble.status = Status[event];
  }

  reachedEnd() {
    return (
      (this.bubble.status === Status.shrinking &&
        this.bubble.current_size <= this.bubble.start_size) ||
      (this.bubble.status === Status.growing &&
        this.bubble.current_size >= this.bubble.end_size)
    );
  }

  updateRings() {
    let next_ring = 0;
    if (this.bubble.status === Status.growing) {
      next_ring = this.getNextSmallerRing();
    } else {
      next_ring = this.getNextBiggerRing();
    }
    this.rings.next_ring = next_ring;
  }

  getNextSmallerRing() {
    let sizes = this.rings.sizes;
    let current_size = this.bubble.current_size;

    let next_ring = 0;
    for (let i = 0; i < sizes.length; i++) {
      let ring_size = sizes[i];
      if (current_size < ring_size) {
        next_ring = i + 1;
        break;
      }
    }
    return next_ring;
  }

  getNextBiggerRing() {
    let sizes = this.rings.sizes;
    let current_size = this.bubble.current_size;

    let next_ring = 0;
    for (let i = sizes.length - 1; i >= 0; i--) {
      let ring_size = sizes[i];
      if (current_size > ring_size) {
        next_ring = i + 1;
        break;
      }
    }
    return next_ring;
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
    };
    return this.eventHandler[event].bind(this);
  }

  animateBubble() {
    this.changed_color = false;
    this.blocks.bubble.animate(this.getAnimatedProperties(), {
      duration: this.rings.duration_per_ring,
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
    let next_ring = this.rings.next_ring;
    let next_size = 0;
    if (next_ring === 0) next_size = this.bubble.start_size;
    else next_size = this.rings.sizes[next_ring - 1];
    return getCssSquareFromSize(next_size);
  }

  setColor() {
    this.resetRingsColor();
    if (this.rings.next_ring === 0) {
      this.blocks.bubble.css({
        "background-color": "",
      });
      return;
    }

    this.updateBubbleColor();
    this.updateRingColor();
  }

  updateBubbleColor() {
    this.blocks.bubble.css({
      "background-color": Colors[this.rings.next_ring - 1],
    });
  }

  updateRingColor() {
    let rings = this.blocks.rings.children("div");
    let ring = $(rings.get(this.rings.next_ring - 1))
      .children()
      .first();
    $(ring).css({
      border: "3px solid " + Colors[this.rings.next_ring - 1],
      "box-shadow": "0px 0px 4px 3px " + Colors[this.rings.next_ring - 1],
    });
  }

  resetRingsColor() {
    let rings = this.blocks.rings.children("div");
    rings.each(function (i, ring) {
      $($(ring).children().first()).css({
        border: "",
        "box-shadow": "",
      });
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
