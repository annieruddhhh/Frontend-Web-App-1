const API = "http://127.0.0.1:5000"

async function addHabit() {

    const name = document.getElementById("habit-name").value.trim()
    const category = document.getElementById("habit-category").value
    const frequency = document.getElementById("habit-frequency").value

    const errorMsg = document.getElementById("error-msg")
    const successMsg = document.getElementById("success-msg")

    errorMsg.textContent = ""
    successMsg.textContent = ""

    if (!name || !category || !frequency) {
        errorMsg.textContent = "Please fill all fields"
        return
    }

    const response = await fetch(API + "/habits", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: `
        {
            "name":"${name}",
            "category":"${category}",
            "frequency":"${frequency}"
        }
        `
    })

    if (!response.ok) {
        errorMsg.textContent = "Failed to add habit"
        return
    }

    successMsg.textContent = "Habit Added Successfully"

    document.getElementById("habit-name").value = ""
    document.getElementById("habit-category").value = ""
    document.getElementById("habit-frequency").value = ""
}