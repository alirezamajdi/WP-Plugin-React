import React from "react";
import { createRoot } from "react-dom/client";
import ContactList from "./pages/contact/index";
import AddContact from "./pages/contact/add";
import SettingContact from "./pages/contact/setting";

interface Route {
  [key: string]: React.ComponentType;
}

const routes: Route = {
  "contactSignup-list-contact": ContactList,
  "contactSignup-add-contact": AddContact,
  "contactSignup-settings": SettingContact,
};

document.addEventListener("DOMContentLoaded", () => {
  Object.entries(routes).forEach(([id, Component]) => {
    const el = document.getElementById(id);
    if (el) {
      const root = createRoot(el);
      root.render(<Component />);
    }
  });
});
