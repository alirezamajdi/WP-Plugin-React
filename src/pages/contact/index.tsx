import React from "react";
import { useState, useEffect } from "@wordpress/element";

interface Contact {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  hobbies: string;
}

interface AppLocalizer {
  apiUrl: string;
  nonce: string;
}

declare const appLocalizer: AppLocalizer;

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const url = `${appLocalizer.apiUrl}/contact-signup/v1/contacts`;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data: Contact[] = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const deleteContact = async (id: number): Promise<void> => {
    const deleteUrl = `${appLocalizer.apiUrl}/contact-signup/v1/contact/${id}`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": appLocalizer.nonce,
        },
      });

      if (response.ok) {
        setContacts(contacts.filter((contact) => contact.id !== id));
      } else {
        console.error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h2>Contact Info</h2>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Hobbies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.address}</td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                <td>{contact.hobbies}</td>
                <td>
                  <button onClick={() => deleteContact(contact.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
