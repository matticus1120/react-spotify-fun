/**
 * https://developer.spotify.com/web-api/search-item/
 * http://jsfiddle.net/UT7bQ/10/
 * https://labs.spotify.com/2015/03/09/understanding-spotify-web-api/
 * http://andrewhfarmer.com/react-ajax-best-practices/
 * https://github.com/facebook/react/blob/master/docs/docs/tutorial.md
 * https://facebook.github.io/react/docs/tutorial.html
 */

var SearchResultsHeader = React.createClass({
	render : function() {
		return (
			<div className="resultsHeader">
				<p>Searching for <b><em>{this.props.searchQuery}</em></b> | Total Found: <b><em>"{this.props.total}"</em></b></p>
				{<p><a href="{this.props.jsonLink}" target="_blank">View JSON Data</a></p>}
			</div>
		);
	}
});

var SearchForm = React.createClass({
	getInitialState : function() {
		return { query : 'Dear'};
	},
	handleQueryChange : function(e) {
		this.setState({ query : e.target.value });
		this.handleSubmit(e);
	},
	handleSubmit : function(e) {
		e.preventDefault();
		var query = this.state.query.trim();

		if( !query || query.length < 2 ) {
			return;
		}

		this.props.onQuerySubmit({ query : query });

	},
	render : function() {
		return (
			<form id="search-form" onSubmit={this.handleSubmit}>
				<input 
					type="text" 
					id="query" 
					value={this.state.query}
					className="form-control"
					onChange = {this.handleQueryChange}
				/>
				<input type="submit" id="search" className="btn btn-success btn-sm btn-block" value="Search" />
			</form>
		);
	}
});

var ListItem = React.createClass({
	handleArtistClick : function(artist_id) {
		this.props.handleListItemClick({artist_id : artist_id});
	},
	render : function() {
		return (
			<tr>
				<td className="artistName">{this.props.name}</td>
				<td className="artistFollowers">{this.props.followers.total}</td>
				<td className="artistViewAlbums">
					<button 
						className="btn btn-primary btn-xs" 
						onClick={this.handleArtistClick.bind(this, this.props.artistId, this.props.artistId)}>View Albums
					</button>
				</td>
			</tr>
		);
	}
});



var TableList = React.createClass({
	handleListItemClick : function(data) {
		this.props.doArtistWindow(data);
	},
	render : function() {
		var parent = this;
		var ListNodes = this.props.items.map(function(artist, i){
			return (
				<ListItem name={artist.name} key={artist.id} artistId={artist.id} followers={artist.followers} handleListItemClick={parent.handleListItemClick}/>
			);
		});
		return (
			<table className="table table-hover table-condensed table-striped">
				<thead>
					<tr>
						<th>Artist</th>
						<th># of Followers</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody id="results-body">{ListNodes}</tbody>
			</table>
		);
	}
});

var ArtistBox = React.createClass({
	getArtistData : function() {
		console.log(this.props.artistId);
		if( !this.props.artistId )
			return;
		$.ajax({
			url : 'https://api.spotify.com/v1/artists/' + this.props.artistId,
			cache : false,
			success : function(response) {
				console.log('hi');
				console.log(response);
				// this.setState({items : data.artists.items, total : data.artists.total, searchQuery : query, jsonLink : data.artists.href });
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	render : function() {

		var info = this.getArtistData();
		return (
			<div className="artist-header">
				<h3>{this.props.artistId}</h3>
			</div>
		)
	}
});

var SearchBox = React.createClass({

	loadResultsFromApi : function(query) {
		var myQuery = query;
		$.ajax({
			url : 'https://api.spotify.com/v1/search',
			dataType : 'json',
			cache : false,
			 data: {
				q: query,
				type: 'artist'
			},
			success : function(data) {
				this.setState({items : data.artists.items, total : data.artists.total, searchQuery : query, jsonLink : data.artists.href });
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState : function() {
		return { items : [], artistId : false };
	},
	componentDidMount : function() {
		this.loadResultsFromApi('dear');
	},
	doQuerySubmit : function( formData ) {
		this.loadResultsFromApi(formData.query);
	},
	handleArtistData : function(parent_data) {
		this.setState({ artistId : parent_data.artist_id });
	},
	render : function() {
		return (
			<div className="searchApp">
				<h3>Conducto your artist searcho</h3>
				<div className="row">
					<div className="col-md-7 text-center">
						<SearchForm  onQuerySubmit={this.doQuerySubmit} />
						<SearchResultsHeader total={this.state.total} jsonLink={this.state.href} searchQuery={this.state.searchQuery}/>
						<TableList items={this.state.items} doArtistWindow={this.handleArtistData}/>
					</div>
					<div className="col-md-5">
						<h4>Arist Info</h4>
						<ArtistBox artistId={this.state.artistId}/>
					</div>
				</div>
			</div>
		);
	}
});

ReactDOM.render(
	<SearchBox />,
	document.getElementById('search-app')
);