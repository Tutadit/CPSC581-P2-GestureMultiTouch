import { getCssPropety } from "./utilities.js";

const unit = "rem";
const unit_multiplier = 1.0;
const update_interval = 100; // How often ( in milliseconds ) does the size update

const Status = {
  growing: "growing",
  shrinking: "shrinking",
  inactive: "inactive",
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

class Bubbles {
  constructor(rings = 10, start_size = 0.33, end_size = 10.0, duration = 5000) {
    this.initiateBlocks();
    this.initiateBubbleAnimateToProperties(start_size, end_size, duration);
    this.initiateBubble(start_size, end_size);
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

  initiateBubbleAnimateToProperties(start_size, end_size, duration) {
    this.bubble_animate_from = {
      start: {
        width: end_size * unit_multiplier + unit,
        height: end_size * unit_multiplier + unit,
      },
      end: {
        width: start_size * unit_multiplier + unit,
        height: start_size * unit_multiplier + unit,
      },
      duration: duration,
    };
  }

  initiateBubble(start_size, end_size) {
    this.blocks.bubble.css({
      ...this.bubble_animate_from.end,
    });
    this.bubble = {
      start_size: start_size,
      end_size: end_size,
      current_size: 0,
      status: Status.inactive,
    };
    this.updateBubbleSize();
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

  initiateRings(rings) {
    this.rings = rings;
    let start = this.bubble.start_size;
    let end = this.bubble.end_size;
    this.radius_increment = (end - start) / rings;
    this.duration_per_ring = this.bubble_animate_from.duration / this.rings;
    for (var ring = 1; ring <= this.rings; ring++) {
      let radius_size = this.radius_increment * ring + start + unit;
      this.blocks.rings.append(
        "<div class='bubble-wrapper'><div style='width:" +
          radius_size +
          "; height:" +
          radius_size +
          ";' class='bubble-ring ring-" +
          ring +
          "'></div></div>"
      );
    }
  }

  update() {
    this.updateBubbleSize();
    this.updateRings();
    // TODO:  In here we will be perfomring the checks to see how big the
    //        bubble has grown/shrank. This function runs every update_interval
    //        ms.
    //
    //        Thus far I've made the updateBubbleSize() function which
    //        updates this.bubble.current_size to represent the bubbles
    //        current size.
    //
    //        What to do:
    //
    //        Use this.radiuses, this.blocks.radiuses, and this.bubble
    //        to register when the bubble has surpassed in size each of
    //        the radiuses. css styling will be required in order to
    //        register the activation of the ring.
    //
  }

  updateBubbleSize() {
    let bubble = this.blocks.bubble;
    let current_width = getCssPropety(bubble, "width");
    current_width = current_width.substr(0, current_width.length - unit.length);
    let current_size = current_width / unit_multiplier;
    this.bubble.current_size = current_size;
    if (
      this.bubble.status === Status.shrinking &&
      this.bubble.current_size === this.bubble.start_size
    ) {
      clearInterval(this.current_interval);
    }
    if (
      this.bubble.status === Status.growing &&
      this.bubble.current_size === this.bubble.end_size
    ) {
      clearInterval(this.current_interval);
    }
  }

  updateRings() {
    let children = this.blocks.rings.children("div")
    if (this.bubble.status === Status.shrinking)
      children = children.get().reverse()
    $(children).each(
      function (i, ring) {
        let ring_block = $(ring).children("div").first();
        let current_width = getCssPropety(ring_block, "width");
        current_width = current_width.substr(
          0,
          current_width.length - unit.length
        );
        if (this.bubble.status === Status.growing) {
          if (this.bubble.current_size >= current_width)
            this.blocks.bubble.css({ "background-color": Colors[i] });
        } else {
          if (this.bubble.current_size <= current_width)
            this.blocks.bubble.css({ "background-color": Colors[this.rings - i - 1] });
        }
      }.bind(this)
    );
  }

  addEventsToButton() {
    for (var event in this.events) {
      this.blocks.button.on(this.events[event], this.getEventHandler(event));
    }
  }

  getEventHandler(event) {
    this.eventHandler[event] = function () {
      if (this.current_interval) clearInterval(this.current_interval);
      this.animateBubble(event);
      this.current_interval = setInterval(
        this.update.bind(this),
        update_interval
      );
    };

    return this.eventHandler[event].bind(this);
  }

  animateBubble(event) {
    let animated_properties = this.bubble_animate_from[event];
    this.blocks.bubble.stop();
    this.blocks.bubble.animate(
      {
        ...animated_properties,
      },
      {
        duration: this.getCurrentDuration(event),
        easing:"linear"
      }
    );
    this.bubble.status =
      this.bubble.status === Status.growing ? Status.shrinking : Status.growing;
    // TODO: In here is when the bubble switches from growing to
    //       shrinking. We can use this to update pattern recognition.
  }

  getCurrentDuration(event) {
    let size_left =
      event === "start"
        ? this.bubble.end_size - this.bubble.current_size
        : this.bubble.current_size - this.bubble.start_size;
    let rings_left = size_left / this.radius_increment;
    return rings_left * this.duration_per_ring;
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
