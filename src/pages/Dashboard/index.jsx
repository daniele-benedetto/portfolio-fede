import { useEffect, useRef, useState } from "react"
import "../../App.css"
import { useLocation, useNavigate } from "react-router-dom"
import token from "../../services/auth/token"
import Sidebar from "../../components/sidebar/Sidebar"
import settings from "../../services/settings/all"
import editImageBackground from "../../services/settings/editImageBackground"
import editImageProfilo from "../../services/settings/editImageProfilo"
import editBackgroundColor from "../../services/settings/editBackgroundColor"
import editTextColor from "../../services/settings/editTextColor"
import { uri } from "../../utils/const"
import { hexToRgba } from "../../utils/colors"

const Dashboard = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const fileInputRef = useRef(null)
  const profileImageRef = useRef(null)

  const path = pathname

  const [desktopBackground, setDesktopBackground] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [textColor, setTextColor] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("")

  const [textColorTimeout, setTextColorTimeout] = useState(null)
  const [backgroundColorTimeout, setBackgroundColorTimeout] = useState(null)

  const onChangeBackground = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onloadend = async () => {
      const usernameStorage = localStorage.getItem("uname")
      const tokenStorage = localStorage.getItem("token")

      await editImageBackground(usernameStorage, tokenStorage, reader.result)
        .then((res) => {
          if (res.result === "ok") {
            setDesktopBackground(reader.result)
            return res
          } else {
            throw new Error("Error")
          }
        })
        .catch((error) => {
          console.error(error)
          return { error: "Error" }
        })
    }
  }

  const onChangeProfileImage = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onloadend = async () => {
      const usernameStorage = localStorage.getItem("uname")
      const tokenStorage = localStorage.getItem("token")

      await editImageProfilo(usernameStorage, tokenStorage, reader.result)
        .then((res) => {
          if (res.result === "ok") {
            setProfileImage(reader.result)
            return res
          } else {
            throw new Error("Error")
          }
        })
    }
  }

  const handleTextColorChange = (value) => {
    setTextColor(value)

    if (textColorTimeout) {
      clearTimeout(textColorTimeout)
    }

    const timeoutId = setTimeout(async () => {
      const usernameStorage = localStorage.getItem("uname")
      const tokenStorage = localStorage.getItem("token")

      try {
        const res = await editTextColor(usernameStorage, tokenStorage, value)
        if (res.result === "ok") {
          setTextColor(value)
        } else {
          throw new Error("Error")
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000)

    setTextColorTimeout(timeoutId)
  }

  const handleBackgroundColorChange = (value) => {
    setBackgroundColor(value)

    if (backgroundColorTimeout) {
      clearTimeout(backgroundColorTimeout)
    }

    const timeoutId = setTimeout(async () => {
      const usernameStorage = localStorage.getItem("uname")
      const tokenStorage = localStorage.getItem("token")

      try {
        const res = await editBackgroundColor(usernameStorage, tokenStorage, value)
        if (res.result === "ok") {
          setBackgroundColor(value)
        } else {
          throw new Error("Error")
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000)

    setBackgroundColorTimeout(timeoutId)
  }

  useEffect(() => {
    const fetchData = async () => {
      const usernameStorage = localStorage.getItem("uname")
      const tokenStorage = localStorage.getItem("token")

      try {
        if (tokenStorage && usernameStorage) {
          const res = await token(usernameStorage, tokenStorage)
          if (res.result === "ok") {
            const settingsRes = await settings()
            if (settingsRes.result === "ok") {
              const desktopBackground = settingsRes.settings.find((setting) => setting.name === "desktop_background")
              const profileImage = settingsRes.settings.find((setting) => setting.name === "profile_image")
              const textColor = settingsRes.settings.find((setting) => setting.name === "text_color")
              const backgroundColor = settingsRes.settings.find((setting) => setting.name === "background_color")
              setDesktopBackground(`${uri}/images/${desktopBackground.value}`)
              setProfileImage(`${uri}/images/${profileImage.value}`)
              setTextColor(textColor.value)
              setBackgroundColor(backgroundColor.value)
            }
          }
        } else {
          throw new Error("Token or username not found")
        }
      } catch (error) {
        console.error(error)
        navigate("/login")
      }
    }

    fetchData()
  }, [navigate])

  const onButtonClick = () => {
    fileInputRef.current.click()
  }

  const onProfileImageClick = () => {
    profileImageRef.current.click()
  }

  return (
    <div className="wrapper" style={{ backgroundImage: `url(${desktopBackground})` }}>
      <div className="dashboard">
        <div className="dashboard_sidebar">
          <Sidebar path={path} background={hexToRgba(backgroundColor, 0.66)} color={textColor} profileImage={profileImage} />
        </div>
        <div className="dashboard_content">
          <div className="dashboard_content_row">
            <div className="dashboard_content_list" style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
              <div className="dashboard_content_list_title">
                <h3>Desktop Background</h3>
                <small>Immagine di sfondo del desktop</small>
              </div>
              <div className="column">
                <div className="dashboard_content_list_image">
                  <img
                    src={desktopBackground}
                    alt="desktop background"
                    onError={() => setDesktopBackground("")}
                  />
                </div>
                <div className="dashboard_content_list_input">
                  <input type="file" onChange={onChangeBackground} ref={fileInputRef} style={{ display: "none" }} />
                  <button className="custom_button" onClick={onButtonClick} style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>Scegli file</button>
                </div>
              </div>
            </div>
            <div className="dashboard_content_list" style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
              <div className="dashboard_content_list_title">
                <h3>Immagine profilo</h3>
                <small>Immagine profilo del desktop</small>
              </div>
              <div className="column">
                <div className="dashboard_content_list_image_profile">
                  <img
                    src={profileImage}
                    alt="desktop background"
                    onError={() => setProfileImage("")}
                  />
                </div>
                <div className="dashboard_content_list_input">
                  <input type="file" onChange={onChangeProfileImage} ref={profileImageRef} style={{ display: "none" }} />
                  <button className="custom_button" onClick={onProfileImageClick} style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>Scegli file</button>
                </div>
              </div>
            </div>
            <div className="dashboard_content_list" style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
              <div className="dashboard_content_list_title">
                <h3>Gestione colori</h3>
                <small>Gestione colori del desktop</small>
              </div>
              <div className="column">
                <div className="dashboard_content_list_color">
                  <div className="dashboard_content_list_color_text">
                    <h4>Colore testo</h4>
                    <small>Colore del testo del desktop</small>
                  </div>
                  <div className="dashboard_content_list_color_input">
                    <input type="color" value={textColor} onChange={(e) => handleTextColorChange(e.target.value)} />
                  </div>
                </div>
                <div className="dashboard_content_list_color">
                  <div className="dashboard_content_list_color_text">
                    <h4>Colore sfondo</h4>
                    <small>Colore dello sfondo del desktop</small>
                  </div>
                  <div className="dashboard_content_list_color_input">
                    <input type="color" value={backgroundColor} onChange={(e) => handleBackgroundColorChange(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
