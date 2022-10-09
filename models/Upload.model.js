require('dotenv').config();
const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

var that = module.exports = {
    setFilePublic: async(fileId) => {
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
            const gerUrl = await drive.files.get({
                fileId,
                fields: 'webViewLink, webContentLink, thumbnailLink'
                // fields: '*'
            });
            return gerUrl;
        } catch (error) {
            console.log(error);
        }
    },
    uploadFile: async () => {
        try {
            const createFile = await drive.files.create({
                requestBody: {
                    name: 'image_test.jpg',
                    mimeType: 'image/jpg'
                },
                media: {
                    mimeType: 'image/jpg',
                    body: fs.createReadStream(path.join(__dirname, '/../test.jpg'))
                }
            });
            const fileId = createFile.data.id;
            console.log(createFile.data);
            const gerUrl = await that.setFilePublic(fileId);
            console.log(gerUrl.data);
        } catch (error) {
            console.log(error);
        }
    },
    deleteFile: async() => {
        try {
            const deleteFile = await drive.files.delete({
                fileId: '1sEJput5dOFkyk9SWbSWjLt6RvckpXWFK'
            });
            console.log(deleteFile.data, deleteFile.status);
        } catch (error) {
            console.log(error);
        }
    }
}