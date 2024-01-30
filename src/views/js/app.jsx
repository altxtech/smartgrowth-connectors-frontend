class App extends React.Component {
	render() {
		if (this.LoggedIn) {
			return (<LoggedIn />);
		} else {
			return (<Home />);
		}
	}
}

class Home extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="col-xs-8 col-xs-offset-2 jumbotron text-center">
					<h1>Smartgrowth Connectors</h1>
					<a onClick={this.authenticate} className="btn btn-primary btn-login btn-block">Sign In</a>
				</div>
			</div>
		)
	}
}

class LoggedIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			connectors: []
		}
	}

	render() {
		return (
			<div className="container">
				<div className="col-lg-12">
					<br />
					<span className="pull-right"><a onClick={this.logout}>Log out</a></span>
					<h2> Smartgrowth Connectors </h2>
					<div className="row">
						{this.state.connectors.map(
							function(connector, i) {
								return (<Connector key={i} connector={connector} />);
							}
						)}
					</div>
				</div>
			</div>
		)
	}
}

class Connector extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			connected: ""
		}
		this.connected = this.connected.bind(this);
	}

	connect() {
		// TODO: Implement
	}

	render() {
		return (
			<div className="col-xs-4">
				<div className="panel panel-default">
					<div className="panel-heading">
						#{this.props.connector.id}
						<span className="pull-right">{this.state.connected}</span>
					</div>
					<div className="panel-body">
						{this.props.connector.name}
					</div>
					<div className="panel-footer">
						<a onClick={this.connect} className="btn btn-default">Connect</a>
					</div>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
