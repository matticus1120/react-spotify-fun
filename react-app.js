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
		console.log('you want to show data');
		console.log(this.props.info);
		return (
			<div className="resultsHeader"></div>
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
				<input type="submit" id="search" className="btn btn-primary" value="Search" />
			</form>
		);
	}
});

var ListItem = React.createClass({
	render : function() {
		return (
			<tr>
				<td>{this.props.artistId}</td>
				<td>{this.props.name}</td>
				<td>{this.props.followers.total}</td>
			</tr>
		);
	}
});

var TableList = React.createClass({
	render : function() {
		var ListNodes = this.props.items.map(function(artist){
			return (
				<ListItem name={artist.name} key={artist.id} artistId={artist.id} followers={artist.followers} />
			);
		});
		return (
			<table className="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Artist</th>
						<th># of Followers</th>
					</tr>
				</thead>
				<tbody id="results-body">{ListNodes}</tbody>
			</table>
		);
	}
});

var SearchBox = React.createClass({

	loadResultsFromApi : function(query) {
		$.ajax({
			url : 'https://api.spotify.com/v1/search',
			dataType : 'json',
			cache : false,
			 data: {
				q: query,
				type: 'artist'
			},
			success : function(data) {
				console.log(data);
				this.setState({items : data.artists.items, info : data });
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState : function() {
		return { items : [] };
	},
	componentDidMount : function() {
		this.loadResultsFromApi('dear');
	},
	doQuerySubmit : function( formData ) {
		this.loadResultsFromApi(formData.query);
	},
	render : function() {
		return (
			<div className="searchApp">
				<h3>Conducto your artist searcho</h3>
				<SearchForm  onQuerySubmit={this.doQuerySubmit} />
				<SearchResultsHeader info={this.state.info}/>
				<TableList items={this.state.items}/>
			</div>
		);
	}
});

ReactDOM.render(
	<SearchBox />,
	document.getElementById('search-app')
);