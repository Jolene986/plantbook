import React, { useEffect } from "react";
import PlantCard from "../components/plant/Card";
import Loader from "../components/layout/Loader";
import Comment from "../components/plant/Comment";
import PostComment from "../components/plant/PostComent";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getOnePlant } from "../redux/actions/dataActions";
const useStyles = makeStyles(() => ({
  loaderDiv: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  commentList: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "rgb(245,245,245)",
  },
  noComments: {
    padding: "1em",
  },
  visibleSeparator: {
    width: "100%",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
}));

const PlantPage = (props) => {
  const classes = useStyles();
  let plantId = props.match.params.plantId;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.ui.loading);
  const plant = useSelector((state) => state.data.plant);

  useEffect(() => {
    dispatch(getOnePlant(plantId));
  }, [dispatch, plantId]);

  return (
    <>
      {loading ? (
        <div className={classes.loaderDiv}>
          {" "}
          <Loader />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <PlantCard
              plant={plant}
              loading={loading}
              history={props.history}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            {/*POST COMMENT COMPONENT  + u must be logged in to post a cooment */}
            <PostComment plantId={plantId} />

            {/*LIST OF COMMENTS COMPONENT ( > one comment > like component) */}
            {!plant.comments ? null : plant.comments.length === 0 ? (
              <div className={classes.noComments}>
                This plant has no coments. Be the first to add one!
              </div>
            ) : (
              <div className={classes.commentList}>
                {plant.comments.map((item) => (
                  <Comment comment={item} key={item.commentId} />
                ))}
              </div>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default PlantPage;
