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
	handleArtistClick : function(artist_data) {
		this.props.handleListItemClick({artist_data : artist_data});
	},
	render : function() {
		return (
			<tr>
				<td className="artistName">{this.props.name}</td>
				<td className="artistFollowers">{this.props.followers.total}</td>
				<td className="artistViewAlbums">
					<button 
						className="btn btn-primary btn-xs" 
						onClick={this.handleArtistClick.bind(this, this.props.artistData, this.props.artistKey)}>View Albums
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
				<ListItem name={artist.name} key={artist.id} artistData={artist} artistKey={artist.id} followers={artist.followers} handleListItemClick={parent.handleListItemClick}/>
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
	setArtistData : function() {
		if( $.isEmptyObject(this.state.info) )
			return;
		$.ajax({
			url : 'https://api.spotify.com/v1/artists/' + this.state.info.id + '/albums?market=CA',
			cache : false,
			success : function(response) {
				this.setState({ albums : response.items });
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState : function() {
		return { info : {}, albums : [] };
	},
	componentWillReceiveProps : function(nextProps) {
		this.setState({ info : nextProps.artist_data });
		this.setArtistData();
	},
	artistHeader : function() {
		if( $.isEmptyObject(this.state.info) )
			return;
		return (
			<div className="artistInfoOuter">
				<div className="row infoHeader">
					<div className="col-md-7">
						<h3>{this.state.info.name}</h3>
					</div>
					<div className="col-md-5 text-right">
						<img src={this.state.info.images[1].url} />
					</div>
				</div>
				<div className="row">
					<h5>Albums</h5>
					<AlbumsList albums={this.state.albums} />
				</div>
			</div>	
		);
	},
	render : function() {
		// this.setArtistData();
		var artistHeader = this.artistHeader();
		return (	
			<div className="artist-header">
				{artistHeader}
			</div>
		)
	}
});

var AlbumsList = React.createClass({
	render : function() {
		var albumsNodes = this.props.albums.map(function(album, i){
			return (
				<li className="album">
					<div className="row">
						<div className="col-md-9">
							<h5><a href={album.external_urls.spotify} target="_blank"> {album.name}</a> - ({album.album_type})</h5>
						</div>
						<div className="col-md-3 text-right">
							<img src={album.images[1].url} />
						</div>
					</div>
				</li>
			);
		});
		return (
			<ul class="albumsList">{albumsNodes}</ul>
		);
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
		return { items : [], artist_data : false };
	},
	componentDidMount : function() {
		this.loadResultsFromApi('dear');
	},
	doQuerySubmit : function( formData ) {
		this.loadResultsFromApi(formData.query);
	},
	handleArtistData : function(parent_data) {
		this.setState({ artist_data : parent_data.artist_data });
	},
	render : function() {
		return (
			<div className="searchApp">
				<h3>Conducto your artist searcho</h3>
				<div className="row">
					<div className="col-md-6 text-center">
						<SearchForm  onQuerySubmit={this.doQuerySubmit} />
						<SearchResultsHeader total={this.state.total} jsonLink={this.state.href} searchQuery={this.state.searchQuery}/>
						<TableList items={this.state.items} doArtistWindow={this.handleArtistData}/>
					</div>
					<div className="col-md-6">
						<ArtistBox artist_data={this.state.artist_data}/>
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