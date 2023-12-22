import styles from "./Folders.module.css"
import Folder from "./Folder"
import PropTypes from "prop-types"
import { uri } from "../../../utils/const"

const Folders = ({ handleToogleFolder, isFolderOpen, closeFolder, textColor, gridData }) => {

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
              key={gridItem.id}
              className="home_grid-item"
              style={{
                gridColumn: `${col + 1} / ${col + 2}`,
                gridRow: `${row + 1} / ${row + 2}`,
              }}
            >
              <div className="home_grid-item-content">
                {gridItem.type === "folder" ? (
                  <img src={"/images/folder.png"} alt="folder" className="cursor-pointer" />
                ) : gridItem.type === "image" ? (
                  <img src={gridItem.file_names ? `${uri}/images/${gridItem.file_names}` : "/images/image_file.png"} alt="image" className="cursor-pointer" />
                ) : gridItem.type === "video" ? (
                  <img src={"/images/mov.png"} alt="video" className="cursor-pointer" />
                ) : gridItem.type === "pdf" ? (
                  <img src={"/images/pdf.png"} alt="pdf" className="cursor-pointer" />
                ) : gridItem.type === "link" ? (
                  <img src={gridItem.file_names ? `${uri}/images/${gridItem.file_names}` : "/images/image_file.png"} alt="link" className="cursor-pointer" />
                ) : (
                  <img src={"/images/image_file.png"} alt="image" className="cursor-pointer" />
                )}
                <p>{gridItem.title}</p>
              </div>
            </div>
          )
        } else {
          grid.push(
            <div
              key={`${row}${col}`}
              className="home_grid-item"
            />
          )
        }
      }
    }

    return grid
  }

  return (
    <div className="home_content">
      <div className="home_grid-container">{renderGrid()}</div>
    </div>
  )
}

Folders.propTypes = {
  handleToogleFolder: PropTypes.func.isRequired,
  isFolderOpen: PropTypes.object.isRequired,
  closeFolder: PropTypes.func.isRequired,
  textColor: PropTypes.string.isRequired,
  gridData: PropTypes.array.isRequired,
}

export default Folders
