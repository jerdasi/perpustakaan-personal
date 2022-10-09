const RENDER_EVENT = "render-buku";
const STORAGE_KEY = "ALL_BOOKS";

const TITLE_MODAL_ADD = "Tambahkan Buku";
const TITLE_MODAL_EDIT = "Edit Buku";

// Data
let data = [];
let selectedOnEdit = -1;

// Filter
const filterInputNama = document.getElementById("nama-buku");
const filterSelectTipe = document.getElementById("tipe-buku");
const filterButton = document.querySelector(".tools-filter");
const resetButton = document.querySelector(".tools-reset");

// Modal
const buttonToggleModal = document.querySelector(".show-modal");
const closeButtonToggleModal = document.querySelector(".close-button");
const modalTambahBuku = document.querySelector(".modal-overlay");
const modalHeader = modalTambahBuku.querySelector(".modal-header h1");
const inputNama = document.getElementById("input-nama-buku");
const inputJudul = document.getElementById("input-judul-buku");
const inputPenulis = document.getElementById("input-penulis-buku");
const inputTahun = document.getElementById("input-terbit-buku");
const inputStatusBaca = document.getElementById("input-selesai-buku");
const buttonSimpan = document.getElementById("button-simpan-buku");
const buttonEdit = document.getElementById("button-edit-buku");

// Notification
const notification = document.querySelector(".notification-container");
const closeNotification = document.querySelector(".close-notification");

// Content Container
const mainContainer = document.querySelector(".content-wrapper");

// Function for Checking Compatibel of Storage
const isStorageExist = () => {
  if (typeof Storage === undefined) {
    showNotification({
      headerMsg: "Gagal Mengambil Data! ",
      bodyMsg: "Browser kamu tidak mendukung local storage",
    });
    return false;
  }
  return true;
};

// Checking Field Form Value
const checkingFormValue = () => {
  if (inputJudul.value && inputPenulis.value && inputTahun.value) {
    return true;
  }
  return false;
};

// Function for showNotificaton for 5s
const showNotification = ({ headerMsg = "", bodyMsg = "" }) => {
  notification.querySelector(".notification-container-header h1").innerText =
    headerMsg;
  notification.querySelector(".notification-container-body p").innerText =
    bodyMsg;
  notification.classList.remove("hidden");
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 5000);
};

// Event for hiddenNotification by Click
closeNotification.addEventListener("click", () => {
  selectedOnEdit = -1;
  notification.classList.add("hidden");
});

// Function for Show Modal For Add Book
const toggleModalTambahBuku = () => {
  clearModalTambahBuku();
  const classTambah = modalTambahBuku.classList.contains("hidden")
    ? ""
    : "hidden";
  classTambah
    ? modalTambahBuku.classList.add(classTambah)
    : modalTambahBuku.classList.remove("hidden");
};

// Function for clear Field in Modal
const clearModalTambahBuku = () => {
  selectedOnEdit = -1;
  inputJudul.value = inputPenulis.value = "";
  inputTahun.value = 2022;
  inputStatusBaca.checked = false;
};

// Function for clear filter
const clearFilter = () => {
  filterInputNama.value = "";
  filterSelectTipe.value = 0;
};

