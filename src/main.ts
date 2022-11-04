fetch("/api/a/?id=123", {
  method: "get",
})
  .then((res) => res.json())
  .then(console.log);

fetch("/api/user/1/?type=123", {
  method: "get",
})
  .then((res) => res.json())
  .then(console.log);

fetch("/api/role/1/permission", {
  method: "post",
  body: JSON.stringify({
    name: "qingyang",
  }),
})
  .then((res) => res.json())
  .then(console.log);

let formData = new FormData();
formData.append("id", "1");

const fileInput = document.getElementById("file") as HTMLInputElement;
fileInput.addEventListener("change", (e) => {
  const files = (e.target as HTMLInputElement).files;
  if (files) {
    console.log(files[0]);
    formData.append("file", files[0]);

    fetch("/api/upload?type=123", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then(console.log);
  }
});

export default "main";
