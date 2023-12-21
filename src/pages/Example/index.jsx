import { useEffect, useState } from "react"
import "../../App.css"
import { useLocation, useNavigate } from "react-router-dom"
import token from "../../services/auth/token"
import Sidebar from "../../components/sidebar/Sidebar"
import settings from "../../services/settings/all"
import { uri } from "../../utils/const"
import { hexToRgba } from "../../utils/colors"

const Example = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const path = pathname

  const [desktopBackground, setDesktopBackground] = useState("")
  const [textColor, setTextColor] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("")

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
              const textColor = settingsRes.settings.find((setting) => setting.name === "text_color")
              const backgroundColor = settingsRes.settings.find((setting) => setting.name === "background_color")
              const profileImage = settingsRes.settings.find((setting) => setting.name === "profile_image")
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

  return (
    <div className="wrapper" style={{ backgroundImage: `url(${desktopBackground})` }}>
      <div className="dashboard">
        <div className="dashboard_sidebar">
          <Sidebar path={path} background={hexToRgba(backgroundColor, 0.66)} color={textColor} profileImage={profileImage} />
        </div>
        <div className="dashboard_content">
        </div>
      </div>
    </div>
  )
}

export default Example
