import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import InfoInput from "../infoInput/InfoInput";

function LoginPage({ setToken }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const neededInfo = [
    {
      title: "userName",
      placeholder: 'Enter your username here',
      value: username,
      setValue: setUsername,
      error: usernameError
    },

    {
      title: "Password",
      placeholder: 'Enter your password here',
      value: password,
      setValue: setPassword,
      error: passwordError
    }
  ]
  const infoInputList = neededInfo.map((data, key) => {
    return <InfoInput {...data} key={key} />;
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
    const res = await fetch('http://localhost:5000/api/Tokens', {
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
    });
    navigate('/studentsFeed');
  }
  return (
    <>
      <div className="rounded-pill halation"></div>
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
            <div className="col-5 text-white">
              Not registered? <Link to="/" className="card-link">Click here</Link> to register
            </div>
          </div>
        </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossOrigin="anonymous"></script>
    </>
  );
}

export default LoginPage;