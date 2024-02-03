const AUTH0_CLIENT_ID = "Xss5UbXe1d7DBPlUvv855XZwUg1sP6Ki";
const AUTH0_DOMAIN = "dev-sn5f570cadx2zciy.us.auth0.com";
const AUTH0_CALLBACK_URL = "http://localhost:8080";
const AUTH0_API_AUDIENCE = "https://connectors.smartgrowth.consulting";

class App extends React.Component {
	parseHash() {
		this.auth0 = new auth0.WebAuth({
		  domain: AUTH0_DOMAIN,
		  clientID: AUTH0_CLIENT_ID
		});
		this.auth0.parseHash(window.location.hash, (err, authResult) => {
		  if (err) {
			return console.log(err);
		  }
		  if (
			authResult !== null &&
			authResult.accessToken !== null &&
			authResult.idToken !== null
		  ) {
			localStorage.setItem("access_token", authResult.accessToken);
			localStorage.setItem("id_token", authResult.idToken);
			localStorage.setItem(
			  "profile",
			  JSON.stringify(authResult.idTokenPayload)
			);
			window.location = window.location.href.substr(
			  0,
			  window.location.href.indexOf("#")
			);
		  }
		});
	}

	setup() {
	$.ajaxSetup({
	  beforeSend: (r) => {
		if (localStorage.getItem("access_token")) {
		  r.setRequestHeader(
			"Authorization",
			"Bearer " + localStorage.getItem("access_token")
		  );
		}
	  }
	});
	}
	updateLoggedInState() {
		let idToken = localStorage.getItem("id_token");
		if (idToken) {
		  this.loggedIn = true;
		} else {
		  this.loggedIn = false;
		}
	}

	componentWillMount() {
		this.setup();
		this.parseHash();
		this.updateLoggedInState();
	}
	render() {
		if (this.loggedIn) {
			return (<LoggedIn />);
		} else {
			return (<Home />);
		}
	}
}

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.authenticate = this.authenticate.bind(this);
	}
	authenticate() {
		console.log("Authentication initiated...")
		this.WebAuth = new auth0.WebAuth({
		  domain: AUTH0_DOMAIN,
		  clientID: AUTH0_CLIENT_ID,
		  scope: "openid profile",
		  audience: AUTH0_API_AUDIENCE,
		  responseType: "token id_token",
		  redirectUri: AUTH0_CALLBACK_URL
		});
    	this.WebAuth.authorize();
    }
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
		};

		this.serverRequest = this.serverRequest.bind(this);
    	this.logout = this.logout.bind(this);
	}
	logout() {
		localStorage.removeItem("id_token");
		localStorage.removeItem("access_token");
		localStorage.removeItem("profile");
		location.reload();
	}

	serverRequest() {
		$.get("http://localhost:8080/api/connectors", res => {
			this.setState({
				connectors: res
		  	});
		});
	}

	componentDidMount() {
		this.serverRequest();
	}

	render() {
		return (
			<div className="container">
			Hi there
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
					</div>
					<div className="panel-body">
						{this.props.connector.display_name}
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
