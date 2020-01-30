function verifyToken(req, res, next) {
  const bodyHeader = req.headers['authorization'];

  if(typeof bodyHeader != 'undefined') {
    const reqBody = bodyHeader.split(' ');
    // Get token
    const headerToken = bodyHeader[1];
    // Set token 
    req.token = headerToken;
    // New Middleware
    next();
  }
}