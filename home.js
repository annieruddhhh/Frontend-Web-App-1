const API = "http://127.0.0.1:5000"

async function loadHabits() {

    const container = document.getElementById("habits-container")

    const response = await fetch(API + "/habits")

    const habits = await response.json()

    container.innerHTML = ""

    document.getElementById("total-habits").textContent = habits.length

    let done = 0
    let best = 0

    for (let i = 0; i < habits.length; i++) {

        if (habits[i].done_today) {
            done++
        }

        if (habits[i].streak > best) {
            best = habits[i].streak
        }

        const card = document.createElement("div")

        card.className = "habit-card"

        card.innerHTML = `
            <h3>${habits[i].name}</h3>

            <p>${habits[i].category}</p>

            <p>${habits[i].frequency}</p>

            <p>🔥 ${habits[i].streak} day streak</p>

            <button onclick="markDone(${habits[i].id})">
                ${habits[i].done_today ? "✅ Done" : "Mark Done"}
            </button>

            <button onclick="deleteHabit(${habits[i].id})">
                Delete
            </button>
        `

        container.appendChild(card)
    }

    document.getElementById("done-today").textContent = done
    document.getElementById("best-streak").textContent = best

    if (habits.length == 0) {
        container.innerHTML = "<p>No habits yet</p>"
    }
}

async function markDone(id) {

    await fetch(API + "/habits/" + id + "/done", {
        method: "POST"
    })

    loadHabits()
}

async function deleteHabit(id) {

    await fetch(API + "/habits/" + id, {
        method: "DELETE"
    })

    loadHabits()
}

loadHabits()