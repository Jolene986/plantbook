import React, { useEffect } from "react";
import { useIsOwnProfile } from "../hooks/hooks";
import PlantCard from "../components/plant/Card";
import Loader from "../components/layout/Loader";
import NoPlants from "../components/profile/NoPlants";
import Profile from "../components/profile/Profile";
import AnyUserProfile from "../components/profile/AnyUserProfile";
//MUI
import Grid from "@material-ui/core/Grid";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { getUsersAndPlants } from "../redux/actions/dataActions";

const UserPage = (props) => {
  const username = props.match.params.username;
  const { loading, userData, userPlants } = useSelector((state) => state.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersAndPlants(username));
  }, [dispatch, username]);
  const { isOwnProfile, logedInUser } = useIsOwnProfile(username);

  let content = null;
  if (loading) {
    content = (
      <div className={"text-align-center"}>
        <Loader classN="loader" />
      </div>
    );
  } else if (userData.length === 0) {
    content = <p>Error404: User not found</p>;
  } else {
    content = (
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          {isOwnProfile ? (
            <Profile user={logedInUser.credentials} />
          ) : (
            <AnyUserProfile user={userData} />
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {userPlants.length === 0 ? (
            <NoPlants isOwnProfile={isOwnProfile} />
          ) : (
            userPlants.map((item) => (
              <PlantCard plant={item} key={item.plantId} />
            ))
          )}
        </Grid>
      </Grid>
    );
  }

  return <>{content}</>;
};

export default UserPage;
