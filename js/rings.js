import { getCssSize, Status, Colors } from "./utilities.js";

export class Rings {
  constructor(total_rings, start_size, end_size) {
    this.total = total_rings;
    this.radius_increment = (end_size - start_size) / total_rings;
    this.sizes = [];
    this.start = start_size;
    this.block = $(".bubble-rings");
    this.renderRings();
  }

  renderRings() {
    let total_rings = this.total;
    let radius_increment = this.radius_increment;
    let start = this.start;
    for (var ring = 1; ring <= total_rings; ring++) {
      let diameter_size = radius_increment * ring + start;
      let diameter_css_size = getCssSize(diameter_size);
      this.sizes = [...this.sizes, diameter_size];
      this.block.append(
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

  getNextBiggerRing(current_size) {
    let sizes = this.sizes;

    if (current_size === sizes[this.total - 1]) return this.total;

    let next_ring = this.total;
    for (let i = 0; i < sizes.length; i++) {
      let ring_size = sizes[i];
      if (current_size < ring_size) {
        next_ring = i + 1;
        break;
      }
    }
    return next_ring;
  }

  getNextSmallerRing(current_size) {
    let sizes = this.sizes;

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

  updateRingColor(ring_to_update) {
    let rings = this.block.children("div");
    let ring = $(rings.get(ring_to_update)).children().first();
    $(ring).css({
      border: "3px solid " + Colors[ring_to_update],
      "box-shadow": "0px 0px 4px 3px " + Colors[ring_to_update],
    });
  }

  resetRingsColor() {
    let rings = this.block.children("div");
    rings.each(function (i, ring) {
      $($(ring).children().first()).css({
        border: "",
        "box-shadow": "",
      });
    });
  }
}
