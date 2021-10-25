export const unit = "vw";
export const unit_multiplier = 2.0;


export function getCssPropety(block, property) {
  return block.get(0).style[property]!= ""
    ? block.get(0).style[property]
    : block.css(property);
}

export function  getCssSquareFromSize(size) {
  let new_size = getCssSize(size)
  return {
    width:new_size,
    height:new_size
  }
}

export function getCssSquareSizeNumber(block) {
  let current_width = getCssPropety(block, "width");
  current_width = current_width.substr(0, current_width.length - unit.length);
  return current_width / unit_multiplier;
}

export function getNumberFromCss() {
  return 
}

export function getCssSize(size) {
  return size * unit_multiplier + unit;
}

