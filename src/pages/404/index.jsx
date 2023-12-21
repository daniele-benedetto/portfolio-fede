import { useState, useEffect } from "react";
import "../../App.css"
import { useNavigate } from "react-router-dom"
import settings from "../../services/settings/all"
import { uri } from "../../utils/const"
import { Link } from "react-router-dom"
import { hexToRgba } from "../../utils/colors"

const NotFound = () => {

  const navigate = useNavigate()

  const [desktopBackground, setDesktopBackground] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [textColor, setTextColor] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("")

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

  }, [navigate])

  return (
    <div className="wrapper" style={{ backgroundImage: `url(${desktopBackground})` }}>
      <div className="login">
          <form className="login_form" style={{backgroundColor: hexToRgba(backgroundColor, 0,33)}}>
            <span className="login_form_image">
              <img alt="login image" src={profileImage} />
            </span>
            <div className="login_form_username" style={{ color: textColor, fontSize: 80}} >
              <b>404</b>
            </div>
            <p className="login_form_message" style={{ color: textColor,  fontSize: 32 }}>
              <b>Pagina non trovata</b>
            </p>
            <Link href="/">
              <div className="custom_button" style={{backgroundColor: backgroundColor, color: textColor, padding: "0 10px"}}>Torna in Home</div>
            </Link>
          </form>
      </div>
    </div>
  );
};

export default NotFound