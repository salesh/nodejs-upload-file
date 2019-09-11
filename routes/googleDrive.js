const SERVICE_API_URI_GOOGLE_DRIVE = 'https://www.googleapis.com/drive/v3';

function makeGoogleDriveAdapter({
    config: {SERVICE_API_URI_GOOGLE_DRIVE},
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

function getInitalData({userData, reportCallback}) {
    logger.info({...userData}, 'get initial data')
    const { userName } = userData;
    const initialDeltaLink = '';
    // TODO: call reportCallback with items from an initial scan 
    // and eventually with a current state token

    return getDriveChanges({
        userData,
        nextLinkOrDeltaLink: initialDeltaLink,
        reportCallback
    })
}

module.exports = {
    makeGoogleDriveAdapter
}