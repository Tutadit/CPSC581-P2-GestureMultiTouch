import { Status, Colors, getEvent, arraysEqual } from "./utilities.js";

import { Rings } from "./rings.js";
import { Bubble } from "./bubble.js";

export class Bubbles {
  constructor(
    rings = 10,
    start_size = 0.33,
    end_size = 10.0,
    duration = 5000,
    onPatternMatch
  ) {
    this.duration = duration;
    this.rings = new Rings(rings, start_size, end_size);
    this.bubble = new Bubble(start_size, end_size, duration);
    this.next_ring = 0;
    this.onPatternMatch = onPatternMatch;
    this.initiateBlocks();
    this.initiateEvents();
    this.initiatePatternRecognition();
    this.regeneratePatternOnInfo();
  }

  initiateBlocks() {
    this.blocks = {
      button: $("button.action-button"),
      tracker: $(".bubble-tracker"),
    };
  }

  initiateEvents() {
    this.events = {
      start: getEvent("start"),
      end: getEvent("end"),
    };
    this.eventHandler = {};
    this.addEventsToButton();
  }

  initiatePatternRecognition() {
    this.read_for_pattern = false;
    this.pattern_to_recognize = [2, 1, 4];
    this.current_attempt = [];
    this.play_ring = Infinity;
  }

  setPattern(onDone) {
    this.next_ring = 0;
    this.rings.show();
    this.onPatternReadDone = onDone;
    this.pattern_to_recognize = [];
    this.read_for_pattern = true;
  }

  update() {
    if (this.track_now) {
      this.track(this.track_now);
      this.track_now = null;
    }
    if (this.track_next) {
      this.track_now = this.track_next;
      this.track_next = null;
    }
    this.bubble.update();
    this.animate();
  }

  animate() {
    this.clearAnimation();
    if (this.next_ring === -1) this.animateBubbleDelayed(0);
    else if (this.next_ring === 0) this.animateBubbleDelayed();
    else this.animateBubble();
  }

  clearAnimation() {
    this.bubble.stop();
    if (this.animation_timeout) {
      clearTimeout(this.animation_timeout);
      this.animation_timeout = null;
    }
  }

  animateBubbleDelayed(duration = this.duration * 1.5) {
    this.animation_timeout = setTimeout(
      function () {
        this.rings.resetRingsColor()
        this.bubble.animate(
          this.getNextSize(),
          this.end.bind(this),
          this.nextRingReached.bind(this)
        );
      }.bind(this),
      duration
    );
  }

  end() {
    this.next_ring = 0;
    this.current_attempt = [];
    this.read_for_pattern = false;
    if (this.onPatternReadDone) {
      this.onPatternReadDone();
      this.onPatternReadDone = null;
    }
    if (this.onPlayFinish) {
      this.onPlayFinish();
      this.onPlayFinish = null;
    }

    this.play_ring = Infinity;
    this.rings.hide();
    this.pattern_match = false;
    this.started_attempt = false;
    this.bubble.setDuration(this.duration);
    this.bubble.updateColor("");
    this.bubble.reset();
    $(".start-message").css({ opacity:1})
    $(this.blocks.tracker.children().get().reverse()).each((i, trac) => {
      let delay = 150;
      setTimeout(
        function () {
          $(trac).css({
            transform: "translateY(100px)",
          });
        }.bind(trac),
        delay
      );

      setTimeout(
        function () {
          $(this).remove();
        }.bind(trac),
        delay + 100
      );
    });
    this.regeneratePatternOnInfo();
  }
  regeneratePatternOnInfo() {
    $(".current-pattern").text("");
    for (let i = 0; i < this.pattern_to_recognize.length; i++) {
      $(".current-pattern").append(
        "<div style='background-color:" +
          Colors[this.pattern_to_recognize[i] - 1] +
          "' class='track'></div>"
      );
    }
  }
  animateBubble() {
    this.bubble.animate(
      this.getNextSize(),
      this.update.bind(this),
      this.nextRingReached.bind(this)
    );
  }

