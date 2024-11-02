import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, collection, onSnapshot, setDoc, getDoc } from "firebase/firestore";

const UserContext = createContext();

const Context = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [post, setPostData] = useState([]); // Posts data
  const [jobs, setJobsData] = useState([]); // Jobs data
  const [userData, setUserData] = useState({});
  const [error, setError] = useState({ profile: null, post: null, jobs: null });
  const email=auth.currentUser?.email
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage for dark mode preference
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true"; // Convert to boolean
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setProfile(null);
        setPostData([]);
        setJobsData([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode); // Save to local storage
      return newMode;
    });
  };

  const fetchProfile = (uid) => {
    const profileDocRef = doc(db, "profile", uid);
    return onSnapshot(
      profileDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setProfile(docSnapshot.data());
          setError((prev) => ({ ...prev, profile: null }));
        } else {
          setProfile(null);
          setError((prev) => ({ ...prev, profile: "No profile data found." }));
        }
      },
      (error) => {
        console.error("Error fetching profile:", error);
        setError((prev) => ({ ...prev, profile: "Error fetching profile data." }));
        setProfile(null);
      }
    );
  };

  const fetchCollection = (collectionName, setData, setError) => {
    const collectionRef = collection(db, collectionName);
    return onSnapshot(
      collectionRef,
      (snapshot) => {
        const dataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(dataList);
        setError(null); // Reset any existing error
      },
      (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        setError(`Error fetching ${collectionName} data.`);
      }
    );
  };

  const fetchData = () => fetchCollection("posts", setPostData, setError);
  const fetchJobs = () => fetchCollection("jobs", setJobsData, setError);

  useEffect(() => {
    let unsubscribeProfile, unsubscribePosts, unsubscribeJobs;

    if (user) {
      unsubscribeProfile = fetchProfile(user.uid);
      unsubscribePosts = fetchData();
      unsubscribeJobs = fetchJobs();
    }

    return () => {
      unsubscribeProfile && unsubscribeProfile();
      unsubscribePosts && unsubscribePosts();
      unsubscribeJobs && unsubscribeJobs();
      fetchUserData();
    };
  }, [user]);

  const updateProfile = async (uid, newProfileData) => {
    try {
      await setDoc(doc(db, "profile", uid), newProfileData, { merge: true });
      // Update local profile state immediately
      setProfile(prevProfile => ({ ...prevProfile, ...newProfileData }));
    } catch (error) {
      console.error("Error updating profile:", error);
      setError((prev) => ({ ...prev, profile: "Error updating profile." }));
    }
  };
  const fetchUserData = async () => {
    if (email) {
        try {
            // Fetch the user document based on the user's email
            const userDocRef = doc(db, "Users", email);
            const userDoc = await getDoc(userDocRef);
            console.log(userDoc.data())
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    }
};


  return (
    <UserContext.Provider value={{ user,userData,profile, post, jobs, error, darkMode, toggleDarkMode, updateProfile, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, Context };
export default Context;
