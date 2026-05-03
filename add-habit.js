async function addHabit() {
    const nameInput = document.getElementById("habit-name")
    const categoryInput = document.getElementById("habit-category")
    const frequencyInput = document.getElementById("habit-frequency")
    const errorMsg = document.getElementById("error-msg")
    const successMsg = document.getElementById("success-msg")
    const btn = document.getElementById("add-btn")

    const name = nameInput.value.trim()
    const category = categoryInput.value
    const frequency = frequencyInput.value

    // frontend validation
    if (!name) {
        errorMsg.textContent = "Please enter a habit name."
        errorMsg.classList.remove("hidden")
        return
    }
    if (!category) {
        errorMsg.textContent = "Please select a category."
        errorMsg.classList.remove("hidden")
        return
    }
    if (!frequency) {
        errorMsg.textContent = "Please select a frequency."
        errorMsg.classList.remove("hidden")
        return
    }

    errorMsg.classList.add("hidden")

    // disable button while sending
    btn.disabled = true
    btn.textContent = "Adding..."

    try {
        const response = await fetch("http://localhost:5001/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                category: category,
                frequency: frequency
            })
        })

        const data = await response.json()

        if (response.ok) {
            // clear all fields
            nameInput.value = ""
            categoryInput.value = ""
            frequencyInput.value = ""

            // show success message
            successMsg.classList.remove("hidden")
            btn.textContent = "Add Habit"
            btn.disabled = false

        } else {
            errorMsg.textContent = data.error
            errorMsg.classList.remove("hidden")
            btn.textContent = "Add Habit"
            btn.disabled = false
        }

    } catch (err) {
        errorMsg.textContent = "Cannot connect to Flask. Make sure it is running."
        errorMsg.classList.remove("hidden")
        btn.textContent = "Add Habit"
        btn.disabled = false
    }
}