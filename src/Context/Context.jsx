import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, collection, onSnapshot } from "firebase/firestore";

const UserContext = createContext();

const Context = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [post, setPostData] = useState([]); // Posts data
  const [jobs, setJobsData] = useState([]); // Jobs data
  const [error, setError] = useState({ profile: null, post: null, jobs: null });

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

  const fetchData = () => {
    const postCollection = collection(db, "posts");

    const unsubscribePosts = onSnapshot(
      postCollection,
      (snapshot) => {
        const postList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPostData(postList);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setError((prev) => ({ ...prev, post: "Error fetching posts data." }));
      }
    );

    return unsubscribePosts;
  };

  const fetchJobs = () => {
    const jobsCollection = collection(db, "jobs"); // Reference the jobs collection
  
    const unsubscribeJobs = onSnapshot(
      jobsCollection,
      (snapshot) => {
        const jobsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
        setJobsData(jobsList); // Correctly update jobs state
        console.log(jobsList); // Log the fetched jobs to verify
      },
      (error) => {
        console.error("Error fetching jobs:", error);
        setError((prev) => ({ ...prev, jobs: "Error fetching jobs data." })); // Update error key to jobs
      }
    );
  
    return unsubscribeJobs;
  };
  

  useEffect(() => {
    let unsubscribeProfile, unsubscribePosts, unsubscribeJobs;

    if (user) {
      unsubscribeProfile = fetchProfile(user.uid);
      unsubscribePosts = fetchData();
      unsubscribeJobs = fetchJobs(); // Fetch jobs data
    }

    return () => {
      unsubscribeProfile && unsubscribeProfile();
      unsubscribePosts && unsubscribePosts();
      unsubscribeJobs && unsubscribeJobs();
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, profile, post, jobs, error }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, Context };
export default Context;
