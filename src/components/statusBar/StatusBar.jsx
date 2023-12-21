import { useState, useEffect, useCallback } from "react"
import styles from "./StatusBar.module.css"
import PropTypes from "prop-types"

const StatusBar = ({backgroundColor, textColor, profileImage}) => {
  const [currentTime, setCurrentTime] = useState("");

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i
    }
    return i
  }

  const getTime = useCallback(() => {
    var date = new Date()
    var d = date.getDay()
    var h = date.getHours()
    var m = date.getMinutes()
    m = checkTime(m);
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    var currentDayAndTime = `${days[d].substr(0, 3)} ${h}:${m}`
    setCurrentTime(currentDayAndTime)
  }, [])

  useEffect(() => {
    setInterval(() => {
      getTime()
    }, 1000);
  }, [getTime]);
  return (
    <>
      <div className={styles.wrapper} style={{ backgroundColor: backgroundColor, color: textColor }}>
      <div className={styles.wrapper_inner_left}>
          <ul className={styles.left_ul}>
            <li>
              <img className={styles.logo} src={profileImage} alt="profile" />
            </li>
          </ul>
        </div>
        <div className={styles.wrapper_inner_right}>
          <ul className={styles.right_ul}>
            <li>
              <span className={styles.date}>{currentTime}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

StatusBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired
}


export default StatusBar;
