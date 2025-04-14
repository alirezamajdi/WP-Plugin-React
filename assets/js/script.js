document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-signup-form");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector("#contact_name").value;
    const address = form.querySelector("#contact_address").value;
    const phone = form.querySelector("#contact_phone").value;
    const email = form.querySelector("#contact_email").value;
    const hobbies = Array.from(form.querySelectorAll(".selected-hobby")).map(
      (span) => span.textContent.trim()
    );

    if (hobbies.length > 3) {
      alert("You can only select up to 3 hobbies.");
      return;
    }

    const response = await fetch(form.dataset.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": form.dataset.nonce,
      },
      body: JSON.stringify({
        name,
        address,
        phone,
        email,
        hobbies: hobbies.join(", "),
      }),
    });

    if (!response.ok) {
      alert("Failed to submit the form.");
    } else {
      alert("Form submitted successfully!");
      form.reset();
      clearSelectedHobbies(); // Clear selected hobbies
    }
  });

  const tagInput = form.querySelector("#contact_hobbies");
  const tagList = form.querySelector(".tag-list");
  const predefinedHobbies = JSON.parse(form.dataset.predefinedHobbies);

  tagInput.addEventListener("focus", function () {
    updateTagList("");
    showTagList();
  });

  tagInput.addEventListener("blur", function () {
    setTimeout(() => hideTagList(), 200); // Delay to allow click events to process
  });

  tagInput.addEventListener("input", function () {
    updateTagList(tagInput.value);
  });

  tagInput.addEventListener("keydown", function (e) {
    if (e.key === "Backspace" && !tagInput.value) {
      const lastHobby = tagInput.parentElement.querySelector(
        ".selected-hobby:last-child"
      );
      if (lastHobby) {
        lastHobby.remove();
      }
    }
  });

  function updateTagList(value) {
    tagList.innerHTML = "";
    const filteredHobbies = predefinedHobbies.filter(
      (hobby) =>
        hobby.toLowerCase().includes(value.toLowerCase()) &&
        !Array.from(
          tagInput.parentElement.querySelectorAll(".selected-hobby")
        ).some((child) => child.textContent === hobby)
    );

    filteredHobbies.forEach((hobby) => {
      const li = document.createElement("li");
      li.textContent = hobby;
      li.addEventListener("click", function () {
        addHobby(hobby);
      });
      tagList.appendChild(li);
    });
  }

  function addHobby(hobby) {
    const existingHobbies = Array.from(
      tagInput.parentElement.querySelectorAll(".selected-hobby")
    ).map((span) => span.textContent.trim());
    if (existingHobbies.length < 3 && !existingHobbies.includes(hobby)) {
      const span = document.createElement("span");
      span.className = "selected-hobby";
      span.textContent = hobby;
      const removeButton = document.createElement("button");
      removeButton.textContent = "x";
      removeButton.addEventListener("click", function () {
        span.remove();
      });
      span.appendChild(removeButton);
      tagInput.parentElement.insertBefore(span, tagInput);
      tagInput.value = "";
      hideTagList();
    }
  }

  function clearSelectedHobbies() {
    const selectedHobbies =
      tagInput.parentElement.querySelectorAll(".selected-hobby");
    selectedHobbies.forEach((hobby) => hobby.remove());
  }

  function showTagList() {
    tagList.style.display = "block";
  }

  function hideTagList() {
    tagList.style.display = "none";
  }
});
