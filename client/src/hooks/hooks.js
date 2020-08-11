import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useIsOwnProfile = (username) => {
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const logedInUser = useSelector((state) => state.user);
  useEffect(() => {
    if (username === logedInUser.credentials.username) {
      setIsOwnProfile(true);
    }
  }, [username, logedInUser]);
  return { isOwnProfile, logedInUser };
};
