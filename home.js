const API = "http://localhost:5000";


// Called when page loads - fetches all habits from Flask
async function loadHabits() {
    const container = document.getElementById("habits-container");

    try {
        const response = await fetch(API + "/habits");
        const habits = await response.json();

        container.innerHTML = ""; // clear loading text

        // Empty state - better message with link
        if (habits.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <p class="empty-icon">📋</p>
          <p class="empty-title">No habits yet</p>
          <p class="empty-sub">Start building good habits today.</p>
          <a href="add-habit.html" class="empty-btn">+ Add your first habit</a>
        </div>
      `;
            return;
        }

        // Fill the summary bar at top
        showSummaryBar(habits);

        // DOM manipulation - build a card for each habit
        habits.forEach(function (habit) {
            const card = document.createElement("div");
            card.className = "habit-card";
            card.id = "card-" + habit.id;

            // Work out last done text to show under streak
            const lastDoneText = getLastDoneText(habit.last_done);

            card.innerHTML = `
        <div class="habit-info">
          <h3 id="name-${habit.id}">${habit.name}</h3>
          <span class="streak" id="streak-${habit.id}">🔥 ${habit.streak} day streak</span>
          <span class="last-done" id="lastdone-${habit.id}">${lastDoneText}</span>
        </div>
 
        <div class="btn-group">
          <button onclick="markDone(${habit.id})" id="done-btn-${habit.id}"
            ${habit.done_today ? "disabled class='done-btn done'" : "class='done-btn'"}>
            ${habit.done_today ? "✅ Done" : "Mark Done"}
          </button>
 
          <button onclick="showEdit(${habit.id})" class="edit-btn">Edit</button>
          <button onclick="deleteHabit(${habit.id}, '${habit.name}')" class="delete-btn">Delete</button>
          <button onclick="showSuggestions(${habit.id}, '${habit.name}')" class="suggest-btn">💡 Tips</button>
        </div>
 
        <div id="edit-${habit.id}" class="edit-box hidden">
          <input type="text" id="edit-input-${habit.id}" value="${habit.name}">
          <button onclick="saveEdit(${habit.id})">Save</button>
          <button onclick="hideEdit(${habit.id})">Cancel</button>
        </div>
 
        <div id="tips-${habit.id}" class="tips-box hidden"></div>
      `;

            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = "<p style='color:#f87171'>Could not load habits. Is Flask running?</p>";
    }
}


// Shows summary bar - total habits, done today, best streak
function showSummaryBar(habits) {
    const bar = document.getElementById("summary-bar");
    bar.classList.remove("hidden");

    let doneCount = 0;
    let bestStreak = 0;

    for (let i = 0; i < habits.length; i++) {
        if (habits[i].done_today) {
            doneCount = doneCount + 1;
        }
        if (habits[i].streak > bestStreak) {
            bestStreak = habits[i].streak;
        }
    }

    document.getElementById("summary-total").textContent = habits.length + " habits tracked";
    document.getElementById("summary-done").textContent = doneCount + " done today";
    document.getElementById("summary-streak").textContent = "🔥 best streak " + bestStreak;
}


// Returns a human readable last done text
function getLastDoneText(lastDone) {
    if (!lastDone) {
        return "Never done yet";
    }

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (lastDone === today) {
        return "Last done: Today";
    } else if (lastDone === yesterday) {
        return "Last done: Yesterday";
    } else {
        return "Last done: " + lastDone;
    }
}


// Mark a habit as done - calls POST /habits/<id>/done
async function markDone(id) {
    const response = await fetch(API + "/habits/" + id + "/done", { method: "POST" });
    const data = await response.json();

    if (response.ok) {
        // Update just those elements on page - no full reload needed
        document.getElementById("done-btn-" + id).textContent = "✅ Done";
        document.getElementById("done-btn-" + id).disabled = true;
        document.getElementById("done-btn-" + id).classList.add("done");
        document.getElementById("streak-" + id).textContent = "🔥 " + data.streak + " day streak";
        document.getElementById("lastdone-" + id).textContent = "Last done: Today";
    } else {
        alert(data.error);
    }
}


// Delete a habit - calls DELETE /habits/<id>
// Now shows habit name in the confirm message
async function deleteHabit(id, habitName) {
    const sure = confirm("Delete '" + habitName + "'? This cannot be undone.");
    if (!sure) return;

    const response = await fetch(API + "/habits/" + id, { method: "DELETE" });

    if (response.ok) {
        // Remove the card from DOM
        const card = document.getElementById("card-" + id);
        card.remove();
    } else {
        alert("Could not delete.");
    }
}


// Show the edit input box for a habit
function showEdit(id) {
    document.getElementById("edit-" + id).classList.remove("hidden");
}

function hideEdit(id) {
    document.getElementById("edit-" + id).classList.add("hidden");
}


// Save the edited name - calls PUT /habits/<id>
async function saveEdit(id) {
    const newName = document.getElementById("edit-input-" + id).value.trim();

    if (!newName) {
        alert("Name cannot be empty");
        return;
    }

    const response = await fetch(API + "/habits/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("name-" + id).textContent = data.name;
        hideEdit(id);
    } else {
        alert(data.error);
    }
}


// Show hardcoded suggestions when habit is clicked
function showSuggestions(id, habitName) {
    const tipsBox = document.getElementById("tips-" + id);

    // If already open, close it
    if (!tipsBox.classList.contains("hidden")) {
        tipsBox.classList.add("hidden");
        return;
    }

    // Pick tips based on habit name - simple if/else checks
    const nameLower = habitName.toLowerCase();
    let tips = [];

    if (nameLower.includes("water") || nameLower.includes("drink")) {
        tips = ["Drink a glass after waking up", "Carry a bottle with you", "Set reminders every 2 hours"];
    } else if (nameLower.includes("read") || nameLower.includes("book")) {
        tips = ["Read before bed", "Keep the book on your desk", "Read during lunch break"];
    } else if (nameLower.includes("walk") || nameLower.includes("steps")) {
        tips = ["Walk after dinner", "Take stairs instead of lift", "Walk to the nearby shop"];
    } else if (nameLower.includes("exercise") || nameLower.includes("gym")) {
        tips = ["Do 10 push-ups in morning", "Stretch for 5 mins", "Go for a 20 min jog"];
    } else if (nameLower.includes("sleep")) {
        tips = ["Sleep by 11pm", "No phone 30 mins before bed", "Keep room dark and cool"];
    } else {
        tips = ["Be consistent every day", "Start small", "Track your progress"];
    }

    // Build the tips list and show it
    let html = "<strong>💡 Tips:</strong><ul>";
    for (let i = 0; i < tips.length; i++) {
        html = html + "<li>" + tips[i] + "</li>";
    }
    html = html + "</ul>";

    tipsBox.innerHTML = html;
    tipsBox.classList.remove("hidden");
}


// Load habits when page opens
loadHabits();