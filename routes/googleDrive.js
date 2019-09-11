const SERVICE_API_URI_GOOGLE_DRIVE = 'https://www.googleapis.com/drive/v3';

function makeGoogleDriveAdapter({
    config: {},
    services: {},
    logger
}) {
    return {
        getInitalData,
        getChangesFromStateToken,
        getItems,
        createItem //createResponseObject
    }
}

module.exports = {
    makeGoogleDriveAdapter
}