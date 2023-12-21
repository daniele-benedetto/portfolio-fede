import { Link } from "react-router-dom"
import { sidebar } from "../../utils/data"
import PropTypes from "prop-types";

const Sidebar = ({path, background, color, profileImage}) => {
  return (
    <ul className="dashboard_sidebar_list" style={{ backgroundColor: background, color: color }}>
      <Link className="dashboard_sidebar_list_profile_image" to="/">
        <img src={profileImage} alt="profile" />
      </Link>
      {sidebar.map((item) => {
        return (
          <li key={item.title} className={path === item.link ? 'dashboard_sidebar_list_item_active' : 'dashboard_sidebar_list_item'} style={{ backgroundColor: background, color: color }}>
            <Link to={item.link} className="dashboard_sidebar_list_item_link">
              <span className="dashboard_sidebar_list_item_link_icon">
                {item.icon}
              </span>
              <span className="dashboard_sidebar_list_item_link_title">
                {item.title}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

Sidebar.propTypes = {
  path: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired
}

export default Sidebar