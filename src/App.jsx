import { useEffect, useState } from "react"
import "./App.css"
import Folders from "./components/content/folders/Folders"
import MenuBar from "./components/menuBar/MenuBar"
import Loader from "./components/loader/Loader"
import settings from "./services/settings/all"
import { uri } from "./utils/const"
import { hexToRgba } from "./utils/colors"

const App = () => {
  const [isFolderOpen, setIsFolderOpen] = useState({})
  const [desktopBackground, setDesktopBackground] = useState("")
  const [textColor, setTextColor] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("")


  const handleToogleFolder = (itemId) => {
    setIsFolderOpen(
      (prev) => ({ ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}), [itemId]: !prev[itemId] }))
  }


  const closeFolder = () => {
    setIsFolderOpen({})
  }

  useEffect(() => {
    const getSettings = async () => {
      const res = await settings()
      if (res.result === "ok") {
        const desktopBackground = res.settings.find((setting) => setting.name === "desktop_background")
        const textColor = res.settings.find((setting) => setting.name === "text_color")
        const backgroundColor = res.settings.find((setting) => setting.name === "background_color")
        setDesktopBackground(`${uri}/images/${desktopBackground.value}`)
        setBackgroundColor(backgroundColor.value)
        setTextColor(textColor.value)
      }
    }
    getSettings()
  }, [])

  return (
    <>
      <Loader />
      <div className="wrapper" style={{ backgroundImage: `url(${desktopBackground})` }}>
        <div className="inner_wrapper">
          <Folders handleToogleFolder={handleToogleFolder} isFolderOpen={isFolderOpen} closeFolder={closeFolder} textColor={textColor} />
        </div>
        <MenuBar backgroundColor={hexToRgba(backgroundColor, 0.33)} />
      </div>
    </>
  );
};

export default App;
