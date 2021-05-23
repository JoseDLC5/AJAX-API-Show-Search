jQuery(document).ready(function ($) {
  function bindEvents(listItem, link) {
    listItem.on("click", function (event) {
      event.preventDefault();
      showList.hide();
      show.empty();
      var requestConfig = {
        type: "GET",
        url: link,
      };

      //Make AJAX request to API
      $.ajax(requestConfig).then(function (responseMessage) {
        if (responseMessage.name) {
          show.append(`<h1>${responseMessage.name}</h1>`);
        } else {
          show.append(`<h1>N/A</h1>`);
        }

        if (responseMessage.image) {
          show.append(`<img src=${responseMessage.image.medium}></img>`);
        } else {
          show.append(`<img src="public/img/no_image.jpeg"></img>`);
        }

        let dictionary = $("<dl/>");

        dictionary.append(`<dt>Language</dt>`);

        if (responseMessage.language) {
          dictionary.append(`<dd>${responseMessage.language}</dd>`);
        } else {
          dictionary.append(`<dd>N/A</dd>`);
        }

        dictionary.append(`<dt>Genres</dt>`);
        let genreItem = $("<dd/>");
        let genreList = $("<ul/>");

        if (responseMessage.genres) {
          responseMessage.genres.forEach((element) => {
            genreList.append(`<li>${element}</li>`);
          });
        } else {
          genreList.append("<li>N/A</li>");
        }

        genreItem.append(genreList);
        dictionary.append(genreItem);

        dictionary.append(`<dt>Average Rating</dt>`);
        if (responseMessage.rating.average) {
          dictionary.append(`<dd>${responseMessage.rating.average}</dd>`);
        } else {
          dictionary.append(`<dd>N/A</dd>`);
        }
        dictionary.append(`<dt>Network</dt>`);
        if (responseMessage.network) {
          dictionary.append(`<dd>${responseMessage.network.name}</dd>`);
        } else {
          dictionary.append(`<dd>N/A</dd>`);
        }
        dictionary.append(`<dt>Summary</dt>`);
        if (responseMessage.summary) {
          summary = responseMessage.summary
            .replace(/<[^>]*>/g, " ")
            .replace(/\s{2,}/g, " ")
            .trim();
          dictionary.append(`<dd>${summary}</dd>`);
        } else {
          dictionary.append(`<dd>N/A</dd>`);
        }
        show.append(dictionary);
      });
      show.show();
      homeLink.show();
    });
  }

  var showList = $("#showList"),
    show = $("#show"),
    searchForm = $("#searchForm"),
    search_term = $("#search_term"),
    homeLink = $("#homeLink"),
    error = $("#error");

  var requestConfig = {
    type: "GET",
    url: "http://api.tvmaze.com/shows",
  };

  $.ajax(requestConfig).then(function (responseMessage) {
    responseMessage.forEach((element) => {
      let listItem = $(
        `<li><a href=${element._links.self.href}>${element.name}</a></li>`
      );
      bindEvents(listItem, element._links.self.href);
      showList.append(listItem);
      showList.show();
    });
  });

  searchForm.submit(function (event) {
    event.preventDefault();
    if (search_term.val().trim() === "") {
      error.show();
      searchForm.trigger("reset");
      return;
    }
    show.hide();
    var searchTerm = search_term.val();
    var requestConfig = {
      method: "GET",
      url: `http://api.tvmaze.com/search/shows?q=${searchTerm}`,
    };
    $.ajax(requestConfig).then(function (responseMessage) {
      showList.empty();
      responseMessage.forEach((element) => {
        let listElement = $(
          `<li><a href=${element.show._links.self.href}>${element.show.name}</a></li>`
        );
        bindEvents(listElement, element.show._links.self.href);
        showList.append(listElement);
        showList.show();
      });
    });
    searchForm.trigger("reset");
    homeLink.show();
  });
});
