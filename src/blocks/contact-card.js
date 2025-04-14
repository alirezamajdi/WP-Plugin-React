import { registerBlockType } from "@wordpress/blocks";
import { InspectorControls } from "@wordpress/block-editor";
import { SelectControl, PanelBody } from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";

registerBlockType("contact-signup/block", {
  title: "Contact Signup Block",
  icon: "id",
  category: "widgets",
  attributes: {
    selectedContact: {
      type: "string", // Change from number to string
      default: "",
    },
  },
  edit: (props) => {
    const { attributes, setAttributes } = props;
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContactData, setSelectedContactData] = useState(null);

    useEffect(() => {
      const url = `${appLocalizer.apiUrl}/contact-signup/v1/contacts`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched Contacts:", data); // Debugging
          setContacts(data);
          setLoading(false);

          // Fetch data for the initially selected contact
          const initialContact = data.find(
            (contact) => contact.id === attributes.selectedContact
          );
          setSelectedContactData(initialContact || null);
          console.log("Initial Contact Data:", initialContact); // Debugging
        })
        .catch((error) => {
          console.error("Error fetching contacts:", error);
          setLoading(false);
        });
    }, []);

    useEffect(() => {
      if (contacts.length > 0) {
        const contact = contacts.find(
          (contact) => contact.id === attributes.selectedContact
        );
        setSelectedContactData(contact || null);
        console.log("Selected Contact Data Updated:", contact); // Debugging
      }
    }, [attributes.selectedContact, contacts]);

    const handleSelectChange = (selectedContact) => {
      setAttributes({ selectedContact });

      // Fetch the selected contact data
      const contact = contacts.find(
        (contact) => contact.id === selectedContact
      );
      setSelectedContactData(contact || null);
      console.log("Select Change - Contact ID:", selectedContact); // Debugging
      console.log("Select Change - Contact Data:", contact); // Debugging
    };

    const contactOptions = contacts.map((contact) => ({
      label: contact.name,
      value: contact.id,
    }));

    return (
      <>
        <InspectorControls>
          <PanelBody title="Contact Settings">
           
            {loading ? (
              <p>Loading contacts...</p>
            ) : contacts.length === 0 ? (
              <p>No contacts found.</p>
            ) : (
              <SelectControl
                label="Select a Contact"
                value={attributes.selectedContact}
                options={[
                  { label: "Select a contact", value: "" },
                  ...contactOptions,
                ]}
                onChange={handleSelectChange}
              />
            )}
          </PanelBody>
        </InspectorControls>
        <div className="contact-card-wrapper">
          {selectedContactData ? (
            <div className="contact-card">
              <h2>{selectedContactData.name}</h2>
              <p>Address: {selectedContactData.address}</p>
              <p>Phone: {selectedContactData.phone}</p>
              <p>Email: {selectedContactData.email}</p>
              <p>Hobbies: {selectedContactData.hobbies}</p>
            </div>
          ) : (
            <p>Select a contact to see details.</p>
          )}
        </div>
      </>
    );
  },
  save: () => {
    return null;
  },
});
