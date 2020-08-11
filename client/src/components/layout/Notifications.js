import React, { useState } from "react";
//dayjs to format posted
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//RRD
import { Link } from "react-router-dom";
//MUI
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
// Icons
import NotificationsIcon from "@material-ui/icons/NotificationsNone";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
//redux
import { useDispatch, useSelector } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.user.notifications);
  dayjs.extend(relativeTime);
  //Handlers
  const handleOpen = (e) => {
    setAnchorEl(e.target);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onMenuOpen = () => {
    let unreadNotificationsIds = notifications
      .filter((item) => !item.read) //Get the ones that are not read
      .map((item) => item.notificationId);
    dispatch(markNotificationsRead(unreadNotificationsIds));
  };
  // Notification Icon Markup
  let notificationIcon;
  if (notifications && notifications.length > 0) {
    notifications.filter((item) => item.read === false).length > 0
      ? (notificationIcon = (
          <Badge
            badgeContent={
              notifications.filter((item) => item.read === false).length
            } //number of unread notifications
            color="secondary"
          >
            <NotificationsIcon fontSize={"large"} color={"secondary"} />
          </Badge>
        ))
      : (notificationIcon = (
          <NotificationsIcon fontSize={"large"} color={"secondary"} />
        ));
  } else {
    notificationIcon = (
      <NotificationsIcon fontSize={"large"} color={"secondary"} />
    );
  }

  // Notifications list markup
  let notificationsMarkup =
    notifications && notifications.length > 0 ? (
      notifications.map((item) => {
        const verb = item.type === "like" ? "liked" : "commented on";
        const time = dayjs(item.createdAt).fromNow;
        const iconColor = item.read ? "disabled" : "secondary";
        const icon =
          item.type === "like" ? (
            <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
          ) : (
            <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
          );
        return (
          <MenuItem key={item.createdAt} onClick={handleClose}>
            {icon}
            <div className={"notifications-div"}>
              <Link to={`/user/${item.sender}`}>{item.sender}</Link> {verb}{" "}
              <Link to={`/plant/${item.plantId}`}>Your plant</Link> {time}
            </div>
          </MenuItem>
        );
      })
    ) : (
      <MenuItem onClick={handleClose}>You have no notifications</MenuItem>
    );

  return (
    <>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onEnter={onMenuOpen}
      >
        {notificationsMarkup}
      </Menu>
    </>
  );
};

export default Notifications;
