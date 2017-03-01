var collectionTemplate = // <--- variable to hold the template to create each album. When script runs it caches content.
	'<div class="collection-album-container column fourth">' // add quotation marks to make the template a string
	+ '	<img src="assets/images/album_covers/01.png"/>' // + used to keep strong together
	+ '	<div class="collection-album-info caption">'
	+ '		<p>'
	+ '			<a class="album-nam" href="album.html"> The Colors </a>'
	+ '			<br/>'
	+ '			<a href="album.html"> Pablo Picasso </a>'
	+ '			<br/>'
	+ '			X songs'
	+ '			<br/>'
	+ '		</p>'
	+ '	</div>'
	+ '</div>'
	;
// now that template is created, we can use the variable to add as many albums that we want
window.onload = function() {
	// #1 select the first - and only - element with an album-covers name. assigned to variable collectionContainer
	var collectionContainer = document.getElementsByClassName('album-covers')[0];
	// #2 assign an empty string to collectionContainer's innerHTML property to clear its content. Ensures we're working with a clean slate before we insert content with JavaScript
	collectionContainer.innerHTML = '';

	// #3 for loop insters 12 albums using the += operator. Each loop adds the contents of collectionTemplate to the innerHTML of collectionContainer
	for (var i = 0; i < 12; i++) {
		collectionContainer.innerHTML += collectionTemplate;	
	}
}