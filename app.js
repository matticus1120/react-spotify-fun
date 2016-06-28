var searchAlbums = function (query) {

    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
            // resultsPlaceholder.innerHTML = template(response);
            setResults(response.artists.items);
            console.log(response);
        }
    });
};

var setResults = function(searchResults) {
	var $table = $(".results-table tbody"), html = '';
	for( i in searchResults ) {
		var row = searchResults[i];
		var count = parseInt(i ++);
		html += '<tr><td>' + count + '</td><td>' + row.name + '</td><td>' + row.followers.total + '</td><td>';
		var genres = row.genres;
		console.log(genres);
		for( var g = 0; g < row.genres.length; g ++ ) {
			html += row.genres[g] + ', ';
		}
		html + '</td></tr>';
	}

	$table.html(html);

}

jQuery(document).ready(function($){
	
	$("#search-form").on('submit', function(e){
		e.preventDefault();
		searchAlbums( $("#query").val() );
	});

});








