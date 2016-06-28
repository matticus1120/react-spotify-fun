class LikeButton extends React.Component {
	constructor() {
		super();
		this.state = {
			liked : false
		};
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.setState({liked : !this.state.liked});
	}
	render() {
		const text = this.state.liked ? 'like' : 'haven\'t liked';
		return (
			<div>
				<button class="btn btn-success" onClick={this.handleClick}>You {text} this. Click to toggle.</button>
			</div>
		);
	}
}

ReactDOM.render(
  <LikeButton />,
  document.getElementById('example')
);