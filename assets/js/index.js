const RENDER_EVENT = "render-buku";
const STORAGE_KEY = "ALL_BOOKS";

// Data
let data = [];

// Filter
const filterInputNama = document.getElementById("nama-buku");
const filterSelectTipe = document.getElementById("tipe-buku");
const filterButton = document.querySelector(".tools-filter");

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
        if (filterSelectTipe.value) {
            console.log(
                data.filter(
                    (item) =>
                        item.isComplete == filterSelectTipe.value &&
                        item.title.includes(filterInputNama.value)
                )
            );
        } else {
            console.log(
                data.filter((item) =>
                    item.title.includes(filterInputNama.value)
                )
            );
        }
    } else {
        console.log(data);
    }
};

const saveDataToStorage = (newItem) => {
    if (isStorageExist()) {
        data.push(newItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
};

const getDataFromStorage = () => {
    if (isStorageExist()) {
        console.log("jalan");
        let result = localStorage.getItem(STORAGE_KEY);
        result = JSON.parse(result);
        data = [...result];
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
};

document.addEventListener(RENDER_EVENT, () => {
    mainContainer.innerHTML = "";

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
                  <button class="bg-red-600 border rounded text-white p-2 ml-auto">
                      <i class="fa fa-trash"></i>
                  </button>
              </div>
          </div>
      </div>
      `;
        mainContainer.insertAdjacentHTML("beforeend", template);
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

    const tambahBuku = () => {
        let book = {
            id: +new Date(),
            title: inputJudul.value,
            author: inputPenulis.value,
            year: inputTahun.value,
            isComplete: inputStatusBaca.checked,
        };

        saveDataToStorage(book);

        clearModalTambahBuku();
        toggleModalTambahBuku();
    };

    const editBuku = () => {};

    const hapusBuku = () => {};
});
