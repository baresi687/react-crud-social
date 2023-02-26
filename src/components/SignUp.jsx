function SignUp() {
  return (
    <>
      <h1>Sign Up</h1>
      <form>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" placeholder="Username" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password" />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm password</label>
          <input id="confirm-password" type="password" placeholder="Confirm password" />
        </div>
        <div>
          <input type="submit" placeholder="Submit" value="Submit" />
        </div>
      </form>
    </>
  );
}

export default SignUp;
