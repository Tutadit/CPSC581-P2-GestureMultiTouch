import { Bubbles } from "./bubbles.js";
import { extendJqueryEase } from "./utilities.js";

function onPatternMatch() {
  $(".lock-screen").addClass("hidden");
  $(".main-screen").removeClass("hidden");
}

$(document).ready(function () {
  let rings = 6;
  let start_size = 1;
  let end_size = 40.0;
  let duration = 900;

  extendJqueryEase();
  const bubbles = new Bubbles(
    rings,
    start_size,
    end_size,
    duration,
    onPatternMatch
  );
  $("#play").click(
    function () {
      $(".settings-wrapper").hide();
      setTimeout(
        function () {
          this.play(function () {
            setTimeout(function () {
              $(".settings-wrapper").show();
            }, 500);
          });
        }.bind(this),
        500
      );
    }.bind(bubbles)
  );
  $("#change").click(
    function () {
      $(".settings-wrapper").hide();
      this.setPattern(function () {
        setTimeout(function () {
          $(".settings-wrapper").show();
        }, 500);
      });
    }.bind(bubbles)
  );
  $(".close-info").click(function () {
    $(".info").addClass("hidden")
  })

  $(".help-button").click(function(){
    $(".info").removeClass("hidden")
  })
  $("#lock").click(function() {
    $(".lock-screen").removeClass("hidden");
    $(".main-screen").addClass("hidden");
  })
});
