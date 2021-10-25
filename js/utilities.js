export const unit = "vmin";
export const unit_multiplier = 1.7;


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
