/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {
  
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
  const loadTweets = function () {
    $.ajax({
      method: "GET",
      url: "/tweets/",
    }).then((tweets) => {
      renderTweets(tweets);
      console.log()
    });
  };

  const createTweetElement = function (tweetObj) {
    const timeAgo = timeago.format(new Date(tweetObj.created_at));
    const $tweet = `
      <article class="tweet">
        <header>
          <div class="displayName">
            <img ><i class="fa-regular fa-user"></i>
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
  const renderTweets = function (tweetData) {
    for (const tweet of tweetData) {
      let $tweet = createTweetElement(tweet);
      $(".user-tweets").prepend($tweet);
    }
  };
  const $form = $(`#tweet-creation`);
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
  $form.on("submit", (event) => {
    event.preventDefault();
    const formData = $form.serialize();
    if (formData.length === 0) {
      window.alert("Your tweet is empty!");
      return;
    } else if (formData.length > 140) {
      window.alert("Your tweet is too long!");
      return;
    }
    $.ajax({
      method: "POST",
      url: "/tweets/",
      data: formData,
      success: () => {
        $form.trigger('reset');
        loadTweets()
      },
    });
    $('#tweet-text').val('');
  });
  loadTweets()
});