  nextRingReached() {
    this.setColor();
    if (this.play_ring <= this.pattern_to_recognize.length) {
      this.next_ring = this.getNextFromPattern();
      return;
    }
    if (this.bubble.status === Status.growing) {
      if (this.next_ring <= this.rings.total) this.next_ring++;
    } else {
      if (this.next_ring !== 0) this.next_ring--;
    }
  }

  getNextFromPattern() {
    if (this.play_ring === this.pattern_to_recognize.length) {      
      return 0;
    }
    let next_in_pattern = this.pattern_to_recognize[this.play_ring];
    let next = 0;
    if (next_in_pattern > this.next_ring + 1) {
      next = this.next_ring + 1;
    } else if (next_in_pattern == this.next_ring + 1) {
      this.play_ring = this.play_ring + 1;
      next = next_in_pattern;
      this.track_next = next;
    } else if (next_in_pattern < this.next_ring - 1) {
      next = this.next_ring - 1;
    } else {
      this.play_ring = this.play_ring + 1;
      next = next_in_pattern;
      this.track_next = next;
    }
    return next;
  }

  setColor() {
    this.rings.resetRingsColor();
    if (this.next_ring === 0) {
      this.bubble.updateColor("");
      return;
    }
    let ring_to_update = this.next_ring;
    this.bubble.updateColor(Colors[ring_to_update - 1]);
    this.rings.updateRingColor(ring_to_update);
  }

  getNextSize() {
    let next_ring = this.next_ring;
    let next_size = 0;
    if (next_ring <= 0) next_size = 0;
    else if (next_ring === this.rings.total) next_size = this.bubble.end_size;
    else next_size = this.rings.sizes[next_ring - 1];
    return next_size;
  }

  play(onDone = null) {
    this.onPlayFinish = onDone;
    this.play_ring = 0;
    this.next_ring = 1;
    this.rings.show();
    this.update();
  }

  updateCurrentAttempt() {
    if (!this.started_attempt) {
      this.started_attempt = true;
      return;
    }
    if (this.bubble.status === Status.growing && this.next_ring === 1) return;

    let ring_activated = 0;
    if (this.read_for_pattern) {
      if (this.bubble.status === Status.growing)
        ring_activated = this.next_ring - 1;
      else ring_activated = this.next_ring + 1;
      if (
        ring_activated ===
        this.pattern_to_recognize[this.pattern_to_recognize.length - 1]
      )
        return;
      this.pattern_to_recognize = [
        ...this.pattern_to_recognize,
        ring_activated,
      ];
    } else {
      if (this.bubble.status === Status.growing)
        ring_activated = this.next_ring - 1;
      else ring_activated = this.next_ring + 1;
      if (
        ring_activated === this.current_attempt[this.current_attempt.length - 1]
      )
        return;
      this.current_attempt = [...this.current_attempt, ring_activated];
    }    

    this.track(ring_activated);
    if (arraysEqual(this.current_attempt, this.pattern_to_recognize))
      this.patternMatched();
  }

  track(ring_activated) {
    this.blocks.tracker.append(
      "<div style='background-color:" +
        Colors[ring_activated - 1] +
        "' class='track'></div>"
    );
  }

  patternMatched() {
    this.pattern_match = true;
    this.next_ring = -1;
    this.rings.resetRingsColor()
    this.bubble.setDuration(0.1);
    this.update();
    if (this.onPatternMatch) {
      setTimeout(this.onPatternMatch, ( this.rings.total -1 ) * 100)
    }
  }

  addEventsToButton() {
    for (var event in this.events) {
      this.blocks.button.on(this.events[event], this.getEventHandler(event));
    }
  }

  getEventHandler(event) {
    this.eventHandler[event] = function (e) {
      e.preventDefault();
      $(".start-message").css({ opacity:0})
      this.rings.show();
      if (this.next_ring >= 0) this.updateCurrentAttempt();
      if (this.play_ring < Infinity || this.pattern_match) return;
      this.bubble.updateStatus(event);      
      if (event === "end") this.next_ring--;
      else this.next_ring++;
      this.clearAnimation();
      this.update();
    };
    return this.eventHandler[event].bind(this);
  }
}
