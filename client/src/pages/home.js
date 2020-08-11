import React, { useEffect } from "react";
import Loader from "../components/layout/Loader";
import PlantCard from "../components/plant/Card";
import { useDispatch, useSelector } from "react-redux";
import { getPlants } from "../redux/actions/dataActions";

const Home = () => {
  const { loading, plants } = useSelector((state) => state.data);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPlants());
  }, [dispatch]);

  return (
    <>
      {plants === [] && <div>Something went wrong ...</div>}
      {loading ? (
        <Loader classN="loader" />
      ) : (
        plants.map((item) => <PlantCard plant={item} key={item.plantId} />)
      )}
    </>
  );
};
export default Home;
