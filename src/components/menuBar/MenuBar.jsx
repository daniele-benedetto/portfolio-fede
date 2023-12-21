import { useEffect, useState } from "react"
import styles from "./MenuBar.module.css"
import PropTypes from "prop-types"
import menu from "../../services/menu/all"
import { uri } from "../../utils/const";

const MenuBar = (backgroundColor) => {
  const [clickedMenuItem, setClickedMenuItem] = useState(0)
  const [menusItem, setMenuItem] = useState([])

  const onMenuChange = (id) => {
    setClickedMenuItem(id)

    setTimeout(() => {
      setClickedMenuItem(0)
    }, 7000)
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await menu()
      if (res.result === "ok") {
        setMenuItem(res.menu)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <div 
        className={styles.wrapper}
        style={{ backgroundColor: backgroundColor.backgroundColor }}
      >
        <ul className={styles.ul}>
          {menusItem.map((item) => (
            <li
              style={{ textAlign: "center" }}
              key={item.image}
              id={item.id}
              onClick={() => onMenuChange(item.id)}
            >
              <img
                className={
                  clickedMenuItem === item.id ? styles.bounceAnimation : ""
                }
                src={uri + "/images/" + item.image}
                alt="image_alt"
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
};

MenuBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired
};

export default MenuBar
