import { useEffect, useState, useRef } from "react"
import "../../App.css"
import { useLocation, useNavigate } from "react-router-dom"
import token from "../../services/auth/token"
import Sidebar from "../../components/sidebar/Sidebar"
import settings from "../../services/settings/all"
import menu from "../../services/menu/all"
import addMenu from "../../services/menu/add"
import deleteMenu from "../../services/menu/delete"
import editLink from "../../services/menu/link"
import editMenu from "../../services/menu/drop"
import editImage from "../../services/menu/image"
import addMenuFolder from "../../services/menu_folder/add"
import deleteMenuFolder from "../../services/menu_folder/delete"
import editLinkFolder from "../../services/menu_folder/link"
import menuFolder from "../../services/menu_folder/all"
import editMenuFolder from "../../services/menu_folder/drop"
import { uri } from "../../utils/const"
import { hexToRgba } from "../../utils/colors"

const Menu = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const inputFile = useRef(null)

  const path = pathname

  const [desktopBackground, setDesktopBackground] = useState("")
  const [textColor, setTextColor] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("")
  const [menuItems, setMenuItems] = useState([])
  const [newMenuItem, setNewMenuItem] = useState({
    link: "",
    image: "",
    index: 0,
    show: false
  })
  const [menuFolderItems, setMenuFolderItems] = useState([])
  const [newMenuFolderItem, setNewMenuFolderItem] = useState({
    link: "",
    index: 0,
    show: false
  })
  const [tooltip, setTooltip] = useState(false)
  const [linkTimeout, setLinkTimeout] = useState(null)

  const handleChangeNewMenuItem = (event) => {
    setNewMenuItem({
      ...newMenuItem,
      [event.target.name]: event.target.value
    })
  }

  const handleChangeNewMenuFolderItem = (event) => {
    setNewMenuFolderItem({
      ...newMenuFolderItem,
      [event.target.name]: event.target.value
    })
  }

  const handleChangeNewMenuItemImage = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      setNewMenuItem({
        ...newMenuItem,
        image: reader.result
      })
    }
  }

  const handleShowNewMenuItem = () => {
    setNewMenuItem({
      link: "",
      image: "",
      index: menuItems.length,     
      show: !newMenuItem.show
    })
  }

  const handleShowNewMenuFolderItem = () => {
    setNewMenuFolderItem({
      link: "",
      index: menuFolderItems.length,
      show: !newMenuFolderItem.show
    })
  }

  const handleRemoveNewMenuItem = () => {
    setNewMenuItem({
      link: "",
      image: "",
      index: 0,
      show: false
    })
  }

  const handleRemoveNewMenuFolderItem = () => {
    setNewMenuFolderItem({
      link: "",
      index: 0,
      show: false
    })
  }

  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData('text/plain', index)
  }

  const handleDropMenuFolderStart = (index) => (event) => {
    event.dataTransfer.setData('text/plain', index)
  }

  const handleDrop = (index) => async (event) => {
    const draggedIndex = event.dataTransfer.getData('text/plain')
    const newMenuItems = [...menuItems]
    const draggedItem = newMenuItems[draggedIndex]

    newMenuItems.splice(draggedIndex, 1)
    newMenuItems.splice(index, 0, draggedItem)

    const usernameStorage = localStorage.getItem("uname")
    const tokenStorage = localStorage.getItem("token")

    try {
      if (tokenStorage && usernameStorage) {
        const editRes = await editMenu(usernameStorage, tokenStorage, draggedIndex, index)
        if (editRes.result === "ok") {
          const menuRes = await menu()
          if (menuRes.result === "ok") {
            setMenuItems(menuRes.menu)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditImage = async (e, id) => {
    const usernameStorage = localStorage.getItem("uname")
    const tokenStorage = localStorage.getItem("token")

    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = async () => {
      try {
        if (tokenStorage && usernameStorage) {
          const editRes = await editImage(usernameStorage, tokenStorage, reader.result, id)
          if (editRes.result === "ok") {
            const menuRes = await menu()
            if (menuRes.result === "ok") {
              setMenuItems(menuRes.menu)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleDropMenuFolder = (index) => async (event) => {
    const draggedIndex = event.dataTransfer.getData('text/plain')
    const newMenuFolderItems = [...menuFolderItems]
    const draggedItem = newMenuFolderItems[draggedIndex]
    
    newMenuFolderItems.splice(draggedIndex, 1)
    newMenuFolderItems.splice(index, 0, draggedItem)

    const usernameStorage = localStorage.getItem("uname")
    const tokenStorage = localStorage.getItem("token")

    try {
      if (tokenStorage && usernameStorage) {
        const editRes = await editMenuFolder(usernameStorage, tokenStorage, draggedIndex, index)
        if (editRes.result === "ok") {
          const menuFolderRes = await menuFolder()
          if (menuFolderRes.result === "ok") {
            setMenuFolderItems(menuFolderRes.menu)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteMenuItem = async (id) => {
    if(!confirm("Sei sicura di voler eliminare questo elemento? L'azione è irreversibile")) return
    const usernameStorage = localStorage.getItem("uname")
    const tokenStorage = localStorage.getItem("token")

    try {
      if (tokenStorage && usernameStorage) {
        const deleteRes = await deleteMenu(usernameStorage, tokenStorage, id)
        if (deleteRes.result === "ok") {
          const menuRes = await menu()
          if (menuRes.result === "ok") {
            setMenuItems(menuRes.menu)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteMenuFolderItem = async (id) => {
    if(!confirm("Sei sicura di voler eliminare questo elemento? L'azione è irreversibile")) return
    const usernameStorage = localStorage.getItem("uname")
    const tokenStorage = localStorage.getItem("token")

    try {
      if (tokenStorage && usernameStorage) {
        const deleteRes = await deleteMenuFolder(usernameStorage, tokenStorage, id)
        if (deleteRes.result === "ok") {
          const menuFolderRes = await menuFolder()
          if (menuFolderRes.result === "ok") {
            setMenuFolderItems(menuFolderRes.menu)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSaveNewMenuItem = async () => {
    if(!newMenuItem.link || !newMenuItem.image) {
      alert("Seleziona un'immagine e inserisci un link")
      return
    }

    const usernameStorage = localStorage.getItem("uname")
    const tokenStorage = localStorage.getItem("token")

    try {
      if (tokenStorage && usernameStorage) {
        const addRes = await addMenu(usernameStorage, tokenStorage, newMenuItem)
        if (addRes.result === "ok") {
          const menuRes = await menu()
          if (menuRes.result === "ok") {
            setMenuItems(menuRes.menu)
            setNewMenuItem({
              link: "",
              image: "",
              index: 0,
              show: false
            })
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSaveNewMenuFolderItem = async () => {
    if(!newMenuFolderItem.link) {
      alert("Inserisci un link")
      return
    }
    
    const usernameStorage = localStorage.getItem("uname")
    const tokenStorage = localStorage.getItem("token")

    try {
      if (tokenStorage && usernameStorage) {
        const addRes = await addMenuFolder(usernameStorage, tokenStorage, newMenuFolderItem)
        if (addRes.result === "ok") {
          const menuFolderRes = await menuFolder()
          if (menuFolderRes.result === "ok") {
            setMenuFolderItems(menuFolderRes.menu)
            setNewMenuFolderItem({
              link: "",
              index: 0,
              show: false
            })
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const editLinkItem = ({ id, link }) => {
    setMenuItems((prevState) => (
      prevState.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            link: link
          }
        } else {
          return item
        }
      })
    ))

    if (linkTimeout) {
      clearTimeout(linkTimeout)
    }

    const timeoutId = setTimeout(async () => {
      const usernameStorage = localStorage.getItem("uname")
      const tokenStorage = localStorage.getItem("token")

      try {
        if (tokenStorage && usernameStorage) {
          const editRes = await editLink(usernameStorage, tokenStorage, id, link)
          if (editRes.result === "ok") {
            const menuRes = await menu()
            if (menuRes.result === "ok") {
              setMenuItems(menuRes.menu)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000)

    setLinkTimeout(timeoutId)
  }

  const editLinkFolderItem = ({ id, link }) => {
    setMenuFolderItems((prevState) => (
      prevState.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            link: link
          }
        } else {
          return item
        }
      })
    ))

    if (linkTimeout) {
      clearTimeout(linkTimeout)
    }

    const timeoutId = setTimeout(async () => {
      const usernameStorage = localStorage.getItem("uname")
      const tokenStorage = localStorage.getItem("token")

      try {
        if (tokenStorage && usernameStorage) {
          const editRes = await editLinkFolder(usernameStorage, tokenStorage, id, link)
          if (editRes.result === "ok") {
            const menuFolderRes = await menuFolder()
            if (menuFolderRes.result === "ok") {
              setMenuFolderItems(menuFolderRes.menu)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000)

    setLinkTimeout(timeoutId)
  }

  const onButtonClick = () => {
    inputFile.current.click()
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
              const textColor = settingsRes.settings.find((setting) => setting.name === "text_color")
              const backgroundColor = settingsRes.settings.find((setting) => setting.name === "background_color")
              const profileImage = settingsRes.settings.find((setting) => setting.name === "profile_image")
              setDesktopBackground(`${uri}/images/${desktopBackground.value}`)
              setProfileImage(`${uri}/images/${profileImage.value}`)
              setTextColor(textColor.value)
              setBackgroundColor(backgroundColor.value)
            }

            const menuRes = await menu()
            if (menuRes.result === "ok") {
              setMenuItems(menuRes.menu)
            }

            const menuFolderRes = await menuFolder()
            if (menuFolderRes.result === "ok") {
              setMenuFolderItems(menuFolderRes.menu)
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
          <div className="dashboard_content_row_100">
            <div className="dashboard_content_list" style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
              <div className="dashboard_content_list_icon">
                <span className="cursor-pointer relative" onMouseEnter={() => setTooltip(true)} onMouseLeave={() => setTooltip(false)}>
                  ❓
                  { tooltip && <div className="dashboard_content_list_icon_tooltip" style={{ backgroundColor: backgroundColor, color: textColor }} onMouseLeave={() => setTooltip(false)} onMouseEnter={() => setTooltip(true)}>
                    <p>Il campo di testo è il link che verrà aperto quando si clicca sull&apos;icona. Può essere un link esterno o un link interno al sito. Se è un link interno al sito, inserire il percorso parziale del link e seguire con il titolo del progetto che si vuole aprire, ad esempio: /progetto. Se è un link esterno al sito, inserire il link completo, ad esempio: https://google.com</p>
                  </div> }
                </span>
                <span onClick={handleShowNewMenuItem} className="cursor-pointer">
                ➕
                </span>
              </div>
              <div className="dashboard_content_list_title">
                <h3>Menu principale</h3>
                <small>Edita gli elementi del menu principale</small>
                <ul className="dashboard_content_list_items">
                  {menuItems.map((item, index) => (
                    <li 
                      key={item.id} 
                      draggable
                      onDragStart={handleDragStart(index)}
                      onDrop={handleDrop(index)}
                      onDragOver={(e) => e.preventDefault()}
                      className="dashboard_content_list_item" 
                      style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
                      <span className="dashboard_content_list_item_icon cursor-pointer">
                        🖐️
                      </span>
                      <input type="text" value={item.link} style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }} onChange={(event) => editLinkItem({ id: item.id, link: event.target.value })} className={item.link === "" ? "dashboard_content_list_item_input_error" : "dashboard_content_list_item_input"}/>
                      <span className="relative">
                        <input className="absolute icon" type="file" name="image" onChange={(e) => handleEditImage(e, item.id)} />
                        <img src={`${uri}/images/${item.image}`} alt={item.link} className="dashboard_content_list_item_image cursor-pointer" />
                      </span>
                      <span className="dashboard_content_list_item_icon cursor-pointer" onClick={() => handleDeleteMenuItem(item.id)}>
                        🗑️
                      </span>
                    </li>
                  ))}
                  {newMenuItem.show && (
                    <li className="dashboard_content_list_item" style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
                      <span className="dashboard_content_list_item_icon cursor-pointer" onClick={handleSaveNewMenuItem}>
                        ✅
                      </span>
                      <input type="text" name="link" value={newMenuItem.link} onChange={handleChangeNewMenuItem} style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }} className="dashboard_content_list_item_input" />
                      <input type="file" name="image" onChange={handleChangeNewMenuItemImage} ref={inputFile} style={{ display: "none" }} />
                        { newMenuItem.image && <img src={newMenuItem.image} alt={newMenuItem.link} className="dashboard_content_list_item_image cursor-pointer" onClick={onButtonClick} /> }
                        { !newMenuItem.image && <span className="dashboard_content_list_item_icon cursor-pointer" onClick={onButtonClick} >
                        🖼️
                      </span> }
                      <span className="dashboard_content_list_item_icon cursor-pointer" onClick={handleRemoveNewMenuItem}>
                        🗑️
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="dashboard_content_list" style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
              <div className="dashboard_content_list_icon">
                <span onClick={handleShowNewMenuFolderItem} className="cursor-pointer">
                  ➕
                </span>
              </div>
              <div className="dashboard_content_list_title">
                <h3>Menu cartella</h3>
                <small>Edita gli elementi del menu cartella</small>
                <ul className="dashboard_content_list_items">
                  {menuFolderItems.map((item, index) => (
                    <li 
                      key={item.id} 
                      draggable
                      onDragStart={handleDropMenuFolderStart(index)}
                      onDrop={handleDropMenuFolder(index)}
                      onDragOver={(e) => e.preventDefault()}
                      className="dashboard_content_list_item" 
                      style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
                      <span className="dashboard_content_list_item_icon cursor-pointer">
                        🖐️
                      </span>
                      <input type="text" value={item.link} style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }} onChange={(event) => editLinkFolderItem({ id: item.id, link: event.target.value })} className={item.link === "" ? "dashboard_content_list_item_input_error" : "dashboard_content_list_item_input"}/>
                      <span className="dashboard_content_list_item_icon cursor-pointer" onClick={() => handleDeleteMenuFolderItem(item.id)}>
                        🗑️
                      </span>
                    </li>
                  ))}
                  {newMenuFolderItem.show && (
                    <li className="dashboard_content_list_item" style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }}>
                      <span className="dashboard_content_list_item_icon cursor-pointer" onClick={handleSaveNewMenuFolderItem}>
                        ✅
                      </span>
                      <input type="text" name="link" value={newMenuFolderItem.link} onChange={handleChangeNewMenuFolderItem} style={{ backgroundColor: hexToRgba(backgroundColor, 0.66), color: textColor }} className="dashboard_content_list_item_input" />
                      <span className="dashboard_content_list_item_icon cursor-pointer" onClick={handleRemoveNewMenuFolderItem}>
                        🗑️
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>          
        </div>
      </div>
    </div>
  )
}

export default Menu
