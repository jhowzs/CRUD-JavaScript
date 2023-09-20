const modal = document.querySelector(".modal-container");
const openModal = document.querySelector("[data-initModal]");
const btnCloseModal = document.querySelector(".btn-close-modal");
const tbody = document.querySelector("tbody");
const modalName = document.querySelector("#modal-name");
const modalFunction = document.querySelector("#modal-function");
const modalSalary = document.querySelector("#modal-salary");
const btnSave = document.querySelector("#btnSave");

// modal
function initOpenModal() {
  modal.classList.add("active");
}

function leaveModal() {
  modal.classList.remove("active");
  clearFields();
}

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_user")) ?? [];
const setLocalStorage = (dbUser) =>
  localStorage.setItem("db_user", JSON.stringify(dbUser));

// CRUD - Create Read Update Delete
const deleteUser = (index) => {
  const dbUser = readUser();
  dbUser.splice(index, 1);
  setLocalStorage(dbUser);
};

const updateUser = (index, user) => {
  const dbUser = readUser();
  dbUser[index] = user;
  setLocalStorage(dbUser);
};

const readUser = () => getLocalStorage();

const createUser = (user) => {
  const dbUser = getLocalStorage();
  dbUser.push(user);
  setLocalStorage(dbUser);
};

const isValidFields = () => {
  return document.querySelector("#form").reportValidity();
};

// Interação com o layout
const clearFields = () => {
  const fields = document.querySelectorAll("form input");
  fields.forEach((field) => (field.value = ""));
};

const saveUser = () => {
  if (isValidFields()) {
    const user = {
      nome: modalName.value,
      funcao: modalFunction.value,
      salario: modalSalary.value,
    };
    const index = modalName.dataset.index;
    if (index == "new") {
      createUser(user);
      updateTable();
    } else {
      updateUser(index, user);
      updateTable();
    }
  }
};

const createRow = (user, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
  <td>${user.nome}</td>
  <td>${user.funcao}</td>
  <td>${user.salario}</td>
  <td id="btn-body">
  <button class="btn btn-edit" type="button" id="edit-${index}">editar</button>
  </td>
  <td>
  <button class="btn btn-delete" type="button" id="delete-${index}">deletar</button>
  </td>
`;
  document.querySelector("#tableUser>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbUser = readUser();
  clearTable();
  dbUser.forEach(createRow);
};
updateTable();

const fillFields = (user) => {
  modalName.value = user.nome;
  modalFunction.value = user.funcao;
  modalSalary.value = user.salario;
  modalName.dataset.index = user.index;
};

const editUser = (index) => {
  const user = readUser()[index];
  user.index = index;
  fillFields(user);
  initOpenModal();
};

const editDelete = (e) => {
  if (e.target.type == "button") {
    const [action, index] = e.target.id.split("-");
    if (action == "edit") {
      editUser(index);
    } else {
      const user = readUser()[index];
      const response = confirm(
        `Deseja realmente excluir o usuário ${user.nome}`
      );
      if (response) {
        deleteUser(index);
        updateTable();
      }
    }
  }
};

// Events
openModal.addEventListener("click", initOpenModal);
btnCloseModal.addEventListener("click", leaveModal);
btnSave.addEventListener("click", saveUser);
tbody.addEventListener("click", editDelete);
