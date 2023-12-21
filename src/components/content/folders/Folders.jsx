import styles from "./Folders.module.css"
import { folders } from "./foldersData"
import Folder from "./Folder"
import PropTypes from "prop-types"

const Folders = ({ handleToogleFolder, isFolderOpen, closeFolder, textColor }) => {
  return (
    <>
      <div className={styles.wrapper}>
        {folders.map((folder) => (
          <Folder key={folder.name} folder={folder} handleToogleFolder={handleToogleFolder} isFolderOpen={isFolderOpen[folder.id]} closeFolder={closeFolder} textColor={textColor} />
        ))}
      </div>
    </>
  )
}

Folders.propTypes = {
  handleToogleFolder: PropTypes.func.isRequired,
  isFolderOpen: PropTypes.object.isRequired,
  closeFolder: PropTypes.func.isRequired,
  textColor: PropTypes.string.isRequired
}

export default Folders
