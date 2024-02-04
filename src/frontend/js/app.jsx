function App() {
  return (
    <Auth0Provider
      domain="dev-sn5f570cadx2zciy.us.auth0.com"
      clientId="Xss5UbXe1d7DBPlUvv855XZwUg1sP6Ki"
      redirectUri={window.location.origin}
    >
      <MainApp />
    </Auth0Provider>
  );
}

function MainApp() {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <h1>Welcome to My App</h1>
      {isAuthenticated ? (
        <div>
          <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
          <Profile user={user} />
        </div>
      ) : (
        <button onClick={loginWithRedirect}>Log In</button>
      )}
    </div>
  );
}

function Profile({ user }) {
  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
