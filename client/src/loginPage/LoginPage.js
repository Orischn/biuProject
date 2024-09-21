import { useState } from "react";
import { useNavigate } from "react-router";
import InputBox from "../inputBox/InputBox";

function LoginPage({ setToken, setUsername }) {
  const navigate = useNavigate();
  const [username, setUsernameTry] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const neededInfo = [
    {
      title: "Username:",
      placeholder: 'Enter your username here',
      setValue: setUsernameTry,
      error: usernameError
    },

    {
      title: "Password:",
      placeholder: 'Enter your password here',
      setValue: setPassword,
      error: passwordError
    }
  ]
  const infoInputList = neededInfo.map((data, key) => {
    return <InputBox {...data} key={key} />;
  })

  const handleSubmit = async (e) => {
    setUsernameError('');
    setPasswordError('');
    setError('');
    e.preventDefault();
    if (username.trim() === '') {
      setUsernameError('Username is required!');
      return;
    }

    if (password.trim() === '') {
      setPasswordError('Password is required!');
      return;
    }
    const res = await fetch('http://localhost:5000/api/login', {
      'method': 'post',
      'headers': {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({
        "username": username,
        "password": password,
      })
    })
    if (res.status !== 200) {
      res.text().then((error) => {
        setError(error);
      });
      return;
    }
    res.text().then((token) => {
      setToken(token);
      setUsername(username)
    });
    navigate('/studentFeed');
  }
  return (
    <>
      <div className="rounded-pill"></div>
      <br /><br /><br />
      <div className="card">
        <form noValidate className="container-fluid" onSubmit={handleSubmit}>
          {infoInputList}
          <div className="row justify-content-md-center">
            <div className="col-7">
              <input type="submit" className="btn btn-primary submit" value="Login" />
              {error &&
                <span className="alert alert-danger w-50" role="alert">
                {error}
              </span>}
            </div>
          </div>
        </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossOrigin="anonymous"></script>
    </>
  );
}

export default LoginPage;