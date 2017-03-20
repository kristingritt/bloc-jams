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
		{ title: 'Pink', duration: '3:21' },
		{ title: 'Magenta', duration: '2:15' }
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

// Adding a third album for assignment 11
var albumKodiak = {
	title: 'The Bear Hunter',
	artist: 'Tyler Haines',
	label: 'Star',
	year: '1983',
	albumArtUrl: 'assets/images/album_covers/13.png',
	songs: [
		{ title: 'High Seas', duration: '1:52' },
		{ title: 'Climbing Mountains', duration: '3:01' },
		{ title: 'Harbor Master', duration: '2:51' },
		{ title: 'The Wind Always Blows', duration: '2:15' },
		{ title: 'Bear It All', duration: '4:15' }
	]
};

// create a function named createSongRow that generates the song row content - we declare the objects before the function because the createSongRow function uses the info stored in the album objects

var createSongRow = function(songNumber, songName, songLength) { // assigns our previously static song row template to a variable named template and returns it
	var template = 
		'<tr class="album-view-song-item">'
	  +	'	<td class="song-item-number">' + songNumber + '</td>'
	  +	'	<td class="song-item-title">' + songName + '</td>'
	  +	'	<td class="song-item-duration">' + songLength + '</td>'
	  + '</tr>'
	  ;
	
	return template;
};

// create a function that is called when window loads and takes one of our album objects as an arguement and will utilize the object's stored info by injecting it into the template

// set elements to populate text
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
	// #2 the firstChild property identifies the first child node of an element, and nodeValue returns or sets the value of a node.
	albumTitle.firstChild.nodeValue = album.name;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);
	
	// #3 empty the string to ensure we've got a clean slate and there are no interfering elements
	albumSongList.innerHTML = '';
	
	// #4 for loop to go through all the songs from the specified album object and insert them ito the HTML using innerHTML property. createSongRow is called at each loop, passing song number, name, and length argument from our album object
	for (var i = 0; i < album.songs.length; i++) {
		albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
	}
};

window.onload = function() {
	setCurrentAlbum(albumPicasso);
// add event listener to album cover, when user clicks, toggles betweent album objects
	var albums = [albumPicasso, albumMarconi, albumKodiak];
	var index = 1;
	albumImage.addEventListener("click", function(event) {
		setCurrentAlbum(albums[index]);
		index++;
		if (index === albums.length) {
			index = 0;
		}
	});
};
