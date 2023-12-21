import styles from "./FolderContent.module.css";
import PropType from "prop-types";
import { folderMenu } from "./folderData"

const FolderContent = ({ isFolderOpen, files, closeFolder, name }) => {
  return (
    <>
      <div
        className={styles.wrapper}
        style={{
          visibility: isFolderOpen ? "visible" : "hidden",
        }}
      >
        <div className={styles.left_inner_wrapper}>
          <div className={styles.left_corner_buttons}>
            <img
              onClick={closeFolder}
              className={styles.left_corner_button_img}
              src="/images/icons/close.png"
              alt="icns"
            />
            <img
              className={styles.left_corner_button_img}
              src="/images/icons/minimise.png"
              alt="icns"
            />
            <img
              className={styles.left_corner_button_img}
              src="/images/icons/zoom.png"
              alt="icns"
            />
          </div>
          <div className={styles.left_menu_wrapper}>
            <ul className={styles.left_ul}>
              {folderMenu.map((item) => (
                <li key={item.name} className={styles.left_li}>
                  <img
                    className={styles.blue_icon_img}
                    src={item.icon}
                    alt={item.name}
                  />
                  <p className={styles.left_li_text}>{item.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.right_inner_wrapper}>
          <div className={styles.right_top_bar}>
            <div className={styles.right_top_bar_left}>
              <img src="/images/icons/left_arrow.png" alt="left_arrow" />
              <img src="/images/icons/right_arrow.png" alt="right_arrow" />
              <p className={styles.left_text}>{name}</p>
            </div>
          </div>
          <div className={styles.right_inner_content}>
            <div className={styles.row}>
              {files.map((file) => (
                <div key={file.name} className={styles.folderWrapper}>
                  <img
                    className={styles.folder_img}
                    src={file.icon}
                    alt={file.name}
                  />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

FolderContent.propTypes = {
  isFolderOpen: PropType.bool.isRequired,
  handleToogleFolder: PropType.func.isRequired,
  files: PropType.array.isRequired,
  closeFolder: PropType.func.isRequired,
  name: PropType.string.isRequired,
};

export default FolderContent;
