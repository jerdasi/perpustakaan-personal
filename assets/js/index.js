const RENDER_EVENT = "render-buku";
const STORAGE_KEY = "ALL_BOOKS";

// Data
let data = [];

// Filter
const filterInputNama = document.getElementById("nama-buku");
const filterSelectTipe = document.getElementById("tipe-buku");
const filterButton = document.querySelector(".tools-filter");
const resetButton = document.querySelector(".tools-reset");

// Modal
const buttonToggleModal = document.querySelector(".show-modal");
const closeButtonToggleModal = document.querySelector(".close-button");
const modalTambahBuku = document.querySelector(".modal-overlay");
const inputNama = document.getElementById("input-nama-buku");
const inputJudul = document.getElementById("input-judul-buku");
const inputPenulis = document.getElementById("input-penulis-buku");
const inputTahun = document.getElementById("input-terbit-buku");
const inputStatusBaca = document.getElementById("input-selesai-buku");
const buttonSimpan = document.getElementById("button-simpan-buku");

// Notification
const notification = document.querySelector(".notification-container");

// Content Container
const mainContainer = document.querySelector(".content-wrapper");

// Form
const submitForm = document.querySelector("form");

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

const toggleModalTambahBuku = () => {
  const classTambah = modalTambahBuku.classList.contains("hidden")
    ? ""
    : "hidden";
  classTambah
    ? modalTambahBuku.classList.add(classTambah)
    : modalTambahBuku.classList.remove("hidden");
};

const clearModalTambahBuku = () => {
  inputJudul.value = inputPenulis.value = "";
  inputTahun.value = 2022;
  inputStatusBaca.checked = false;
};

const clearFilter = () => {
  filterInputNama.value = "";
  filterSelectTipe.value = 0;
};

const filterBuku = () => {
  if (filterInputNama.value) {
    if (filterSelectTipe.value != 0) {
      let status = filterSelectTipe.value == 1 ? false : true;
      data = data.filter(
        (item) =>
          item.isComplete == status &&
          item.title.toLowerCase().includes(filterInputNama.value.toLowerCase())
      );
    } else {
      data = data.filter((item) =>
        item.title.toLowerCase().includes(filterInputNama.value.toLowerCase())
      );
    }
  } else {
    data = [...data];
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveDataToStorage = () => {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const getDataFromStorage = () => {
  if (isStorageExist()) {
    let result = localStorage.getItem(STORAGE_KEY);
    result = JSON.parse(result);

    data = result ? result : [];
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
};

const tambahBuku = () => {
  let book = {
    id: +new Date(),
    title: inputJudul.value,
    author: inputPenulis.value,
    year: inputTahun.value,
    isComplete: inputStatusBaca.checked,
  };
  data.push(book);
  saveDataToStorage();

  clearModalTambahBuku();
  toggleModalTambahBuku();
};

const editBuku = () => {};

const hapusBuku = (indexBuku) => {
  let buku = [...data];
  buku.splice(indexBuku, 1);
  data = [...buku];
  saveDataToStorage();
  showNotification({
    headerMsg: "Berhasil Menghapus!",
    bodyMsg: "Berhasil Mengapus 1 Buku!",
  });
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
                      <button class="button-delete bg-red-600 border rounded text-white p-2 ml-auto">
                          <i class="fa fa-trash"></i>
                      </button>
                  </div>
              </div>
          </div>
          `;
      mainContainer.insertAdjacentHTML("beforeend", template);
    }

    document.querySelectorAll(".button-delete").forEach((item, index) => {
      item.addEventListener("click", () => {
        hapusBuku(index);
      });
    });
  } else {
    mainContainer.classList.remove("grid");
    mainContainer.innerHTML =
      "<div class='flex flex-col items-center justify-center'><img src='./assets/image/no-data-placeholder.jpg' class='h-72 object-cover'/><h1 class='font-bold text-center'>Tidak ada Buku yang disimpan</h1></div>";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getDataFromStorage();

  submitForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    tambahBuku();

    setTimeout(() => {
      showNotification({
        headerMsg: "Berhasil",
        bodyMsg: "Berhasil Menambahkan Buku!",
      });
    }, 100);
  });

  buttonToggleModal.addEventListener("click", toggleModalTambahBuku);

  closeButtonToggleModal.addEventListener("click", toggleModalTambahBuku);

  filterButton.addEventListener("click", filterBuku);
  resetButton.addEventListener("click", () => {
    clearFilter();
    getDataFromStorage();
  });
});
