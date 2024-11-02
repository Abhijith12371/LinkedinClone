import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, collection, onSnapshot, setDoc, getDoc, query, where } from "firebase/firestore";

const UserContext = createContext();

const Context = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [post, setPostData] = useState([]); // Posts data
  const [jobs, setJobsData] = useState([]); // Jobs data
  const [userData, setUserData] = useState({});
  const [error, setError] = useState({ profile: null, post: null, jobs: null });
  const [newMessageNotification, setNewMessageNotification] = useState(false); // Notification for new messages
  const email = auth.currentUser?.email;

  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage for dark mode preference
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true"; // Convert to boolean
  });

  // Monitor authentication status
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

  // Fetch profile data for authenticated user
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

  // Generic function to fetch collections
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

  // Fetch and listen to user data and collections when the user logs in
  useEffect(() => {
    let unsubscribeProfile, unsubscribePosts, unsubscribeJobs;

    if (user) {
      unsubscribeProfile = fetchProfile(user.uid);
      unsubscribePosts = fetchData();
      unsubscribeJobs = fetchJobs();
      fetchUserData();
      listenForNewMessages(user.uid); // Start listening for new messages
    }

    return () => {
      unsubscribeProfile && unsubscribeProfile();
      unsubscribePosts && unsubscribePosts();
      unsubscribeJobs && unsubscribeJobs();
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

  // Fetch individual user data
  const fetchUserData = async () => {
    if (email) {
      try {
        const userDocRef = doc(db, "Users", email);
        const userDoc = await getDoc(userDocRef);
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

  // Listen for new messages and trigger notification
  const listenForNewMessages = (userId) => {
    const chatsRef = collection(db, "chats");
    const userChatsQuery = query(chatsRef, where("receiverId", "==", userId));

    const unsubscribeMessages = onSnapshot(userChatsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setNewMessageNotification(true); // New message received
        }
      });
    });

    return () => unsubscribeMessages();
  };

  return (
    <UserContext.Provider value={{
      user,
      userData,
      profile,
      post,
      jobs,
      error,
      darkMode,
      toggleDarkMode,
      updateProfile,
      fetchProfile,
      newMessageNotification,
      setNewMessageNotification // To reset notification in other components
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, Context };
export default Context;
