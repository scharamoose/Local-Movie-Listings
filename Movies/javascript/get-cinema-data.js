  function getCinemaDetails(position) {  
    let showtimes;
    
    fetch("https://api.internationalshowtimes.com/v4/cinemas/?location=" + position.lat + ","+ position.lng +"&distance=12", {
      method: 'get',
      headers: {
        "X-API-Key": "5K9XFO0CefW8zfsTnJ95kZ6nN1LtfsaJ"
      }
    })
    .then(res => res.json())
    .then(function(cinemaData) {          
      $("#cinema").attr({'href': cinemaData.cinemas[0].website, 'target': "blank"});
      return fetch("https://api.internationalshowtimes.com/v4/showtimes/?cinema_id=" + cinemaData.cinemas[0].id, {
                method: 'get',
                headers: {
                  "X-API-Key": "5K9XFO0CefW8zfsTnJ95kZ6nN1LtfsaJ"
                }
            });
    })
    .then(res => res.json())    
    .then(function(showtimeData) {
      // populate showtimes
      showtimes = showtimeData;

      let movieData = fetch("https://api.internationalshowtimes.com/v4/movies/?cinema_id=" + showtimeData.showtimes[0].cinema_id, {
                method: 'get',
                headers: {
                  "X-API-Key": "5K9XFO0CefW8zfsTnJ95kZ6nN1LtfsaJ"
                }
            });

      return movieData;
    }) 
    .then(function(response) {
      return response.json(); // pass the data as promise to next then block
    })  
    .then(function(movieData) {
      movieData.showtimes = showtimes;
      
      // populate movie
      return populateMovie(movieData);
    })   
    .catch(() => console.log("HTTP Request Failed"));
  }

  function populateMovie(object){
    let html;
    // Using inline template as external will not load (CORS), as it is not hosted
    let template = '{{#meta_info}}\
                      <ul>\
                        {{#movies.length}}\
                          {{#movies}}\
                          <div class="media mb-4">\
                            <a class="media-left waves-light mr-3 video-btn" {{#hasTrailer}} data-src="{{trailer}}" video-btn" data-toggle="modal" data-target="#myModal" {{/hasTrailer}} {{^hasTrailer}}{{/hasTrailer}}>\
                              <img class="img-thumbnail shadow-sm" src="{{poster_image_thumbnail}}" onerror="this.src=\'https://png.icons8.com/ios/50/000000/starred-ticket.png\'" height="64" width="64" alt="Generic placeholder image">\
                            </a>\
                            <div class="media-body">\
                              <h5 class="media-heading">{{title}}\
                                <small>\
                                  {{#age_limits}}\
                                    <span class="badge badge-pill badge-danger">{{age_limits}}</span>\
                                  {{/age_limits}}\
                                </small>\
                              </h5>\
                              {{#genres}}\
                                <h6 class="badge badge-secondary">{{name}}</h6>\
                              {{/genres}}\
                              <div>\
                              <ul class="pl-0 rating inline-ul">\
                                <li class="list-inline-item"><i class="fa fa-star text-warning"></i></li>\
                                <li class="list-inline-item"><small class="text-muted">{{ratings.imdb.value}}/10 ({{ratings.imdb.vote_count}})&nbsp;<span class="badge badge-info">IMDB</span></small></li>\
                                <li class="list-inline-item"><small class="text-muted">{{ratings.tmdb.value}}/10 ({{ratings.tmdb.vote_count}})&nbsp;<span class="badge badge-danger">TMDB</span></small></li>\
                              </ul>\
                              </div>\
                              <p id="synopsis" class="crop-text text-justify mt-1 mb-1 pb-0"><small>{{synopsis}}</small></p>\
                              <div class="float-left">\
                                <small class="showtime">\
                                {{#showtimes.length}}\
                                  {{#showtimes}}\
                                    <span class="badge badge-dark">{{start_at}}</span>\
                                  {{/showtimes}}\
                                {{/showtimes.length}}\
                              </div>\
                              <div class="float-right">\
                                <span><i class="fa fa-clock-o text-primary" aria-hidden="true">&nbsp;</i>{{runtime}} mins</span></small>\
                              </div>\
                            </div>\
                          </div>\
                        {{/movies}}\
                      {{/movies.length}}\
                    </ul>\
                    {{/meta_info}}';    
    
    const retrieveMovieDetails = async () => {
      await Promise.all((object.movies.map( async (movie) => {
        await fetch("https://api.internationalshowtimes.com/v4/movies/" + movie.id + "?fields=id,title,synopsis,genres.name,runtime,ratings,age_limits,trailers", {
               method: 'get',
               headers: {
                 "X-API-Key": "5K9XFO0CefW8zfsTnJ95kZ6nN1LtfsaJ"
               }
              })
              .then(res => res.json())
              .then(function(data) {  
                let currentMovie = object.movies[object.movies.indexOf(movie)];
    
                currentMovie.synopsis = data.movie.synopsis;
                currentMovie.runtime = data.movie.runtime;
                currentMovie.genres = !!data.movie.genres ? data.movie.genres : null;
                currentMovie.ratings = !!data.movie.ratings ? data.movie.ratings : null;
                currentMovie.age_limits = !!data.movie.age_limits ? data.movie.age_limits.IE : null;                    
                currentMovie.hasTrailer = !!data.movie.trailers;
                currentMovie.trailer =  currentMovie.hasTrailer ? data.movie.trailers[0].trailer_files[0].url.replace("/watch?v=", "/embed/") : "#";            
    
                currentMovie.showtimes = 
                  $.grep(object.showtimes.showtimes, function(n, i){                
                    return (n.movie_id == movie.id);
                  });   
    
                currentMovie.showtimes.sort(function(a,b){
                  // Turn your strings into dates, and then subtract them
                  // to get a value that is either negative, positive, or zero.
                  return new Date(a.start_at) - new Date(b.start_at);
                });
    
                // Format showtimes appropriately
                currentMovie.showtimes.forEach(showtime => { 
                  showtime.start_at = moment(showtime.start_at)
                    .calendar(null, {
                      sameDay: '[Today] - hh:mm',
                      nextDay: '[Tomorrow] - hh:mm',
                      nextWeek: 'ddd Do - hh:mm',
                      lastDay: '[Yesterday] - hh:mm',
                      lastWeek: '[Last] ddd - hh:mm',
                      sameElse: 'ddd Do - hh:mm'
                  });        
                });
              })
      })));

      //// Does not work locally due to CORS
      //// ==============================================
      // $('#templates').load("templates/movie.mustache.htm #sample_template", function(){
      //   let template = $('#sample_template').html();
      //   let output = Mustache.render(template, object);
      //   $('div#current-listings-panel.tab-pane').html(output);
      // });

      html = Mustache.to_html(template, object); 
      $('div#current-listings-panel.tab-pane').html(html);

    }
    
    retrieveMovieDetails();
  }