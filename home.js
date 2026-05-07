const API = "http://127.0.0.1:5000/habits"

async function loadHabits() {
    const container = document.getElementById("habits-container")
    try {
        const response = await fetch(API + "/habits")
        const habits = await response.json()
        container.innerHTML = ""

        if (habits.length === 0) {
            container.innerHTML = "<p style='color:#888; text-align:center;'>No habits yet. <a href='add-habit.html'>Add one</a></p>"
            return
        }

        showSummaryBar(habits)

        habits.forEach(function(habit) {
            const card = document.createElement("div")
            card.className = "habit-card"
            card.id = "card-" + habit.id
            card.innerHTML = "<div class='card-top'><span class='habit-name'>" + habit.name + "</span><span class='badge badge-" + habit.category + "'>" + habit.category + "</span></div><div class='card-meta'>" + habit.frequency + " <span class='streak-badge' id='streak-" + habit.id + "'>🔥 " + habit.streak + " day streak</span></div><div class='card-actions'><button onclick='markDone(" + habit.id + ")' id='done-btn-" + habit.id + "' class='btn-done " + (habit.done_today ? "active" : "") + "' " + (habit.done_today ? "disabled" : "") + ">" + (habit.done_today ? "✅ Done" : "Mark Done") + "</button><button onclick='showEdit(" + habit.id + ")' class='btn-edit'>Edit</button><button onclick='deleteHabit(" + habit.id + ")' class='btn-delete'>Delete</button></div><div id='edit-" + habit.id + "' class='hidden' style='margin-top:10px;display:flex;gap:8px;'><input type='text' id='edit-input-" + habit.id + "' value='" + habit.name + "' style='flex:1;padding:6px;background:#111;border:1px solid #333;color:#fff;border-radius:6px;'><button onclick='saveEdit(" + habit.id + ")' class='btn-edit'>Save</button><button onclick='hideEdit(" + habit.id + ")' class='btn-delete'>Cancel</button></div>"
            container.appendChild(card)
        })

    } catch(err) {
        container.innerHTML = "<p style='color:#f87171'>Could not load habits. Is Flask running?</p>"
    }
}

function showSummaryBar(habits) {
    let doneCount = 0
    let bestStreak = 0
    for (let i = 0; i < habits.length; i++) {
        if (habits[i].done_today) { doneCount = doneCount + 1 }
        if (habits[i].streak > bestStreak) { bestStreak = habits[i].streak }
    }
    document.getElementById("total-habits").textContent = habits.length
    document.getElementById("done-today").textContent = doneCount
    document.getElementById("best-streak").textContent = bestStreak
}

async function markDone(id) {
    const response = await fetch(API + "/habits/" + id + "/done", { method: "POST" })
    const data = await response.json()
    if (response.ok) {
        document.getElementById("done-btn-" + id).textContent = "✅ Done"
        document.getElementById("done-btn-" + id).disabled = true
        document.getElementById("done-btn-" + id).classList.add("active")
        document.getElementById("streak-" + id).textContent = "🔥 " + data.streak + " day streak"
    } else {
        alert(data.error)
    }
}

async function deleteHabit(id) {
    const sure = confirm("Delete this habit? This cannot be undone.")
    if (!sure) return
    const response = await fetch(API + "/habits/" + id, { method: "DELETE" })
    if (response.ok) {
        document.getElementById("card-" + id).remove()
        loadHabits()
    }
}

function showEdit(id) {
    document.getElementById("edit-" + id).classList.remove("hidden")
}

function hideEdit(id) {
    document.getElementById("edit-" + id).classList.add("hidden")
}

async function saveEdit(id) {
    const newName = document.getElementById("edit-input-" + id).value.trim()
    if (!newName) { alert("Name cannot be empty"); return }
    const response = await fetch(API + "/habits/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
    })
    if (response.ok) {
        hideEdit(id)
        loadHabits()
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById("search-bar")
    if (searchBar) {
        searchBar.addEventListener("input", function() {
            fetch(API + "/habits?q=" + searchBar.value)
            .then(function(r) { return r.json() })
            .then(function(habits) {
                const container = document.getElementById("habits-container")
                container.innerHTML = ""
                showSummaryBar(habits)
                habits.forEach(function(habit) {
                    const card = document.createElement("div")
                    card.className = "habit-card"
                    card.id = "card-" + habit.id
                    card.innerHTML = "<div class='card-top'><span class='habit-name'>" + habit.name + "</span></div><div class='card-actions'><button onclick='markDone(" + habit.id + ")' class='btn-done'>Mark Done</button><button onclick='deleteHabit(" + habit.id + ")' class='btn-delete'>Delete</button></div>"
                    container.appendChild(card)
                })
            })
        })
    }
})

loadHabits()