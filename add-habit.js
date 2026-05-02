// Called when Add Habit button is clicked
async function addHabit() {
    const nameInput = document.getElementById("habit-name");
    const errorMsg = document.getElementById("error-msg");
    const successMsg = document.getElementById("success-msg");
    const btn = document.getElementById("add-btn");

    const name = nameInput.value.trim();

    // Frontend validation - check before even calling API
    if (!name) {
        errorMsg.textContent = "Please enter a habit name.";
        errorMsg.classList.remove("hidden");
        return;
    }

    errorMsg.classList.add("hidden");

    // Disable button while request is happening so user can't click twice
    btn.disabled = true;
    btn.textContent = "Adding...";

    try {
        // Send POST request to Flask with habit name as JSON
        const response = await fetch("http://localhost:5000/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name })
        });

        const data = await response.json();

        if (response.ok) {
            nameInput.value = "";                        // clear input
            successMsg.classList.remove("hidden");       // show success message
            btn.textContent = "Add Habit";
            btn.disabled = false;
        } else {
            errorMsg.textContent = data.error;
            errorMsg.classList.remove("hidden");
            btn.textContent = "Add Habit";
            btn.disabled = false;
        }

    } catch (err) {
        errorMsg.textContent = "Cannot connect to Flask. Make sure it is running.";
        errorMsg.classList.remove("hidden");
        btn.textContent = "Add Habit";
        btn.disabled = false;
    }
}