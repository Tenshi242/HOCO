if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}
const form = document.getElementById("student-form");
const tableBody = document.getElementById("student-table").getElementsByTagName("tbody")[0];
const exportBtn = document.getElementById("export-btn");
const searchInput = document.getElementById("search-name");
const searchIdInput = document.getElementById("search-id");

form.onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("student-name").value.trim();
  const id = document.getElementById("student-id").value.trim();
  const grade = document.getElementById("student-grade").value;
  const guest = document.getElementById("student-guest").value.trim();

  if (!/^\d{7}$/.test(id)) {
    alert("Student ID must be exactly 7 digits.");
    return;
  }

  const students = JSON.parse(localStorage.getItem("students") || "[]");
  students.push({ name, id, grade, guest });
  saveStudents(students);
  form.reset();
  loadStudents();
};

function saveStudents(data) {
  localStorage.setItem("students", JSON.stringify(data));
  loadStudents();
}

function loadStudents() {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  tableBody.innerHTML = "";
  students.forEach((student, index) => {
    const row = tableBody.insertRow();

    row.innerHTML = `
      <td>
        <span class="view-name">${student.name}</span>
        <input type="text" class="edit-name" value="${student.name}" style="display:none;">
      </td>
      <td>
        <span class="view-id">${student.id}</span>
        <input type="text" class="edit-id" value="${student.id}" style="display:none;">
      </td>
      <td>
        <span class="view-grade">${student.grade}</span>
        <select class="edit-grade" style="display:none;">
          <option ${student.grade === "Freshman" ? "selected" : ""}>Freshman</option>
          <option ${student.grade === "Sophomore" ? "selected" : ""}>Sophomore</option>
          <option ${student.grade === "Junior" ? "selected" : ""}>Junior</option>
          <option ${student.grade === "Senior" ? "selected" : ""}>Senior</option>
        </select>
      </td>
      <td>
        <button class="toggle-guest">View</button>
        <div class="guest-info" style="display:none; max-width: 300px;">${student.guest || "No guest info"}</div>
      </td>
      <td class="actions">
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="save-btn" data-index="${index}" style="display:none;">Save</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;
  });
}

tableBody.addEventListener("click", (e) => {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const row = e.target.closest("tr");
  const index = [...tableBody.rows].indexOf(row);

  if (e.target.classList.contains("edit-btn")) {
    toggleEditMode(row, true);
  }

  if (e.target.classList.contains("save-btn")) {
    const newName = row.querySelector(".edit-name").value.trim();
    const newId = row.querySelector(".edit-id").value.trim();
    const newGrade = row.querySelector(".edit-grade").value;
    const guestText = row.querySelector(".guest-info").textContent;

    if (!/^\d{7}$/.test(newId)) {
      alert("Student ID must be exactly 7 digits.");
      return;
    }

    students[index] = { name: newName, id: newId, grade: newGrade, guest: guestText };
    saveStudents(students);
  }

  if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      students.splice(index, 1);
      saveStudents(students);
    }
  }

  if (e.target.classList.contains("toggle-guest")) {
    const info = e.target.nextElementSibling;
    info.style.display = info.style.display === "none" ? "block" : "none";
    e.target.textContent = info.style.display === "block" ? "Hide" : "View";
  }
});

function toggleEditMode(row, editing) {
  row.querySelector(".edit-name").style.display = editing ? "inline-block" : "none";
  row.querySelector(".view-name").style.display = editing ? "none" : "inline-block";

  row.querySelector(".edit-id").style.display = editing ? "inline-block" : "none";
  row.querySelector(".view-id").style.display = editing ? "none" : "inline-block";

  row.querySelector(".edit-grade").style.display = editing ? "inline-block" : "none";
  row.querySelector(".view-grade").style.display = editing ? "none" : "inline-block";

  row.querySelector(".edit-btn").style.display = editing ? "none" : "inline-block";
  row.querySelector(".save-btn").style.display = editing ? "inline-block" : "none";
}

exportBtn.addEventListener("click", () => {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  let csvContent = "Name,ID,Grade,Guest Info\n";
  students.forEach(s => {
    csvContent += `"${s.name}","${s.id}","${s.grade}","${s.guest || ""}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "students.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

function filterStudents() {
  const nameSearch = searchInput.value.toLowerCase();
  const idSearch = searchIdInput.value.trim();

  const rows = tableBody.getElementsByTagName("tr");
  Array.from(rows).forEach(row => {
    const name = row.querySelector(".view-name").textContent.toLowerCase();
    const id = row.querySelector(".view-id").textContent;
    const matchesName = name.includes(nameSearch);
    const matchesId = id.includes(idSearch);
    row.style.display = matchesName && matchesId ? "" : "none";
  });
}

searchInput.addEventListener("input", filterStudents);
searchIdInput.addEventListener("input", filterStudents);

// Initial load
loadStudents();

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}
