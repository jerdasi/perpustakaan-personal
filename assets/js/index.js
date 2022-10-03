document.addEventListener("DOMContentLoaded", () => {
  const RENDER_EVENT = "render-buku";
  const STORAGE_KEY = "ALL_BOOKS";

  const inputNama = document.getElementById("input-nama-buku");
  const inputJudul = document.getElementById("input-judul-buku");
  const inputPenulis = document.getElementById("input-penulis-buku");
  const inputTahun = document.getElementById("input-terbit-buku");
  const buttonSimpan = document.getElementById("button-simpan-buku");

  const submitForm = document.querySelector("form");

  submitForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    let book = {
      id: +new Date(),
      title: inputJudul.value,
      author: inputPenulis.value,
      inputTahun: inputTahun.value,
    };
    console.log(book);
  });

  const tambahBuku = () => {};

  const editBuku = () => {};

  const hapusBuku = () => {};
});
