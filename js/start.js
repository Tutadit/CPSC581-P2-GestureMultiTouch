import { Bubbles } from "./bubbles.js";
import { extendJqueryEase } from "./utilities.js";

function onPatternMatch() {
  $(".lock-screen").addClass("hidden");
  $(".main-screen").removeClass("hidden");
  $(".bubbles").hide();
  $(".action-button").hide();
}

function time() {
  let today = new Date();
  if (today.getMinutes() < 10) {
    var time = today.getHours() + ":" + "0" + today.getMinutes();
  } else {
    var time = today.getHours() + ":" + today.getMinutes();
  }
  $(".clock").text(time);
}

$(document).ready(function () {
  let rings = 5;
  let start_size = 1;
  let end_size = 40.0;
  let duration = 450;

  time();
  setInterval(time, 1000);
  extendJqueryEase();
  const bubbles = new Bubbles(
    rings,
    start_size,
    end_size,
    duration,
    onPatternMatch
  );
  $(".show-settings").click(function () {
    $(".the-settings").removeClass("hidden");
  });
  $(".close-settings").click(function () {
    $(".bubbles").hide();
    $(".action-button").hide();
    $(".the-settings").addClass("hidden");
  });
  $("#play").click(
    function () {
      $(".settings-wrapper").hide();
      setTimeout(
        function () {
          $(".bubbles").show();
          this.play(function () {
            $(".bubbles").hide();
            $(".action-button").hide();
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
      $(".bubbles").show();
      $(".action-button").show();
      this.setPattern(function () {
        setTimeout(function () {
          $(".bubbles").hide();
          $(".action-button").hide();
          $(".settings-wrapper").show();
        }, 500);
      });
    }.bind(bubbles)
  );
  $(".close-info").click(function () {
    $(".info").addClass("hidden");
  });

  $(".help-button").click(function () {
    $(".info").removeClass("hidden");
  });
  $("#lock").click(function () {
    $(".lock-screen").removeClass("hidden");
    $(".main-screen").addClass("hidden");
    $(".bubbles").show();
    $(".action-button").show();
  });
});
