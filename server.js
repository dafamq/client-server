const http = require("http");
const fs = require("fs");

let requestCount = 0;

const requestHandler = (req, res) => {
	requestCount++;
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

	if (req.method === "GET" && req.url === "/") {
		fs.readFile("index.html", (err, data) => {
			if (err) {
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Internal Server Error");
				return;
			}
			res.writeHead(200, { "Content-Type": "text/html" });
			res.end(data);
		});
	} else if (req.method === "POST" && req.url === "/data") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", () => {
			try {
				const data = JSON.parse(body);
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "Data received successfully",
						data,
					})
				);
			} catch (err) {
				res.writeHead(400, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ error: "Invalid JSON format" }));
			}
		});
	} else if (req.method === "GET" && req.url === "/status") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				status: "OK",
				serverTime: new Date(),
				requestCount,
			})
		);
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "Not Found" }));
	}
};

const server = http.createServer(requestHandler);

server.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
