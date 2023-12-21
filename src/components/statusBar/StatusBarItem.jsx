import styles from "./StatusBar.module.css";
import AppleMenu from "../content/appleMenu/AppleMenu";
import PropTypes from "prop-types";

const StatusBarItem = ({ item, onToggleAppleMenu, isAppleMenuOpen, backgroundColor, textColor }) => {

    return (
        <li
            key={item.name}
            className={styles.left_ul}
            onClick={item.children ? () => onToggleAppleMenu(item.id) : null}
        >
        {item.image ? (
            <img src={item.image} alt={item.name} className="cursor-pointer" />
        ) : (
            <span>{item.name}</span>
        )}
        {item.children ? (
            <AppleMenu items={item.children} isAppleMenuOpen={isAppleMenuOpen} backgroundColor={backgroundColor} textColor={textColor} />
        ) : null}
        </li>
    );
};

StatusBarItem.propTypes = {
    item: PropTypes.object.isRequired,
    onToggleAppleMenu: PropTypes.func.isRequired,
    isAppleMenuOpen: PropTypes.object.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired
};

export default StatusBarItem;
