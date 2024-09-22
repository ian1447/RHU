// context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import Axios from "axios";

const UserContext = createContext();

function UserProvider(props) {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  useEffect(() => {
    console.log("$$userData", userData);
  })

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        let token = localStorage.getItem("auth-token");
        if (!token) {
          localStorage.setItem("auth-token", "");
          token = "";
        }
        console.log("$$token", token);
        
        // Check if the token is valid
        const tokenRes = await Axios.post(
          "http://localhost:5001/api/auth/tokenIsValid",
          { headers: { "x-auth-token": token } }
        );

        console.log("$$test",tokenRes);
        if (tokenRes.data) {
          const userRes = await Axios.get(
            "http://localhost:5001/api/auth/user",
            {
              headers: { "x-auth-token": token },
            }
          );

          setUserData({
            token,
            user: userRes.data,
          });

          // Save user data to local storage
          localStorage.setItem("user", JSON.stringify(userRes.data));
          console.log("User and token set from server response");
        }
      } catch (error) {
        console.error("Error checking logged in status", error);
        setUserData({
          token: undefined,
          user: undefined,
        });
      }
    };

    // Load user data from local storage on initial load
    const localUser = localStorage.getItem("user");
    const localToken = localStorage.getItem("auth-token");
    
    if (localUser && localToken) {
      console.log("Loading user data from local storage");
      setUserData({
        token: localToken,
        user: JSON.parse(localUser),
      });
    } else {
      checkLoggedIn();
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
