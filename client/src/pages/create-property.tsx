import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";

import Form from "../components/common/Form";

const CreateProperty = () => {
  // Get the user's email using useGetIdentity from refinedev/core
  const { data } = useGetIdentity<{
    email: string;
  }>();
  const userEmail = data?.email; // Extract the email from the data (if available)

  // State to manage the selected property image
  const [propertyImage, setPropertyImage] = useState({ name: "", url: "" });

  // Initialize useForm to handle form state and validation
  const {
    refineCore: { onFinish, formLoading }, // Some form-related properties from refineCore
    register, // Function to register form inputs
    handleSubmit, // Function to handle form submission
  } = useForm();

  // Function to handle image selection and conversion to base64 URL
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
    // Check if an image has been selected
    if (!propertyImage.name) return alert("Please select an image");

    // If an image is selected, call the onFinish function with form data, image URL, and user email
    await onFinish({ ...data, photo: propertyImage.url, email: userEmail });
  };

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