// Function to Filter Book by Name or By Status
const filterBuku = () => {
  getDataFromStorage();

  let status = filterSelectTipe.value == 1 ? false : true;

  if (filterInputNama.value && filterSelectTipe.value != 0) {
    data = data.filter(
      (item) =>
        item.isComplete == status &&
        item.title.toLowerCase().includes(filterInputNama.value.toLowerCase())
    );
  } else {
    if (filterInputNama.value) {
      data = data.filter((item) =>
        item.title.toLowerCase().includes(filterInputNama.value.toLowerCase())
      );
    } else if (filterSelectTipe.value != 0) {
      data = data.filter((item) => item.isComplete == status);
    } else {
      data = [...data];
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

// Function to Save in LocalStorage
const saveDataToStorage = () => {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
};

// Function to Get Data From Local Storage
const getDataFromStorage = () => {
  if (isStorageExist()) {
    let result = localStorage.getItem(STORAGE_KEY);
    result = JSON.parse(result);

    data = result ? result : [];
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
};

// Function for show Edit Book and Show Modal to Edit
const tampilkanBuku = (indexBuku) => {
  modalHeader.innerText = TITLE_MODAL_EDIT;
  buttonSimpan.classList.add("hidden");
  buttonEdit.classList.remove("hidden");

  selectedOnEdit = indexBuku;

  toggleModalTambahBuku();
  const { title, author, year, isComplete } = data[indexBuku];
  inputJudul.value = title;
  inputPenulis.value = author;
  inputTahun.value = year;
  inputStatusBaca.checked = isComplete;
};

// Function for add Book to Data
const tambahBuku = () => {
  try {
    let book = {
      id: +new Date(),
      title: inputJudul.value,
      author: inputPenulis.value,
      year: inputTahun.value,
      isComplete: inputStatusBaca.checked,
    };
    data.push(book);
    saveDataToStorage();
    toggleModalTambahBuku();
    showNotification({
      headerMsg: "Berhasil Menambah!",
      bodyMsg: "Berhasil Menambah Informasi Buku",
    });
  } catch (err) {
    showNotification({
      headerMsg: "Gagal Menambah!",
      bodyMsg: err.message,
    });
  }
};

const editBuku = () => {
  try {
    let book = data[selectedOnEdit];
    book.title = inputJudul.value;
    book.author = inputPenulis.value;
    book.year = inputTahun.value;
    book.isComplete = inputStatusBaca.checked;

    data[selectedOnEdit] = book;
    saveDataToStorage();
    toggleModalTambahBuku();
    showNotification({
      headerMsg: "Berhasil Mengedit!",
      bodyMsg: "Berhasil Mengedit Informasi Buku",
    });
  } catch (err) {
    showNotification({
      headerMsg: "Gagal Mengedit!",
      bodyMsg: err.message,
    });
  }
};

const hapusBuku = (indexBuku) => {
  try {
    let buku = [...data];
    buku.splice(indexBuku, 1);
    data = [...buku];
    saveDataToStorage();
    showNotification({
      headerMsg: "Berhasil Menghapus!",
      bodyMsg: "Berhasil Mengapus 1 Buku!",
    });
  } catch (err) {
    showNotification({
      headerMsg: "Gagal Menghapus!",
      bodyMsg: err.message,
    });
  }
};

document.addEventListener(RENDER_EVENT, () => {
  mainContainer.innerHTML = "";

  if (data.length) {
    mainContainer.classList.add("grid");
    for (let item of data) {
      let template = `
          <div class="card border">
              <img src="./assets/image/book-placeholder.jpg" alt="book-image" class="h-[150px] w-full object-cover">
              <div class="card-description p-2">
                  <p class="font-medium">${item.title}</p>
                  <p class="">${item.author} - ${item.year}</p>
                  <div class="description-details flex">
                      <div class="p-2 bg-${
                        item.isComplete ? "green" : "red"
                      }-500 border rounded text-white">${
        item.isComplete ? "Selesai" : "Belum Selesai"
      }</div>
                      <div class="card-tools ml-auto">
                        <button class="button-edit bg-blue-600 border rounded text-white p-2">
                          <i class="fa fa-pencil"></i>
                        </button>
                        <button class="button-delete bg-red-600 border rounded text-white p-2">
                            <i class="fa fa-trash"></i>
                        </button>
                            </div>
                        </div>
              </div>
          </div>
          `;
      mainContainer.insertAdjacentHTML("beforeend", template);
    }

    // Register All Button Delete Event Listener in Card Book
    document.querySelectorAll(".button-delete").forEach((item, index) => {
      item.addEventListener("click", (ev) => {
        ev.preventDefault();
        hapusBuku(index);
      });
    });

    // Register All Button Edit Event Listener in Card Book
    document.querySelectorAll(".button-edit").forEach((item, index) => {
      item.addEventListener("click", (ev) => {
        ev.preventDefault();
        tampilkanBuku(index);
      });
    });
  } else {
    mainContainer.classList.remove("grid");
    mainContainer.innerHTML =
      "<div class='flex flex-col items-center justify-center'><img src='./assets/image/no-data-placeholder.jpg' class='h-72 object-cover'/><h1 class='font-bold text-center'>Tidak ada Buku yang disimpan</h1></div>";
  }
});

// Function on Click Event to Filter Data based on Criteria
filterButton.addEventListener("click", filterBuku);

// Function on Click Event to Reset Criteria Filter to Default
resetButton.addEventListener("click", () => {
  clearFilter();
  getDataFromStorage();
});

// Add Event Listener to Button "Tambahkan Buku"
buttonToggleModal.addEventListener("click", () => {
  modalHeader.innerText = TITLE_MODAL_ADD;
  buttonSimpan.classList.remove("hidden");
  buttonEdit.classList.add("hidden");
  toggleModalTambahBuku();
});

// Function for close Modal
closeButtonToggleModal.addEventListener("click", () => {
  toggleModalTambahBuku();
});

// Register Button Simpan Listener
buttonSimpan.addEventListener("click", () => {
  if (checkingFormValue()) {
    tambahBuku();
  } else {
    showNotification({
      headerMsg: "Gagal Menambah Data",
      bodyMsg: "Harap lengkapi Informasi yang dibutuhkan!",
    });
  }
});

// Register Button Edit Listener
buttonEdit.addEventListener("click", () => {
  if (checkingFormValue()) {
    editBuku();
  } else {
    showNotification({
      headerMsg: "Gagal Menambah Data",
      bodyMsg: "Harap lengkapi Informasi yang dibutuhkan!",
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getDataFromStorage();
});
