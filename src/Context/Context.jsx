import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, collection, onSnapshot } from "firebase/firestore";

const UserContext = createContext();

const Context = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [post, setPostData] = useState([]); // Ensuring posts is an array
  const [error, setError] = useState({ profile: null, post: null });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setProfile(null);
        setPostData([]); // Clear posts when user logs out
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchProfile = (uid) => {
    const profileDocRef = doc(db, "profile", uid);

    const unsubscribeProfile = onSnapshot(
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

    return unsubscribeProfile;
  };

  const fetchData = (uid) => {
    const postCollection = collection(db, "posts"); // Reference to the posts collection

    const unsubscribePosts = onSnapshot(
      postCollection,
      (snapshot) => {
        const postList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setPostData(postList); // Update posts state with fetched data
        console.log(postList); // Log the fetched posts to verify
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setError((prev) => ({ ...prev, post: "Error fetching posts data." }));
      }
    );

    return unsubscribePosts;
  };

  useEffect(() => {
    let unsubscribeProfile, unsubscribePosts;

    if (user) {
      unsubscribeProfile = fetchProfile(user.uid);
      unsubscribePosts = fetchData(user.uid);
    }

    return () => {
      unsubscribeProfile && unsubscribeProfile();
      unsubscribePosts && unsubscribePosts();
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, profile, post, error }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, Context };
export default Context;
