//dynamic character counter for tweet submission.
$(document).ready(function () {
  $("#tweet-text").on("input", function () {
    const inputLength = $(this).val().length;
    const remainingChar = 140 - inputLength
    let $counter = $(this).closest('.new-tweet').find('.counter');
    if (remainingChar < 0) {
      $counter.text(remainingChar).addClass('negative');
    } else {
      $counter.text(remainingChar).removeClass('negative');
    }
  });
});
