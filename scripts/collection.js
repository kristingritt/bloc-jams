var buildCollectionItemTemplate = function() { // <--- variable to hold the template to create each album. When script runs it caches content.
	var template = 
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
  
  // wrap template in a jQuery objects to future-proof it 
    return $(template);
};

$(window).load(function() {
	var $collectionContainer = $('.album-covers');
	$collectionContainer.empty();

	// #3 for loop insters 12 albums using the += operator. Each loop adds the contents of collectionTemplate to the innerHTML of collectionContainer
	for (var i = 0; i < 12; i++) {
		var $newThumbnail = buildCollectionItemTemplate();	
        // #5
        $collectionContainer.append($newThumbnail);
	}
});