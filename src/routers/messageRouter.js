const express = require("express");
const router = new express.Router();
const fs = require("fs");
const path = require("path");

const whatsappclient = require("../services/WhatsappClient");

router.get("/", (req, res) => {
	res.send("Hello World!");
});

router.post("/message", (req, res) => {
	const uploadedFile = req.files && req.files.file;

	//check whether a single file is being uploaded
	if (uploadedFile) {
		const filePath = path.join(__dirname, "uploads", uploadedFile.name);

		// Use fs to save the file
		uploadedFile.mv(filePath, (err) => {
			if (err) {
				return res.status(500).send(err);
			}

			// Process the file and send the message
			whatsappclient.sendMessage(
				req.body.phoneNumber,
				req.body.message,
				filePath
			);

			res.send("File uploaded and message sent successfully.");
		});
	} else {
		// Handle the case when no file is uploaded
		whatsappclient.sendMessage(req.body.phoneNumber, req.body.message);
		res.send("Message sent successfully.");
	}
});

module.exports = router;
