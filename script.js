function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value;

  if (task === "") return;

  const li = document.createElement("li");
  li.innerText = task;

  document.getElementById("taskList").appendChild(li);
  input.value = "";
}


const BASE_URL = "http://127.0.0.1:5000"                     //address of flask backend


window.onload = function () {
  loadHabits()
}

function loadHabits() {                                     // this function talks to flask and gets all habits
  fetch(BASE_URL + "/api/habits")


    .then(function (response) {                             // fetch returns a promise
      return response.json()
    })

    .then(function (habits) {                             // make habits as array
      displayHabits(habits)

      document.getElementById("total-habits").innerText = habits.length
    })

    .catch(function (error) {
      console.log("Error loading habits:", error)        //error in console
    })
}

function displayHabits(habits) {                            //html card of habits

  const container = document.getElementById("habits-container")

  container.innerHTML = ""

  if (habits.length === 0) {
    container.innerHTML = "<p style='color:#888; text-align:center;'>No habits yet. Add one above!</p>"
    return
  }


  for (let i = 0; i < habits.length; i++) {               // loop through each habit and create a card
    const habit = habits[i]

    const card = document.createElement("div")
    card.className = "habit-card"

    card.innerHTML = `
            <div class="card-top">
                <span class="habit-name">${habit.name}</span>
                <span class="badge badge-${habit.category}">${habit.category}</span>
            </div>
            <div class="card-meta">
                ${habit.frequency}
                <span class="streak-badge" id="streak-${habit.id}">0 day streak</span>
            </div>
            <div class="card-actions">
                <button class="btn-done" id="done-btn-${habit.id}" onclick="markDone(${habit.id})">Mark Done</button>
                <button class="btn-edit" onclick="editHabit(${habit.id}, '${habit.name}', '${habit.category}', '${habit.frequency}')">Edit</button>
                <button class="btn-delete" onclick="deleteHabit(${habit.id})">Delete</button>
            </div>
        `

    container.appendChild(card)

    loadStreak(habit.id)
  }
}