const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} = require("firebase/auth");
const { db, auth } = require("../config/firebase"); 
const { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc } = require("firebase/firestore");

const registerUser = async (req, res) => {
  const { email, password, userName, contact } = req.body;
  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log(user);
      

      const docRef = await addDoc(collection(db, "users", email , "profile"), {
        userName,
        email,
        contact
      });
      res.status(201).json({ message: "User registered successfully"});
  } catch (error) {
      res.status(400).json({ error: "Registration failed: " + error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
     res.status(201).json({
        message:"Logged in "
     })
      
  } catch (error) {
      res.status(400).json({ error: "Login failed: " + error.message });
  }
};

const getUsers = async (req, res) => {
  try {
      const querySnapshot = await getDocs(collection(db, "users" ));
      const data = querySnapshot.docs.map((doc) => ({
          id: doc.id.email,
          ...doc.data(),
      }));
      res.status(200).json({ data });
  } catch (error) {
      res.status(500).json({ error: "Error retrieving users: " + error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
      const userDocRef = doc(db, "users", id);
      await deleteDoc(userDocRef);
      res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
      res.status(500).json({ error: "Failed to delete user: " + error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { userName, contact, email } = req.body;

  if (!userName || !contact || !email) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, {
          userName,
          contact,
          email,
      });

      res.status(200).json({ message: "User successfully updated" });
  } catch (error) {
      res.status(500).json({ error: "Failed to update user: " + error.message });
  }
};

const sendResetLink = async (req, res) => {
  const { email } = req.body;
  try {
      await sendPasswordResetEmail(auth, email);
      res.status(200).json({ message: "Reset link sent! Check your email." });
  } catch (error) {
      res.status(400).json({ error: "Failed to send reset link: " + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  updateUser,
  sendResetLink,
};
