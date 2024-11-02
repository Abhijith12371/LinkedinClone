// Users.jsx
import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase'; // Your Firebase config
import { collection, getDocs } from 'firebase/firestore';
import { UserContext } from '../Context/context';

const Users = ({ onSelectUser }) => {
  const { user, darkMode } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersCollection = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).filter(u => u.id !== user.uid); // Exclude current user
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        setError("Error fetching users. Please try again later.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Filter users based on search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  // Handle user selection
  const handleUserClick = (user) => {
    onSelectUser(user);
  };

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} h-full`}>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearch}
        className={`w-full p-2 mb-4 rounded-lg border ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
      />

      {loading && <p className={`text-gray-500`}>Loading users...</p>}
      {error && <p className={`text-red-500`}>{error}</p>}

      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        {filteredUsers.map(u => (
          <div
            key={u.id}
            onClick={() => handleUserClick(u)}
            className={`flex items-center p-2 mb-2 cursor-pointer rounded-lg hover:bg-gray-200 ${darkMode ? 'hover:bg-gray-700' : ''}`}
          >
            {u.profilePic ? (
              <img src={u.profilePic} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500 mr-3 flex items-center justify-center text-white">
                {u.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
