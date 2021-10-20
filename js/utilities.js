export function getCssPropety(block, property) {
  return block.get(0).style[property]!= ""
    ? block.get(0).style[property]
    : block.css(property);
}


