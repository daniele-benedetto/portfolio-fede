import PropTypes from 'prop-types';
import styles from './Folders.module.css'
import FolderContent from '../folderContent/FolderContent';
import { getOppositeColor } from '../../../utils/colors';

const Folder = ({ folder, handleToogleFolder, isFolderOpen, closeFolder, textColor }) => {


    return (
        <>
            <div key={folder.name} className={styles.folderWrapper}>
                <img
                    onClick={folder.children ? () => handleToogleFolder(folder.id) : null}
                    src={folder.icon}
                    alt={folder.name}
                />
                <span className={styles.folderText} style={{ color: getOppositeColor(textColor) }}>{folder.name}</span>
            </div>
            {folder.children && <FolderContent isFolderOpen={isFolderOpen} files={folder.children} closeFolder={closeFolder} name={folder.name} />}
        </>
    )
}

Folder.propTypes = {
    folder: PropTypes.object.isRequired,
    handleToogleFolder: PropTypes.func.isRequired,
    isFolderOpen: PropTypes.object.isRequired,
    closeFolder: PropTypes.func.isRequired,
    textColor: PropTypes.string.isRequired
}

export default Folder

