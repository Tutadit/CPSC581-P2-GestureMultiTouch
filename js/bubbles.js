import { getCssPropety } from "./utilities.js";

const unit = "rem";
const unit_multiplier = 1.0;
const update_interval = 300; // How often ( in milliseconds ) does the size update

const Status = {
  growing: "growing",
  shrinking: "shrinking",
  inactive: "inactive",
};

class Bubbles {
  constructor(
    radiuses = 10,
    start_size = 0.33,
    end_size = 10.0,
    duration = 5000
  ) {
    this.initiateBlocks();
    this.initiateBubbleAnimateToProperties(start_size, end_size, duration);
    this.initiateBubble(start_size, end_size);
    this.initiateEvents();
    this.initiateRadiuses(radiuses);
    this.addEventsToButton();
  }

  initiateBlocks() {
    this.blocks = {
      bubble: $(".bubble"),
      button: $("button.action-button"),
      radiuses: $(".bubble-radiuses"),
    };
  }

  initiateBubbleAnimateToProperties(start_size, end_size, duration) {
    this.bubble_animate_from = {
      start: {
        width: end_size * unit_multiplier + unit,
        height: end_size * unit_multiplier + unit,
        opacity: 1,
      },
      end: {
        width: start_size * unit_multiplier + unit,
        height: start_size * unit_multiplier + unit,
        opacity: 0.46,
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

  initiateRadiuses(radiuses) {
    this.radiuses = radiuses;
    let start = this.bubble.start_size;
    let end = this.bubble.end_size;
    let radius_increment = (end - start) / radiuses;
    for (var radius = 1; radius <= this.radiuses; radius++) {
      let radius_size = radius_increment * radius + start + unit;
      this.blocks.radiuses.append(
        "<div class='bubble-wrapper'><div style='width:" +
          radius_size +
          "; height:" +
          radius_size +
          "' class='bubble-radius radius-" +
          radius +
          "'></div></div>"
      );
    }
  }

  update() {
    this.updateBubbleSize();
    console.log(this.bubble);
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
  }

  addEventsToButton() {
    for (var event in this.events) {
      this.blocks.button.on(this.events[event], this.getEventHandler(event));
    }
  }

  getEventHandler(event) {
    this.eventHandler[event] = function () {
      if (this.current_timeout) clearInterval(this.current_timeout);
      this.animateBubble(event);
      this.current_timeout = setInterval(
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
        duration: this.getCurrentDuration(),
      }
    );
    this.bubble.status =
      this.bubble.status === Status.growing
        ? Status.shrinking
        : Status.growing;
    // TODO: In here is when the bubble switches from growing to 
    //       shrinking. We can use this to update pattern recognition.
  }

  getCurrentDuration() {
    //TODO: This function should return the duration (in milliseconds) of
    //      the animation ran in this.animateBubble.
    //
    //      JQuery's animate propery takes the provided css properties,
    //      along with their values, and animates the object from its
    //      current state to the provided properties.
    //
    //      The goal is to determine how long the animation should take,
    //      based on those factors. The duration should be based on the
    //      fact that the propety this.bubble_animate_from.duration
    //      determines the duration of the animation from the start_size
    //      to the end size.
    return this.radiuses * 1000;
  }
}

export function getBubbles(radiuses = 8, start_size = 2, end_size = 30.0) {
  return new Bubbles(radiuses, start_size, end_size);
}
