export const unit = "vmin";
export const unit_multiplier = 1.7;

export const Status = {
  growing: "growing",
  shrinking: "shrinking",
  start: "growing",
  end: "shrinking",
};

export const Colors = [
  "#0D3B66",//Blue
  "#F95738",//Orange
  "#F6AE2D",//Yellow
  "#28965A",//Green
  "#E9190F",//Red
  "#A0D2DB",//Light blue
  "#540D6E",//Purple
];

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

export function extendJqueryEase() {
  jQuery.easing['jswing'] = jQuery.easing['swing'];
  jQuery.extend( jQuery.easing,
    {
        def: 'easeOutQuad',
        easeInBounce: function (x, t, b, c, d) {
            return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
            return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });
}


export function tweenPercentDone(tween) {
  let end = tween.end;
  let current = tween.now;
  let percentage_done = 0;
  if (current < end) percentage_done = current / end;
  else percentage_done = end / current;  
  return percentage_done;
}

export function getEvent(type) {
  if (type === 'start') 
    return  "ontouchstart" in document.documentElement ? "touchstart" : "mousedown"
  return "ontouchend" in document.documentElement ? "touchend" : "mouseup"
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


