class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			isAuthenticated: false
		};
	}

	componentDidMount() {
		if (this.isAuthenticated()){
			this.setState({ isAuthenticated: true });
		}
	}

	isAuthenticated() {
        // Check if the authentication cookie exists
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
		console.log(cookies)
        const authCookie = cookies.find(cookie => cookie.startsWith('auth-session='));
		console.log(authCookie)
		return !(authCookie === undefined)
    }

	render(){
		return (
			<div>
				{ this.state.isAuthenticated ? <LoggedIn /> : <Home /> }
			</div>
		);
	}
}

class Home extends React.Component {
	render(){
		return (
			<div>
				<h1>Smartgrowth Connectors</h1>
				<a href="/login">Log in or Signup</a>
			</div>
		);
	}
}

class LoggedIn extends React.Component {
	render(){
		return(
			<div>
				<h1>You are logged in!</h1>
				<a href="/logout">Log out</a>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
