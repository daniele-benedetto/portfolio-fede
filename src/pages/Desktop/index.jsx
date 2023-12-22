import { useEffect, useState } from "react"
import "../../App.css"
import { useLocation, useNavigate } from "react-router-dom"
import token from "../../services/auth/token"
import Sidebar from "../../components/sidebar/Sidebar"
import settings from "../../services/settings/all"
import desktop from "../../services/desktop/all"
import addDesktop from "../../services/desktop/add"
import dropDesktop from "../../services/desktop/drop"
import deleteDesktop from "../../services/desktop/delete"
import deleteDesktopFile from "../../services/desktop/files/delete"
import editDesktop from "../../services/desktop/edit"
import desktopFiles from "../../services/desktop/files/all"
import addDesktopFiles from "../../services/desktop/files/add"
import editTitle from "../../services/desktop/files/title"
import { uri } from "../../utils/const"
import { hexToRgba } from "../../utils/colors"

const Desktop = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const path = pathname

  const [desktopBackground, setDesktopBackground] = useState("")
  const [textColor, setTextColor] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [gridData, setGridData] = useState([])
  const [newItemModal, setNewItemModal] = useState(false)
  const [editItemModal, setEditItemModal] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [desktopFilesData, setDesktopFilesData] = useState([])
  const [editTimeOut, setEditTimeOut] = useState(null)
  const [newItem, setNewItem] = useState({
    title: "",
    type: "",
    coord_x: null,
    coord_y: null
  })
  const [editItem, setEditItem] = useState({
    id: null,
    title: "",
    type: "",
    coord_x: null,
    coord_y: null
  })
  const [oldCoord, setOldCoord] = useState({
    coord_x: null,
    coord_y: null,
  })
  const [newCoord, setNewCoord] = useState({
    coord_x: null,
    coord_y: null
  })

  const handleNewItemModal = (x, y) => {
    setNewItem({
      ...newItem,
      coord_x: x,
      coord_y: y,
    })
    setNewItemModal(!newItemModal)
  }

  const handleEditItemModal = async (item) => {
    const uname = localStorage.getItem("uname")
    const tokenStr = localStorage.getItem("token")

    setEditItem({
      id: item.id,
      title: item.title,
      type: item.type,
      coord_x: item.coord_x,
      coord_y: item.coord_y,
    })
    setEditItemModal(!editItemModal)

    const res = await desktopFiles(uname, tokenStr, item.id)
    if (res.result === "ok" && res.desktop_files.length > 0) {
      setDesktopFilesData(res.desktop_files)
    } else {
      setDesktopFilesData([])
    }
  }

  const handleEditTitle = async (desktop_id, file_id, title) => {

    setDesktopFilesData(desktopFilesData.map((file) => {
      if(file.id === file_id) {
        return {
          ...file,
          title: title
        }
      } else {
        return file
      }
    }))

    const uname = localStorage.getItem("uname")
    const tokenStr = localStorage.getItem("token")

    if (editTimeOut) clearTimeout(editTimeOut)

    setEditTimeOut(
      setTimeout(async () => {
        const res = await editTitle(uname, tokenStr, file_id, title)
        if (res.result === "ok") {
          const desktopFilesRes = await desktopFiles(uname, tokenStr, desktop_id)
          if (desktopFilesRes.result === "ok" && desktopFilesRes.desktop_files.length > 0) {
            setDesktopFilesData(desktopFilesRes.desktop_files)
          } else {
            setDesktopFilesData([])
          }
        }
      }, 1000)
    )
  }

  const handleDeleteDesktopFile = async (desktop_id, file_id) => {
    if(!confirm("Sei sicura di voler eliminare questo elemento? L'operazione è irreversibile.")) return false
    const uname = localStorage.getItem("uname")
    const tokenStr = localStorage.getItem("token")

    const res = await deleteDesktopFile(uname, tokenStr, desktop_id, file_id)
    if (res.result === "ok") {
      const desktopFilesRes = await desktopFiles(uname, tokenStr, desktop_id)
      if (desktopFilesRes.result === "ok" && desktopFilesRes.desktop_files.length > 0) {
        setDesktopFilesData(desktopFilesRes.desktop_files)
      } else {
        setDesktopFilesData([])
      }
    }
  }

  const handleAddDesktop = async (item) => {
    const uname = localStorage.getItem("uname")
    const tokenStr = localStorage.getItem("token")

    if (item.title && item.type && item.coord_x !== null && item.coord_y !== null) {
      const res = await addDesktop(uname, tokenStr, item)
      if (res.result === "ok") {
        const desktopRes = await desktop(uname, tokenStr)
        if (desktopRes.result === "ok") {
          setGridData(desktopRes.desktop)
          setNewItem({
            title: "",
            type: "",
            coord_x: 0,
            coord_y: 0,
          })
          setNewItemModal(!newItemModal)
        }
      }
    }
  }

  const handleEditDesktop = async (item) => {
    const uname = localStorage.getItem("uname")
    const tokenStr = localStorage.getItem("token")

    if (item.title && item.type && item.id) {
      const res = await editDesktop(uname, tokenStr, item)
      if (res.result === "ok") {
        const desktopRes = await desktop(uname, tokenStr)
        if (desktopRes.result === "ok") {
          setGridData(desktopRes.desktop)
          setEditItemModal(!editItemModal)
          setEditItem({
            id: null,
            title: "",
            type: "",
            coord_x: null,
            coord_y: null,
          })
        }
      }
    }
  }

  const handleDeleteDesktop = async (id) => {
    if(!confirm("Sei sicura di voler eliminare questo elemento? L'operazione è irreversibile.")) return false
    const uname = localStorage.getItem("uname")
    const tokenStr = localStorage.getItem("token")

    const res = await deleteDesktop(uname, tokenStr, id)
    if (res.result === "ok") {
      const desktopRes = await desktop(uname, tokenStr)
      if (desktopRes.result === "ok") {
        setGridData(desktopRes.desktop)
        setEditItemModal(!editItemModal)
        setEditItem({
          id: null,
          title: "",
          type: "",
          coord_x: null,
          coord_y: null,
        })
      }
    }
  }

  const handleDragStart = (item) => {
    setDraggedItem(item)
  }

  const handleDragOver = (col, row) => {
    if (draggedItem) {
      gridData.map(async (item) => {
        if(item.id === draggedItem.id) {
          setOldCoord({
            coord_x: draggedItem.coord_x,
            coord_y: draggedItem.coord_y,
          })
          setNewCoord({
            coord_x: col,
            coord_y: row,
          })
        }
      })
    }
  }

  const handleDragEnd = async () => {
    const uname = localStorage.getItem("uname")
    const tokenStr = localStorage.getItem("token")

    if (draggedItem && newCoord.coord_x !== null && newCoord.coord_y !== null && oldCoord.coord_x !== null && oldCoord.coord_y !== null) {
      const res = await dropDesktop(uname, tokenStr, draggedItem.id, newCoord.coord_x, newCoord.coord_y, oldCoord.coord_x, oldCoord.coord_y)
      if (res.result === "ok") {
        const desktopRes = await desktop(uname, tokenStr)
        if (desktopRes.result === "ok") {
          setGridData(desktopRes.desktop)
          setDraggedItem(null)
        }
      }
    }
  }

  const handleAddDesktopFile = async (desktop_id, e, title) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      const uname = localStorage.getItem("uname")
      const tokenStr = localStorage.getItem("token")

      const res = await addDesktopFiles(uname, tokenStr, desktop_id, reader.result, title)
      if (res.result === "ok") {
        const desktopFilesRes = await desktopFiles(uname, tokenStr, desktop_id)
        if (desktopFilesRes.result === "ok" && desktopFilesRes.desktop_files.length > 0) {
          setDesktopFilesData(desktopFilesRes.desktop_files)
        } else {
          setDesktopFilesData([])
        }
      }
    }
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
              const desktopRes = await desktop(usernameStorage, tokenStorage)
              if (desktopRes.result === "ok") {
                setGridData(desktopRes.desktop)
              } else {
                throw new Error("Desktop not found")
              }
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

  const renderGrid = () => {
    const rows = 9
    const cols = 10

    const grid = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const gridItem = gridData.find((item) => item.coord_x === col && item.coord_y === row)
        if (gridItem) {
          grid.push(
            <div
              onClick={() => handleEditItemModal(gridItem)}
              key={gridItem.id}
              className="grid-item"
              draggable
              onDragStart={() => handleDragStart(gridItem)}
              onDragOver={() => handleDragOver(col, row)}
              onDragEnd={handleDragEnd}
              style={{
                gridColumn: `${col + 1} / ${col + 2}`,
                gridRow: `${row + 1} / ${row + 2}`,
                backgroundColor: hexToRgba(backgroundColor, 0.66),
                color: textColor,
              }}
            >
              <div className="grid-item-content">
                {gridItem.type === "folder" ? (
                  <img src={"/images/folder.png"} alt="folder"  />
                ) : gridItem.type === "image" ? (
                  <img src={gridItem.file_names ? `${uri}/images/${gridItem.file_names}` : "/images/image_file.png"} alt="image"  />
                ) : gridItem.type === "video" ? (
                  <img src={"/images/mov.png"} alt="video"  />
                ) : gridItem.type === "pdf" ? (
                  <img src={"/images/pdf.png"} alt="pdf"  />
                ) : gridItem.type === "link" ? (
                  <img src={gridItem.file_names ? `${uri}/images/${gridItem.file_names}` : "/images/image_file.png"} alt="link"  />
                ) : (
                  <img src={"/images/image_file.png"} alt="image"  />
                )}
                <p>{gridItem.title}</p>
              </div>
            </div>
          )
        } else {
          grid.push(
            <div
              draggable
              onDragStart={() => handleDragStart(gridItem)}
              onDragOver={() => handleDragOver(col, row)}
              onDragEnd={handleDragEnd}
              key={`${row}${col}`}
              className="grid-item cursor-pointer"
              style={{
                gridColumn: `${col + 1} / ${col + 2}`,
                gridRow: `${row + 1} / ${row + 2}`,
                backgroundColor: hexToRgba(backgroundColor, 0.66),
                color: textColor,
              }}
              onClick={() => handleNewItemModal(col, row)}
            >
              ➕
            </div>
          )
        }
      }
    }

    return grid
  }

  return (
    <div className="wrapper" style={{ backgroundImage: `url(${desktopBackground})` }}>
      <div className="dashboard">
        {editItemModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Modifica elemento</h3>
                  <button onClick={() => setEditItemModal(!editItemModal)}>✖</button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editItem.title}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  />
                  <input readOnly type="text" placeholder="Type" value={editItem.type === "folder" ? "Cartella" : editItem.type === "image" ? "Immagine" : editItem.type === "video" ? "Video" : editItem.type === "pdf" ? "PDF" : editItem.type === "link" ? "Link esterno" : "File"} />
                  {(editItem.type === "image" || editItem.type === "video" || editItem.type === "pdf" || editItem.type === 'link') && desktopFilesData.length === 0 && (
                    <button className="custom_button" onClick={() => document.getElementById("file").click()}>
                      {editItem.type === "image" ?
                        "Scegli l'immagine" : editItem.type === "video" ?
                        "Scegli il video" : editItem.type === "pdf" ?
                        "Scegli il PDF" : editItem.type === "link" ?
                        "Scegli immagine di anteprima" : "Scegli il file"
                      }
                    </button>
                  )}
                  {editItem.type === "folder" && (
                    <button className="custom_button" onClick={() => document.getElementById("file").click()}>
                      Aggiungi un file al progetto
                    </button>
                  )}
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleAddDesktopFile(editItem.id, e, editItem.type === "folder" ? null : editItem.title)}
                  />
                </div>
                <div className="modal-body">
                  {desktopFilesData.length > 0 ? (
                    desktopFilesData.map((file) => {
                      const file_format = file.name.split(".")[1]
                      return (
                        (file_format === "jpg" || file_format === "png" || file_format === "jpeg") ? (
                          <div className="file" key={file.id}>
                            <img
                              src={`${uri}/images/${file.name}`}
                              alt={file.name}
                            />
                            <input style={{margin: 10}} type="text" placeholder="Title" value={(editItem.type === 'folder' || editItem.type === 'link') ? file.title : editItem.title} onChange={(e) => handleEditTitle(editItem.id, file.id, e.target.value)} readOnly={(editItem.type === "folder" || editItem.type === "link") ? false : true} />
                            <span className="cursor-pointer" onClick={() => handleDeleteDesktopFile(editItem.id, file.id)}>🗑️</span>
                          </div>
                        ) : file_format === "pdf" ? (
                          <div className="file" key={file.id}>
                            <img
                              src={"/images/pdf.png"}
                              alt={file.name}
                            />
                            <input style={{margin: 10}} type="text" placeholder="Title" value={file.title} onChange={(e) => handleEditTitle(editItem.id, file.id, e.target.value)} />
                            <span onClick={() => handleDeleteDesktopFile(editItem.id, file.id)}>🗑️</span>
                          </div>
                        ) : file_format === "mov" ? (
                          <div className="file" key={file.id}>
                            <img
                              src={"/images/mov.png"}
                              alt={file.name}
                            />
                            <input style={{margin: 10}} type="text" placeholder="Title" value={file.title} onChange={(e) => handleEditTitle(editItem.id, file.id, e.target.value)} />
                            <span onClick={() => handleDeleteDesktopFile(editItem.id, file.id)}>🗑️</span>
                          </div>
                        ) : (
                          <div className="file" key={file.id}>
                            <img
                              src={"/images/file.png"}
                              alt={file.name}
                            />
                            <input style={{margin: 10}} type="text" placeholder="Title" value={file.title} onChange={(e) => handleEditTitle(editItem.id, file.id, e.target.value)} />
                            <span onClick={() => handleDeleteDesktopFile(editItem.id, file.id)}>🗑️</span>
                          </div>
                        )
                      )
                    })
                  ) : (
                    <p>Nessun file presente</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button style={{marginRight: 10}}  onClick={() => handleEditDesktop(editItem)}>Salva</button>
                  <button style={{backgroundColor: 'red', color: 'white', marginLeft: 10}} onClick={() => handleDeleteDesktop(editItem.id)}>Elimina</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {newItemModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Aggiungi un nuovo elemento</h3>
                  <button onClick={() => setNewItemModal(!newItemModal)}>✖</button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                  <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}>
                    <option value="">Seleziona il tipo di file</option>
                    <option value="folder">Cartella</option>
                    <option value="image">Immagine</option>
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="link">Link esterno</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button onClick={() => handleAddDesktop(newItem)}>Salva</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="dashboard_sidebar">
          <Sidebar path={path} background={hexToRgba(backgroundColor, 0.66)} color={textColor} profileImage={profileImage} />
        </div>
        <div className="dashboard_content">
          <div className="grid-container">{renderGrid()}</div>
        </div>
      </div>
    </div>
  )
}

export default Desktop