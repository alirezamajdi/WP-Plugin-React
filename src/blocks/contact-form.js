import { registerBlockType } from "@wordpress/blocks";
import { useState } from "@wordpress/element";
import { TextControl } from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import TagList from "../components/blocks/taglist"; // Import the TagList component
import { Button } from "../components/ui/button";

const ContactSignupForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hobbies.length > 3) {
      setError("You can only select up to 3 hobbies.");
      return;
    }

    const response = await fetch(
      `${appLocalizer.apiUrl}/contact-signup/v1/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": appLocalizer.nonce,
        },
        body: JSON.stringify({
          name,
          address,
          phone,
          email,
          hobbies: hobbies.join(", "),
        }),
      }
    );

    if (!response.ok) {
      setError("Failed to submit the form.");
      setSuccess("");
    } else {
      setError("");
      setSuccess("Form submitted successfully!");
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setHobbies([]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextControl
          label="Name"
          value={name}
          onChange={(value) => setName(value)}
          required
        />
        <TextControl
          label="Address"
          value={address}
          onChange={(value) => setAddress(value)}
          required
        />
        <TextControl
          label="Phone"
          value={phone}
          onChange={(value) => setPhone(value)}
          required
        />
        <TextControl
          label="Email"
          value={email}
          onChange={(value) => setEmail(value)}
          type="email"
          required
        />
        <TagList hobbies={hobbies} setHobbies={setHobbies} />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <Button variant="default" type="submit">
          Sign Up
        </Button>
      </form>
    </>
  );
};

registerBlockType("contact-signup/form", {
  title: "Contact Signup Form",
  icon: "forms",
  category: "widgets",
  edit: ContactSignupForm,
  save: () => {
    return null;
  }, // The form content is managed via PHP for the front end
});
