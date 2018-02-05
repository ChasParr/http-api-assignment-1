const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// send the json object
const respond = (request, response, status, content, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    response.writeHead(status, { 'Content-Type': 'text/xml' });
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    if (content.id) {
      responseXML = `${responseXML} <id>${content.id}</id>`;
    }
    responseXML = `${responseXML} </response>`;
    response.write(responseXML);
  } else {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(content));
  }
  response.end();
};


// return success status code
const success = (request, response, params, acceptedTypes) => {
  const responseObj = {
    message: 'Response successful',
  };

  respond(request, response, 200, responseObj, acceptedTypes);
};

// return badRequest status code
const badRequest = (request, response, params, acceptedType) => {
  const responseObj = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    responseObj.message = 'Missing valid query parameter set to true';
    responseObj.id = 'badRequest';

    return respond(request, response, 400, responseObj, acceptedType);
  }

  return respond(request, response, 200, responseObj, acceptedType);
};

// return unauthorized status code
const unauthorized = (request, response, params, acceptedType) => {
  const responseObj = {
    message: 'This request has the required parameters',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseObj.message = 'Missing loggedIn query parameter set to yes';
    responseObj.id = 'unauthorized';

    return respond(request, response, 400, responseObj, acceptedType);
  }

  return respond(request, response, 200, responseObj, acceptedType);
};

// return forbidden status code
const forbidden = (request, response, params, acceptedType) => {
  const responseObj = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };

  respond(request, response, 403, responseObj, acceptedType);
};

// return internal status code
const internal = (request, response, params, acceptedType) => {
  const responseObj = {
    message: 'Internal Server Error. Something went wrong',
    id: 'internalError',
  };

  respond(request, response, 500, responseObj, acceptedType);
};

// return notImplemented status code
const notImplemented = (request, response, params, acceptedType) => {
  const responseObj = {
    message: 'this thing has not been implemented',
    id: 'notImplemented',
  };

  respond(request, response, 501, responseObj, acceptedType);
};

// return success status code
const notFound = (request, response, params, acceptedType) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respond(request, response, 404, responseObj, acceptedType);
};

module.exports = {
  getIndex,
  getCss,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
