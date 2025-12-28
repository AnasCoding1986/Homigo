import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { uploadImage } from "../../../api/utils";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageText, setImageText] = useState("Choose an image");

  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // DAte range handler
  const handleDateRange = (item) => {
    console.log(item);

    setDates(item.selection);
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const name = file.name.split(".")[0];
    const shortName = name.length > 10 ? name.slice(0, 10) + "..." : name;

    setImageText(shortName);
  };

  // Use mutation Fn
  const { mutateAsync } = useMutation({
    mutationFn: async (roomData) => {
      const response = await axiosSecure.post("/rooms", roomData);
      return response.data;
    },
    onSuccess: () => {
      setLoading(false);
      toast.success("Room created successfully");
      navigate("/dashboard/my-listings");
      console.log("Room created successfully");
    },
  })

  // Handle Form Submit
  const handleSubmit = async (e) => {
  e.preventDefault();
setLoading(true);
  const form = e.target;
  const image = form.image.files[0];

  if (!image) {
    return alert("Please select an image");
  }

  const roomData = {
    location: form.location.value,
    category: form.category.value,
    title: form.title.value,
    from: dates.startDate.toISOString(),
    to: dates.endDate?.toISOString(),
    price: form.price.value,
    guest: form.total_guest.value,
    bathrooms: form.bathrooms.value,
    bedrooms: form.bedrooms.value,
    description: form.description.value,
    host: {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    },
  };

  try {
    const image_url = await uploadImage(image);
    roomData.image = image_url;
   await mutateAsync(roomData);
    console.table(roomData);
  } catch (error) {
    console.error("Room creation failed:", error);
    setLoading(false);
  }
};


  return (
    <div>
      <h1>Add Room</h1>

      <AddRoomForm
        dates={dates}
        handleDateRange={handleDateRange}
        handleSubmit={handleSubmit}
        setImagePreview={setImagePreview}
        imagePreview={imagePreview}
        setImageText={setImageText}
        imageText={imageText}
        handleImageUpload={handleImageUpload}
        loading={loading}
      ></AddRoomForm>
    </div>
  );
};

export default AddRoom;
