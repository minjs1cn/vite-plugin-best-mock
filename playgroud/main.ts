let formData = new FormData();
formData.append('name', 'zz');

const plainFormData = Object.fromEntries(formData.entries());
const formDataJsonString = JSON.stringify(plainFormData);

formData.append('file', new Blob(['1']));

fetch('/user', {
	method: 'get',

	headers: {
		// 'Content-Type': 'multipart/form-data',
		// Accept: 'application/json',
	},
	// body: formData,
})
	.then((res) => res.json())
	.then(console.log);
