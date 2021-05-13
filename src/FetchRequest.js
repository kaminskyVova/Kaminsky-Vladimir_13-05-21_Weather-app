export default class FetchRequest {
	constructor(params = {}) {
		this.security = params?.security ?? false;
		this.host = params.host;
		this.port = params?.port ?? (this.security ? "443" : "8080");
		this.query = params?.query ?? {};
	}

	getAddress(path = "/", query = {}) {
		query = Object.entries(Object.assign({}, this.query, query));

		let queryString = "";
		if (query.length) {
			queryString = "?" + query.map((xs) => xs.join("=")).join("&");
		}

		// prettier-ignore
		return `${this.security ? 'https' : 'http'}://${this.host}:${this.port}${path}${queryString}`
	}

	async get(path, query) {
		const address = this.getAddress(path, query);
		const responce = await fetch(address, { method: "GET" });
		return await responce.json();
	}

	async set(path, body = {}, query) {
		const address = this.getAddress(path, query);
		const responce = await fetch(address, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
		});

		return await responce.json();
	}
}
