/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {
  //Preloaded User profiles
  const tweetData = [
    {
      user: {
        name: "Newton",
        avatars: "https://i.imgur.com/73hZDYK.png",
        handle: "@SirIsaac",
      },
      content: {
        text: "If I have seen further it is by standing on the shoulders of giants",
      },
      created_at: 1702934762870,
    },
    {
      user: {
        name: "Descartes",
        avatars: "https://i.imgur.com/nlhLi3I.png",
        handle: "@rd",
      },
      content: {
        text: "Je pense, donc je suis",
      },
      created_at: 1703021162870,
    },
  ];

  //returns Html to create tweet-article dynamically. 
  //Parameters take object in format of "tweetData" above
  const createTweetElement = function (tweetObj) {
    const timeAgo = timeago.format(new Date(tweetObj.created_at));
    const $tweet = `
      <article class="tweet">
        <header>
          <div class="displayName">
            <img src=${tweetObj.user.avatars}>
            <span >${tweetObj.user.name}</span>
          </div>
          <span class="tweeterHandle">${tweetObj.user.handle}</span>
        </header>
  
        <p class ="tweeted-content"> ${tweetObj.content.text}</p>
  
        <footer>
          <time datetime="2023-12-25">${timeAgo}</time>
          <div class="tweet-actions">
            <button class = "like">
              <i class="fa-regular fa-heart"></i></button>
            <button class = "retweet">
              <i class="fa-solid fa-retweet"></i>
            </button>
            <button class = "reply">
              <i class="fa-solid fa-flag"></i>
            </button>
          </div>
        </footer>
      </article>
      `;
    return $tweet;
  };

  // function that loops through tweetData to render tweets on page.
  const renderTweets = function (tweetData) {
    $(".user-tweets").empty();
    for (const tweet of tweetData) {
      let $tweet = createTweetElement(tweet);
      $(".user-tweets").prepend($tweet);
    }
  };

  //XSS escape function
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //event handler when user creates new tweet.
  const $form = $(`#tweet-creation`);
  $form.on("submit", (event) => {
    //prevents page refresh on event submission
    event.preventDefault();
    const tweetText = escape($("#tweet-text").val());
    //Edge case tweet handler. Empty or too long text-area.
    if (tweetText.length === 0) {
      displayError("Your tweet is empty!");
      return;
    } else if (tweetText.length > 140) {
      displayError("Your tweet is too long!");
      return;
    }
    //Post request
    const formData = { text: tweetText };
    $.ajax({
      method: "POST",
      url: "/tweets/",
      data: formData,
      success: () => {
        $form.trigger("reset");
        loadTweets();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        // Handle failure here
        displayError(`Failed to post tweet: ${textStatus} - ${errorThrown}`);
      }
    });
    //Clear submission field
    $("#tweet-text").val("");
    $("#tweet-text").closest('.new-tweet').find('.counter').text(140).removeClass('negative');
  });
  //function that is called after the post request is completed.
  //Renders tweets immediately after successful tweet submissions.
  const loadTweets = function () {
    $.ajax({
      method: "GET",
      url: "/tweets/",
    }).then((tweets) => {
      renderTweets(tweets);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      // Handle failure here
      displayError(`Failed to load tweets: ${textStatus} - ${errorThrown}`);
    });
  };
  //function that takes in desired error message and displays for user.
  const displayError = function (errorMsg) {
    $(".submission-error").remove();
    const $errorHtml = `
      <div class= "submission-error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>${errorMsg}!</span>
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      `;
    $(".new-tweet").before($errorHtml);
    $(".submission-error").css('display', 'flex').hide().slideDown();
    $(".submission-error").delay(2000).slideUp(1000, function() {
      $(".submission-error").remove();
    });
  }
  //loads tweets on first page render.
  loadTweets();
});
