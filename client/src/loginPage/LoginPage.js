import { useState } from "react";
import { useNavigate } from "react-router";
import InputText from "../inputText/InputText";

function LoginPage({ setToken, setUserId }) {
  const navigate = useNavigate();
  const [userId, setUserIdTry] = useState('');
  const [password, setPassword] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const neededInfo = [
    {
      title: "userId:",
      placeholder: 'Enter your userId here',
      setValue: setUserIdTry,
      error: userIdError
    },

    {
      title: "Password:",
      placeholder: 'Enter your password here',
      setValue: setPassword,
      error: passwordError
    }
  ]
  const infoInputList = neededInfo.map((data, key) => {
    return <InputText {...data} key={key} />;
  })

  const navigateTo = async (token) => {
    const res = await fetch('http://localhost:5000/api/student/', {
      method: 'get',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    if (res.status === 200) {
      res.text().then((user) => {
        if (JSON.parse(user).permissions) {
          navigate('/adminFeed');
        } else {
          navigate('/studentFeed');
        }
      });
    }
  }

  const handleSubmit = async (e) => {
    setUserIdError('');
    setPasswordError('');
    setError('');
    e.preventDefault();
    if (userId.trim() === '') {
      setUserIdError('userId is required!');
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
        "userId": userId,
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
      setUserId(userId)
      navigateTo(token);
    });
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
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </>
  );
}

export default LoginPage;