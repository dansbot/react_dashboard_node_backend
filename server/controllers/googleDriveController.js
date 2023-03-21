const { google } = require("googleapis");
const { GOOGLE_SERVICE_ACCOUNT } = require("../config/googleServiceAcct");

// set up Google Drive API client
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
const auth = new google.auth.JWT(
  GOOGLE_SERVICE_ACCOUNT.client_email,
  null,
  GOOGLE_SERVICE_ACCOUNT.private_key,
  SCOPES
);
const drive = google.drive({ version: "v3", auth });

let folderIds = {};

async function getFolderId(folderName) {
  if (folderIds[folderName]) return folderIds[folderName];
  const folderPath = folderName.split("/");
  let curr_fldr = "";
  let parentId = null;
  for (const folder of folderPath) {
    curr_fldr += `/${folder}`;
    if (folderIds[curr_fldr]) {
      parentId = folderIds[curr_fldr];
    } else {
      const query = `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folder}' ${
        parentId ? `and '${parentId}' in parents` : ""
      }`;
      const res = await drive.files.list({ q: query, fields: "files(id)" });
      if (res.data.files.length) {
        parentId = res.data.files[0].id;
        folderIds[curr_fldr] = parentId;
      } else {
        return null;
      }
    }
  }
  return folderIds[curr_fldr];
}

async function findFileUrl(folderName, fileName, fileType, exportFormat) {
  const folderId = await getFolderId(folderName);
  if (!folderId) return null;

  const query = `'${folderId}' in parents and trashed=false and name='${fileName}'`;
  const res = await drive.files.list({
    q: query,
    fields: "files(webContentLink)",
  });
  if (res.data.files.length) {
    const fileUrl = res.data.files[0].webContentLink;
    return fileUrl;
  } else {
    return null;
  }
}

const getFileUrl = async (req, res) => {
  const { fileName, folderName, fileType, exportFormat } = req.query;

  if (!fileName || !folderName) {
    return res
      .status(400)
      .json({ message: "Both folderName and fileName are required." });
  }

  const fileTypeValue =
    fileType !== undefined ? fileType : fileName.split(".").pop();
  const exportFormatValue =
    exportFormat !== undefined ? exportFormat : fileTypeValue;

  const url = await findFileUrl(
    folderName,
    fileName,
    fileTypeValue,
    exportFormatValue
  );

  return url
    ? res.json({ url })
    : res.status(204).json({ message: "File not found." });
};

module.exports = { getFileUrl };
