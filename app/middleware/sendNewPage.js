/**
 * The middleware for directing new page for user.
 * 
 * @param {Object} res - The object res of framework Express.
 * @param {Number} status - The status code HTTP. 
 * @param {String} newpage - The URL or local path server.
 */

const sendNewPage = (res, status, newpage) => {
    return res.status(status).type('json').json({ newpage: newpage }).end();
}

export default sendNewPage; 