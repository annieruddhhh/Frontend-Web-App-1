async function addHabit() {

    // get values
    const name = document.getElementById("habit-name").value
    const category = document.getElementById("habit-category").value
    const frequency = document.getElementById("habit-frequency").value

    // message elements
    const errorMsg = document.getElementById("error-msg")
    const successMsg = document.getElementById("success-msg")

    // validation
    if (name == "") {
        errorMsg.textContent = "Enter habit name"
        return
    }

    if (category == "") {
        errorMsg.textContent = "Select category"
        return
    }

    if (frequency == "") {
        errorMsg.textContent = "Select frequency"
        return
    }

    // send data to flask
    const response = await fetch("http://localhost:5001/habits", {

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

    const data = await response.json()

    // success message
    successMsg.textContent = "Habit Added Successfully"

    // clear inputs
    document.getElementById("habit-name").value = ""
    document.getElementById("habit-category").value = ""
    document.getElementById("habit-frequency").value = ""

    console.log(data)

}