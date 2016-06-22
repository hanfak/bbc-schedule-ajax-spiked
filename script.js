// TV Schedule example

$(document).ready(function(){
  retrieveGenres();

  $(document).on('click', '#genres li', function(e){
    genre = $(this).attr('id');
    $("#genres li").removeClass('active');
    $(this).addClass('active');
    getTomorrowsSchedule(genre);
  });
});


function retrieveGenres(){
  var url = "http://www.bbc.co.uk/tv/programmes/genres.json";
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json'
  }).done(function(data){
    $.each(data.categories, function(i, val){
      $("#genres").append($("<li>").attr("id", this.key).text(val.title));
    });
    console.log("it received response");
  }).fail(function(){
    alert( "error" );
  }).always(function() {
  });
}

function getTomorrowsSchedule(genre) {
  var prefixUrl = "http://www.bbc.co.uk/tv/programmes/genres/";
  var suffixUrl = "/schedules/tomorrow.json";
  $.ajax({
    type: 'GET',
    url: prefixUrl+genre+suffixUrl,
    dataType: 'json',
    beforeSend: function() {
      $("#programmes").empty();
       $("#programmes").append("<div class='spinner'><img src='spinner.gif' /></div>");
    }
    }).done(function(data) {
      $(".spinner").remove();
      successRetrieve(data);
    }).fail(function() {
      console.log("something went wrong");
  });
}

function successRetrieve(data) {
  if (data.broadcasts.length > 0) {
    $.each(data.broadcasts, function(index, episode) {
      $("#programmes").append(processEpisode(episode));
    });
  } else {
    $("#programmes").append("<div class='no-programmes'>No programmes under " + genre + "</div>");
  }
}

function processEpisode(episode) {
  item_html = "<li><h2>" + episode.programme.display_titles.title + "</h2>";
  item_html += "<h3>" + episode.programme.short_synopsis + "</h3>";

  if (episode.programme.image) {
    item_html += "<img src=http://ichef.bbci.co.uk/images/ic/272x153/"+ episode.programme.image.pid +".jpg />";
  }

  return item_html;
}


function formatDate(start, end) {

  var start_date = new Date(start);
  var end_date = new Date(end);

  var day = start_date.getDate();
  var month = start_date.getMonth() + 1; // the returned months are 0-11
  var year = start_date.getFullYear();

  var start_hour = start_date.getHours();
  var start_mins = start_date.getMinutes();

  var end_hour = end_date.getHours();
  var end_mins = end_date.getMinutes();

  var date = day + "/" + month + "/" + year + " ";

  // add leading 0 and return last two characters to make sure we use 00:00 format
  date +=  ("0"+start_hour).slice(-2) + ":" + ("0"+start_mins).slice(-2) + " - " +
           ('0' + end_hour).slice(-2) + ":" +  ( "0" + end_mins).slice(-2);

  return date;
}
