let formData = new FormData();
formData.append('name', 'zz');

const plainFormData = Object.fromEntries(formData.entries());
const formDataJsonString = JSON.stringify(plainFormData);

formData.append('file', new Blob(['1']));

fetch('/api/role/1/permission?type=123', {
	method: 'post',

	headers: {
		'Content-Type': 'multipart/form-data',
		// Accept: 'application/json',
	},
	body: formDataJsonString,
})
	.then((res) => res.json())
	.then(console.log);

// @ts-ignore
// import routes from 'virtual:routes';

// console.log(msg);
