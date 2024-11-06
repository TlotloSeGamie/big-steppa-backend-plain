const { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } = require("firebase/firestore");
const { db } = require("../config/firebase");
const { storage } = require("firebase/storage");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { v4: uuidv4 } = require("uuid"); 


const addShoe = async (req, res) => {
    const { brand, name, size, color, price } = req.body;
    const { image } = req.file; 

    try {
        const imageRef = ref(storage, `shoe_images/${uuidv4()}_${image.originalname}`);
        const uploadResult = await uploadBytes(imageRef, image.buffer);
        const imageUrl = await getDownloadURL(uploadResult.ref);

        await addDoc(collection(db, "shoe"), {
            brand,
            name,
            size,
            color,
            price,
            imageUrl
        });

        res.json({
            message: "Added Successfully",
        });
    } catch (error) {
        console.log("Adding shoe error", error);
        res.status(500).json({ message: "Error adding shoe", error });
    }
};


const getShoe = async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "shoe"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.json({
        data: data
      });
    } catch (error) {
      console.log("Error in getting shoe", error);
    }
  };
  

const deleteShoe = async (req, res) => {
    try {
        const { id } =req.params;
        const shoeDocRef = doc(db, "shoe", id);
        await deleteDoc(shoeDocRef);
        res.json({
            message: "Shoe deleted successfully",
        });
    } catch (error) {
        console.log("Error in deleting shoe", error);        
    }
};

const updateShoe = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, name, size, color, price } = req.body;
        if (!brand || !name || !size || !color || !price) {
            return res.status(400).json({ message: "All fields are required"});
        }

        const shoeDocRef = doc(db, "shoe", id);

        await updateDoc(shoeDocRef, {
            brand,
            name,
            size,
            color,
            price
        });

        res.json({
            message: "Shoe updated successfully"
        });
    } catch (error) {
        console.error("Error in updating shoe:", error.message);
        res.status(500).json({error: "Failed to update shoe"});
    }
};

module.exports = {
    addShoe,
    getShoe,
    deleteShoe,
    updateShoe
}