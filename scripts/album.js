// Example Album
var albumPicasso = {
	title: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
      { title: 'Blue', duration: '4:26' },
      { title: 'Green', duration: '3:14' },
      { title: 'Red', duration: '5:01' },
      { title: 'Pink', duration: '3:21'},
      { title: 'Magenta', duration: '2:15'}
    ]
};
// Another Example Album
var albumMarconi = {
	title: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
		{ title: 'Hello, Operator?', duration: '1:01' },
		{ title: 'Ring, ring, ring', duration: '5:01' },
		{ title: 'Fits in your pocket', duration: '3:21' },
		{ title: 'Can you hear me now?', duration: '3:14' },
		{ title: 'Wrong phone number', duration: '2:15' }
	]
};

// create a function named createSongRow that generates the song row content - we declare the objects before the function because the createSongRow function uses the info stored in the album objects

var createSongRow = function (songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
      + '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '   <td class="song-item-title">' + songName + '</td>'
      + '   <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>';
 
    return $(template);

};

// create a function that is called when window loads and takes one of our album objects as an arguement and will utilize the object's stored info by injecting it into the template

var setCurrentAlbum = function (album) {
	// #1 select all of the HTML elements required to display on the album page: title, artist, release info, image, and song list. 
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

//write a findParentByClassName function that keeps traversing the DOM upward until a parent with a specified name is found

var findParentByClassName = function(element, targetClass) { 
  if (element) {
    //define the element we're searching for
    var currentParentElement = element.parentElement;  
    while (currentParentElement.className !== targetClass && currentParentElement.className !== null) {
      currentParentElement = currentParentElement.parentElement;
    }
    return currentParentElement;
  }
};

//switch statement that takes an element, and based on that element's class name(s), use a switch statement that returns the element with the .song-item-number class
var getSongItem = function(element) {
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
      break;
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
      break;
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
      break;
    case 'song-item-number':
      return element;
      break;
    default:
      return; 
  }
};

var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);
  //create a conditional that checks if currentlyPlayingSong is null, if true it should set the songItem's content to the pause button and set the currentlyPlayingSong to the new song's number
  if (currentlyPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
    songItem.innerHTML = playButtonTemplate;
    currentlyPlayingSong = null;
  } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
      var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
      currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
      songItem.innerHTML = pauseButtonTemplate;
      currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

//elements adding listeners to 
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var songPlayButton = document.getElementsByClassName('song-item-title');

//Add a template for play buttom
var playButtonTemplate = '<a class="album-song-buttom"><span class="ion-play"></span></a>';
//create a variable to store the template for the pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
//create a variable to store currently playing song set to null so that no song is identified as playing until we click one. 
var currentlyPlayingSong = null;

window.onload = function() {
	setCurrentAlbum(albumPicasso);
//Add ane EventListener to album cover, when user clicks, toggles between album objects
	
songListContainer.addEventListener('mouseover', function(event) {
  if (event.target.parentElement.className === 'album-view-song-item') {
    var songItem = getSongItem(event.target);
    if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
      songItem.innerHTML = playButtonTemplate;
    }
  } 
});

//need a for loop to select every table row and loop over each to add the mouseleave event listener

for (var i = 0; i < songRows.length; i++) {
	songRows[i].addEventListener('mouseleave', function(event) {
      //this cached the song item that we're leaving in a variable
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');
      //added the conditional that checks that the item the mouse is leaving is not the current song, and we only change the content if it isn't
      if (songItemNumber !== currentlyPlayingSong) {
        songItem.innerHTML = songItemNumber;
      }
	});
  songRows[i].addEventListener('click', function(event) {
    clickHandler(event.target);
  });
}
};
