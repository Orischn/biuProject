import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import InputText from "../inputText/InputText";


function RegisterPage() {

    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [year, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [userIdError, setUserIdError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [verifyPasswordError, setVerifyPasswordError] = useState('');
    const [yearError, setYearError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');
    const neededInfo = [
        {
            title: "userId",
            iconTitle: "personIcon",
            iconName: "bi bi-person",
            placeholder: 'Personal ID Number',
            setValue: setUserId,
            error: userIdError,
            type: 'text'
        },

        {
            title: "firstName",
            iconTitle: "oneHandIcon",
            iconName: "bi bi-person-raised-hand",
            placeholder: "First Name",
            setValue: setFirstName,
            error: firstNameError,
            type: 'text'
        },

        {
            title: "lastName",
            iconTitle: "twoHandsIcon",
            iconName: "bi bi-person-arms-up",
            placeholder: "Last Name",
            setValue: setLastName,
            error: lastNameError,
            type: 'text'
        },

        {
            title: "Password",
            iconTitle: "shieldIcon",
            iconName: "bi bi-shield-lock",
            placeholder: "Password",
            setValue: setPassword,
            error: passwordError,
            type: 'text'
        },

        {
            title: "Verify Password",
            iconTitle: "shieldCheckIcon",
            iconName: "bi bi-shield-check",
            placeholder: "Verify Password",
            setValue: setVerifyPassword,
            error: verifyPasswordError,
            type: 'text'
        },

        {
            title: "Year",
            iconTitle: "calendarIcon",
            iconName: "bi bi-calendar",
            placeholder: "Year Of Study",
            setValue: setYear,
            error: yearError,
            type: 'text'
        },

        {
            title: "Email",
            iconTitle: "envelopeIcon",
            iconName: "bi bi-envelope-at",
            placeholder: "Email Address",
            setValue: setEmail,
            error: emailError,
            type: 'text'
        }
    ];
    const infoInputList = neededInfo.map((data, key) => {
        return <InputText {...data} key={key} />;
    })

    const handleSubmit = async (e) => {
        setUserIdError('');
        setFirstNameError('');
        setLastNameError('');
        setPasswordError('');
        setVerifyPasswordError('');
        setYearError('');
        setEmailError('');
        setError('');

        e.preventDefault();

        if (userId.trim() === '') {
            setUserIdError('ID number is required')
            return;
        }

        if (firstName.trim() === '') {
            setFirstNameError('First name is required!');
            return;
        }

        if (lastName.trim() === '') {
            setLastNameError('Last name is required!');
            return;
        }


        if (password.trim() === '') {
            setPasswordError('Password is required!');
            return;
        }

        if (verifyPassword.trim() === '') {
            setVerifyPasswordError('Verify password is required!');
            return;
        }

        if (year.trim() === '') {
            setYearError('Year of study is required!');
            return;
        }

        if (email.trim() === '') {
            setEmailError('Email is required!');
            return;
        }

        const userIdRegex = new RegExp('^[0-9]+$')
        if (!userIdRegex.test(userId)) {
            setUserIdError('User ID number must contain only digits');
            return;
        }

        const nameRegex = new RegExp('^[a-zA-Z]+$')
        if (!nameRegex.test(firstName)) {
            setFirstNameError('First name must contain only letters');
            return;
        }

        if (!nameRegex.test(lastName)) {
            setLastNameError('Last name must contain only letters');
            return;
        }

        if (verifyPassword !== password) {
            setVerifyPassword('');
            setVerifyPasswordError('Passwords do not match!');
            return;
        }

        const yearRegex = new RegExp('^[0-9]+$')
        if (!yearRegex.test(year)) {
            setYearError('Year must be a valid number');
            return;
        }

        const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
            return;
        }

        const res = await api.post('/api/Users', {
            "user": {
                "password": password,
                "permissions": false,
                "firstName": firstName,
                "lastName": lastName,
                "userId": userId,
                "year": year,
                "email": email,
                "isSelfRegistered": true
            }
        })
        if (res.status !== 201) {
            setError(res.data);
            return;
        } else if (res.status === 403) {
            navigate('/');
            return
        }
        navigate('/loginPage')
    };

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="134" height="50" viewBox="0 0 134 50" style={{ width: "160px", height: "59px", marginBottom: "20px" }}>
                        <g fill="none" fillRule="evenodd">
                            <path fill="#004128" d="M16.794 10.826c-.673 0-1.395.174-1.976.445l.267 1.636c.44-.128.8-.193 1.113-.193.928 0 1.414.557 1.414 1.558 0 2.271-1.506 3.842-3.815 3.97l-.455-7.4-1.946.223.535 9.115c.203.015.39.03.689.03 4.239 0 6.984-2.429 6.984-6.208 0-1.985-1.051-3.176-2.81-3.176M21.049 11.031L21.049 12.857 22.303 12.857 22.303 16.384 24.314 16.384 24.314 11.031zM31.031 18.4c-1.242 0-1.946-1.095-1.946-2.89 0-1.126.283-2.05.674-2.684h1.084c1.648 0 2.227.604 2.227 2.383 0 2.031-.754 3.191-2.039 3.191m.077-7.369h-4.722v1.795h1.396c-.517.92-.769 1.826-.769 2.955 0 2.716 1.476 4.445 3.877 4.445 2.604 0 4.252-2 4.252-5.16 0-2.747-1.286-4.035-4.034-4.035M42.96 14.207c-.032-2.206-.926-3.176-3.014-3.176h-3.39v1.826h2.76c1.257 0 1.617.383 1.633 1.876.018.603.018 1.3.018 2 0 1.381-.018 2.731-.018 3.272h2.01c0-.7.016-2.51.016-4.097 0-.652 0-1.256-.016-1.7M51.214 18.18c0-.43.03-1.795.03-2.67 0-.507 0-.952-.015-1.365-.062-2.16-.94-3.114-2.982-3.114h-3.123v1.826h2.465c1.254 0 1.601.383 1.648 1.876.015.65.015 1.524.015 2.541v.905h-4.347l-.187 1.826h7.47l.344-1.826h-1.318zM53.036 11.031L53.036 12.857 54.291 12.857 54.291 16.384 56.298 16.384 56.298 11.031zM62.563 18.21l-.252-7.179h-3.815v1.826h1.87l.202 5.322h-2.683l-.203 1.826h4.724c.062-.51.173-1.207.157-1.794M64.445 11.031L64.445 12.857 65.828 12.857 65.828 20.005 67.836 20.005 67.836 11.031zM78.476 12.748c0-.525-.203-.874-.689-1.176-.378-.255-.91-.491-1.697-.778l-.83 1.51c.375.252.673.428.94.587.22.159.299.268.299.476 0 .364-.252 1.207-.815 2.685l-4.27-5.354-1.475 1.223 1.066 1.334c-.485 1.891-.845 4.352-.863 5.4l-.016 1.35h1.9l.157-5.272 4.583 5.748 1.46-1.253-1.57-1.97c1.147-1.906 1.82-3.558 1.82-4.51M3.727 12.857c-.092.799-.172 2.172-.172 2.718 0 .856.047 1.793.093 2.493-.015.54-.11 1.269-.172 1.906-.769.031-1.355.047-1.936.047-.612 0-1.067-.016-1.54-.016l.206-1.794c.282.015.55.015.83.015.347 0 .581 0 .692-.015-.031-.383-.047-.794-.062-1.335 0-.98.172-2.96.334-4.019H.496v-1.826h5.69c2.087 0 3.045 1.017 3.076 3.257.016.684.031 1.493.031 2.286 0 1.304-.015 2.604-.046 3.431H7.283c0-.89.033-2.127.033-3.272 0-.715-.015-1.381-.033-2-.031-1.462-.28-1.876-1.599-1.876H3.727zM28.289 26.092L28.289 27.918 29.623 27.918 29.623 37.161 31.615 37.161 31.615 26.092zM41.785 26.092L41.785 27.918 43.042 27.918 43.042 31.446 45.049 31.446 45.049 26.092zM55.582 27.81c0-.526-.206-.875-.692-1.177-.378-.255-.91-.491-1.694-.777l-.833 1.508c.378.253.676.427.941.588.221.159.298.268.298.476 0 .364-.249 1.207-.815 2.682l-4.27-5.35-1.475 1.222 1.07 1.334c-.49 1.889-.85 4.352-.865 5.4l-.015 1.35h1.897l.157-5.272 4.584 5.748 1.46-1.256-1.57-1.969c1.146-1.904 1.822-3.556 1.822-4.508M57.16 26.092L56.957 27.887 61.23 27.887 61.433 26.092zM69.724 29.268c-.031-2.205-.926-3.176-3.013-3.176h-3.39v1.826h2.763c1.254 0 1.614.383 1.63 1.876.018.603.018 1.3.018 2 0 1.381-.019 2.731-.019 3.272h2.01c0-.7.016-2.51.016-4.096 0-.653 0-1.257-.015-1.702M77.978 33.238c0-.427.034-1.792.034-2.666 0-.51 0-.952-.018-1.366-.062-2.162-.941-3.114-2.982-3.114H71.89v1.826h2.463c1.257 0 1.601.383 1.647 1.876.016.65.016 1.524.016 2.541v.903H71.67l-.188 1.828h7.47l.345-1.828h-1.319zM33.898 33.875c2.935-2.636 4.27-4.05 4.27-5.415 0-.286-.016-.413-.064-.54h-4.018c-.282-1.096-.533-3.276-.533-4.722l1.852-.222c.031 1.048.267 3.006.33 3.117h3.923c.267.524.424 1.207.424 1.97 0 2.35-1.46 4.304-4.944 7.305l-1.24-1.493z"></path>
                            <path fill="#78CDE6" d="M36.289 44.169v-3.682h1.154v3.631c0 1.058.569 1.506 1.447 1.506.903 0 1.455-.49 1.455-1.692v-3.445h1.129v3.47c0 2.023-1.363 2.624-2.584 2.624-1.28 0-2.601-.55-2.601-2.412M42.812 41.85h1.112v.49c.335-.253.895-.609 1.53-.609 1.398 0 1.49.855 1.49 1.812v2.928h-1.105V43.67c0-.703-.133-.957-.744-.957-.46 0-.886.195-1.17.364v3.394h-1.113V41.85zM48.24 46.47h1.12v-4.62h-1.12v4.62zm-.235-6.059l.778-.795.795.795-.795.804-.778-.804zM50.129 41.85L51.334 41.85 52.17 44.609 52.429 45.557 52.714 44.6 53.65 41.85 54.821 41.85 53.09 46.471 51.718 46.471zM58.225 43.72c.008-.694-.268-1.168-.828-1.168-.552 0-.937.407-.979 1.168h1.807zm-2.952.516c0-1.853.928-2.496 2.224-2.496 1.313 0 1.874.88 1.874 2.327v.406h-2.978c0 1.016.627 1.185 1.439 1.185.317 0 .794-.076 1.237-.194l.176.854c-.451.153-1.045.254-1.614.254-1.439 0-2.358-.524-2.358-2.336zM60.424 41.85h1.112v.618c.218-.313.661-.711 1.23-.711.26 0 .443.025.594.076l-.16.93c-.217-.041-.326-.05-.585-.05-.46 0-.878.271-1.079.525v3.233h-1.112V41.85zM63.803 46.378l.133-.88c.51.092.979.152 1.314.152.652 0 .911-.178.911-.466 0-.71-2.3-.431-2.3-2.065 0-.922.845-1.388 1.748-1.388.535 0 .995.085 1.422.246l-.201.838c-.401-.11-.744-.178-1.187-.178-.452 0-.678.178-.678.423 0 .736 2.284.533 2.284 2.065 0 1.134-1.146 1.447-1.908 1.447-.61 0-1.12-.068-1.538-.194M68.243 46.47h1.12v-4.62h-1.12v4.62zm-.234-6.059l.778-.795.794.795-.794.804-.778-.804zM70.92 45.091v-2.378h-.67v-.863h.67v-.948h1.112v.948h1.413v.863h-1.413v2.32c0 .456.184.583.619.583.292 0 .627-.06.911-.136l.126.898c-.31.118-.854.203-1.171.203-1.004 0-1.598-.347-1.598-1.49M75.987 46.471L75.552 46.471 74.022 41.85 75.226 41.85 76.087 44.803 76.305 45.582 76.548 44.812 77.535 41.85 78.664 41.85 76.43 48.332 75.36 48.332zM2.537 45.557c.786 0 1.23-.203 1.23-.847 0-.643-.452-.88-1.339-.88h-.786v1.727h.895zm-.193-2.548c.67 0 1.004-.237 1.004-.812 0-.618-.401-.82-1.154-.82h-.552v1.632h.702zM.496 40.488h1.899c1.405 0 2.09.567 2.09 1.59 0 .559-.326.99-.702 1.16v.017c.477.118 1.129.584 1.129 1.421 0 1.058-.61 1.795-2.267 1.795H.496v-5.983zM8.45 45.37v-.913l-.845.033c-.519.009-.853.229-.853.61 0 .406.3.567.644.567.36 0 .736-.144 1.053-.297m-2.785-.186c0-1.16 1.038-1.396 1.882-1.404l.903-.009v-.398c0-.533-.284-.677-.945-.677-.426 0-.895.093-1.287.212l-.226-.83c.451-.186 1.02-.338 1.697-.338 1.263 0 1.849.39 1.849 1.38v2.242c0 .228.2.28.443.288l-.042.854c-.084.009-.176.009-.276.009-.485 0-1.012-.118-1.112-.525-.326.263-.795.559-1.397.559-.928 0-1.489-.474-1.489-1.363M10.95 41.85h1.112v.618c.218-.313.66-.711 1.23-.711.259 0 .443.025.593.076l-.159.931c-.217-.042-.326-.05-.585-.05-.46 0-.878.27-1.079.524v3.233H10.95V41.85zM14.63 44.556L17.025 44.556 17.025 43.634 14.63 43.634zM26.17 45.37v-.913l-.845.033c-.518.009-.852.229-.852.61 0 .406.3.567.644.567.36 0 .736-.144 1.053-.297m-2.785-.186c0-1.16 1.037-1.396 1.882-1.404l.903-.009v-.398c0-.533-.284-.677-.945-.677-.426 0-.895.093-1.288.212l-.225-.83c.451-.186 1.02-.338 1.697-.338 1.263 0 1.848.39 1.848 1.38v2.242c0 .228.201.28.444.288l-.042.854c-.084.009-.176.009-.276.009-.485 0-1.012-.118-1.112-.525-.327.263-.795.559-1.397.559-.928 0-1.489-.474-1.489-1.363M28.67 41.85h1.113v.49c.334-.253.895-.608 1.53-.608 1.397 0 1.489.854 1.489 1.81v2.929h-1.104V43.67c0-.703-.134-.957-.744-.957-.46 0-.887.195-1.171.364v3.394H28.67V41.85zM21.776 46.489c-.667-.014-.993-.43-.993-1.165v-4.837h1.11v4.69c0 .236.098.348.301.348.089 0 .256-.018.416-.045l.13.888c-.344.084-.747.123-.964.12M18.371 46.471L19.508 46.471 19.508 40.487 18.371 40.487zM128.054 37.288c-3.644 7.495-11.266 12.653-20.08 12.653-11.967 0-21.74-9.514-22.334-21.474h6.73c.585 8.204 7.348 14.676 15.605 14.676 4.903 0 9.28-2.283 12.148-5.855h7.931z"></path>
                            <path fill="#004128" d="M117.531 6.847l-3.584 5.827c5.678 2.375 9.673 8.035 9.673 14.638 0 1.502-.207 2.956-.594 4.333h6.904c.268-1.403.41-2.85.41-4.333 0-9.038-5.237-16.84-12.809-20.465zM95.76 8.353c-5.812 3.841-9.75 10.346-10.12 17.802h6.73c.367-5.132 3.152-9.588 7.207-12.204L95.76 8.353z"></path>
                            <path fill="#004128" d="M111.169 28.245L132.983 28.245 132.983 35.045 106.986 35.045zM111.704 22.999L107.989 29.039 88.921 6.836 93.993 2.376zM109.639 15.302L103.934 11.709 111.089.078 116.794 3.671z"></path>
                            <path fill="#004128" d="M114.5 3.015l.97.612.608-.988c.167-.27.085-.628-.183-.797-.268-.169-.621-.085-.788.186l-.608.987zM111.713 1.26l.971.612.607-.988c.167-.27.085-.628-.183-.797-.268-.168-.62-.085-.788.186l-.607.987zM106.23 12.365l-.972-.611-.607.987c-.167.271-.085.628.183.797.268.169.62.086.788-.185l.607-.988zM109.016 14.12l-.971-.612-.608.988c-.167.271-.084.628.184.797.268.169.62.086.787-.186l.608-.987z"></path>
                        </g>
                    </svg>
                    <h2 className="login-title">REGISTER</h2>
                    <p className="description">Medical history questioning practice <br /> School of Optometry and Vision Science</p>
                    <form noValidate className="container-fluid" onSubmit={handleSubmit}>
                        {infoInputList}
                        <button type="submit" className="sign-in-btn" style={{ marginBottom: '20px' }}>Register</button>
                        {error &&
                            <span className="alert alert-danger w-50" role="alert">
                                {error}
                            </span>}
                    </form>
                    <br />
                    Already have an account? <Link to="/loginPage">Click here</Link> to login
                </div>
            </div>

            <script src="http://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>
        </>
    );
}

export default RegisterPage;