import styles from "./AppleMenu.module.css";
import PropTypes from "prop-types";

const AppleMenu = ({ isAppleMenuOpen, items, backgroundColor, textColor }) => {
  return (
    <>
      <div
        className={styles.wrapper}
        style={{
          visibility: isAppleMenuOpen ? "visible" : "hidden",
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        <ul className={styles.ul}>
          {items.map((item) => {
            return (
              <li key={item.name} className={styles.li}>
                <p className={styles.p}>{item.name}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  );
};

AppleMenu.propTypes = {
  isAppleMenuOpen: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired
};

export default AppleMenu