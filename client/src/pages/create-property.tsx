import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";

import Form from "../components/common/Form";
import { useNavigate } from "react-router-dom";

const CreateProperty = () => {
  const navigate = useNavigate();

  // Get user information using the useGetIdentity hook
  const { data: user } = useGetIdentity();

  // State for managing property image information
  const [propertyImage, setPropertyImage] = useState({
    name: "",
    url: "",
  });

  // Initialize the react-hook-form and destructure required methods
  const {
    refineCore: { onFinish, formLoading }, // Some form-related properties from refineCore
    register, // Function to register form inputs
    handleSubmit, // Function to handle form submission
  } = useForm();

  // Function to handle changes in the property image
  const handleImageChange = (file: File) => {
    const reader = (readFile: File) =>
      new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });

    // Read the selected file and update the propertyImage state
    reader(file).then((result: string) =>
      setPropertyImage({ name: file?.name, url: result })
    );
  };

  // Function to handle form submission
  const onFinishHandler = async (data: FieldValues) => {
    // Check if a property image has been selected
    if (!propertyImage.name) return alert("Please select an image");

    // If an image is selected, call the onFinish function with form data, image URL, and user email
    await onFinish({ ...data, photo: propertyImage.url, email: user.email });
  };

  // Render the Form component with required props
  return (
    <Form
      type="Create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      propertyImage={propertyImage}
    />
  );
};

export default CreateProperty;
