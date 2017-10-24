var getSongNumberCell = function (number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};


// create a function named createSongRow that generates the song row content - we declare the objects before the function because the createSongRow function uses the info stored in the album objects

var createSongRow = function (songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
      + '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '   <td class="song-item-title">' + songName + '</td>'
      + '   <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>';
 
  var $row = $(template);

    
  var clickHandler = function() {
      var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
          var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
          currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }
      if (currentlyPlayingSongNumber !== songNumber) {
          setSong(songNumber);
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();
          currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
          
          var $volumeFill = $('.volume .fill');
          var $volumeThumb = $('.volume .thumb');
          $volumeFill.width(currentVolume + '%');
          $volumeThumb.css({left: currentVolume + '%'});
          
          $(this).html(pauseButtonTemplate);  
          updatePlayerBarSong();

          var $volumeFill = $('.volume .fill');
          var $volumeThumb = $('.volume .thumb');
          $volumeFill.width(currentVolume + '%');
          $volumeThumb.css({left: currentVolume + '%'});
      } else if (currentlyPlayingSongNumber === songNumber) {
          if (currentSoundFile.isPaused()) {
              $(this).html(pauseButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPauseButton);
              currentSoundFile.play();
              updateSeekBarWhileSongPlays();
          } else {
              $(this).html(playButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPlayButton);
              currentSoundFile.pause();   
          }
      }
    };
  
    var onHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
  
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };
 
     // #1
    $row.find('.song-item-number').click(clickHandler);
     // #2
    $row.hover(onHover, offHover);
     // #3
    return $row;
};

var setSong = function (songNumber) {
  if (currentSoundFile) {
      currentSoundFile.stop();
  }
 
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  //#1
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    // #2
    formats: [ 'mp3' ],
    preload: true
  });
  
  setVolume(currentVolume);
};
 
 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 };
  
var setVolume = function (volume) {
    if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
    }
  };

// create a function that is called when window loads and takes one of our album objects as an arguement and will utilize the object's stored info by injecting it into the template

var setCurrentAlbum = function (album) {
	// #1 select all of the HTML elements required to display on the album page: title, artist, release info, image, and song list. 
  currentAlbum = album;   
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  // #2 the firstChild property identifies the first child node of an element, and nodeValue returns or sets the value of a node.
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
	
  // #3 empty the string to ensure we've got a clean slate and there are no interfering elements
  $albumSongList.empty();
	
  // #4 for loop to go through all the songs from the specified album object and insert them ito the HTML using innerHTML property. createSongRow is called at each loop, passing song number, name, and length argument from our album object
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 }; 

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1 use built in javascript function to make sure our percentage isn't less than zero and doesn't exceed 100
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2 we convert our percentage to a string and add the % character
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
   //#6 using jquery to find all the elements in the DOM with a class of seek-bar that are conteained within the element player-bar.  
   var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
        // #3 pagex is a jquery-specific event value that holds the horizontal coordinate where the event occurred
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4 divid offsetx by the width of the entire bar to calculate seekbarfillratio
        var seekBarFillRatio = offsetX / barWidth;
 
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        } 
       
       // #5
         updateSeekPercentage($(this), seekBarFillRatio);
     });
   // #7 
    $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();
 
         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
           if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
           
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };

//write a function that updates the text of the <h2> tags that contain the song name and artist name
var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

//this is a helper method that returns the index of a song found in album's song array
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


var nextSong = function() { 
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);   
};

var togglePlayFromPlayerbar = function() {
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        $currentlyPlayingCell.html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();
    } else if (currentSoundFile) {
        $currentlyPlayingCell.html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

//elements adding listeners to 
var songPlayButton = document.getElementsByClassName('song-item-title');

// variables storing buttons
var playButtonTemplate = '<a class="album-song-buttom"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//create a variable to store currently playing song set to null so that no song is identified as playing until we click one. 
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
 
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerbar);
  });