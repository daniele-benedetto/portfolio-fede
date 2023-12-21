import { useState, useEffect } from "react";
import "../../App.css"
import login from "../../services/auth/login"
import { useNavigate } from "react-router-dom"
import token from "../../services/auth/token"
import settings from "../../services/settings/all"
import { uri } from "../../utils/const";
import { hexToRgba } from "../../utils/colors";

const Login = () => {

  const navigate = useNavigate()
  const user = "daniele.benedetto"

  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [desktopBackground, setDesktopBackground] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [textColor, setTextColor] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    const response = await login(user, password)

    if(response.token && response.username) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("uname", response.username)
      navigate("/dashboard")
    } else {
      setError(true)

      setTimeout(() => {
        setError(false)
      }, 2000)
    }
  }

  useEffect(() => {
    const checkSettings = async () => {
      const res = await settings()
      if(res.result === "ok") {
        const desktopBackground = res.settings.find((setting) => setting.name === "desktop_background")
        const profileImage = res.settings.find((setting) => setting.name === "profile_image")
        const textColor = res.settings.find((setting) => setting.name === "text_color")
        const backgroundColor = res.settings.find((setting) => setting.name === "background_color")
        setDesktopBackground(`${uri}/images/${desktopBackground.value}`)
        setProfileImage(`${uri}/images/${profileImage.value}`)
        setTextColor(textColor.value)
        setBackgroundColor(backgroundColor.value)
      }
    }

    checkSettings()

    const checkToken = async () => {
      const tokenStore = localStorage.getItem("token")
      const unameStore = localStorage.getItem("uname")
      const res = await token(tokenStore, unameStore)
      if(res.token && res.username) {
        navigate("/dashboard")
      }
    }

    checkToken()
  }, [navigate])

  return (
    <div className="wrapper" style={{ backgroundImage: `url(${desktopBackground})` }}>
      <div className="login">
          <form className="login_form">
            <span className="login_form_image">
              <img alt="login image" src={profileImage} />
            </span>
            <div className="login_form_username" style={{ color: textColor }}>
              <b>{user}</b>
            </div>
            <input 
              style={{ color: textColor, backgroundColor: hexToRgba(backgroundColor, 0.66) }}
              className={error ? "login_form_input_error" : "login_form_input"}
              type="password" 
              placeholder="Enter Password" 
              value={password} 
              onChange={(event) => setPassword(event.target.value)} 
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit(event)
                }
              }}
            />
            <p className="login_form_message" style={{ color: textColor }}>
              <b>Inserisci la tua password</b>
            </p>
          </form>
      </div>
    </div>
  );
};

export default Login