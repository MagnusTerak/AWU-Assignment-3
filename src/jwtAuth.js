import jwt from "jsonwebtoken";

// 'Secret' string needed for encrypting JWT:s
const SECRET = "superduperlongpasswordlikerichardshowedinhislecture";

export function generateJwt(req, res) {
  // Login credentials for sending a review
  const AUTHOR = "gruppd";
  const PASSWORD = "123";

  const authHeader = req.headers.authorization;
  const b64credentials = authHeader.slice(6);
  const credentials = atob(b64credentials);
  const fields = credentials.split(":");
  const author = fields[0];
  const password = fields[1];

  if (author == AUTHOR && password == PASSWORD) {
    const token = jwt.sign(
      {
        author: author,
        role: "superuser",
      },
      SECRET
    );
    res.status(200).json({
      ok: true,
      token: token,
    });
  } else {
    res.status(401).end();
  }
  res.end();
}

export function verifyJwt(req) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, SECRET);
    return payload;
  } else {
    return console.error("Unauthorized!");
  }
}
