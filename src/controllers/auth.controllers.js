"use strict";

const authService = require("../services/auth.services");

async function login(req, res) {
  const { email, password } = req.body;

  const user = await authService.login(email, password);

  if (user.error) {
    return res.status(user.status).json({ error: user.error });
  } else {
    return res.status(200).json(user);
  }
}

async function register(req, res) {
  const { email, password, fullName, genders } = req.body;

  const user = await authService.register(email, password, fullName, genders);

  if (user.error) {
    return res.status(user.status).json({ error: user.error });
  } else {
    return res.status(200).json(user);
  }
}

async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  try {
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    if (newAccessToken.error) {
      return res
        .status(newAccessToken.status)
        .json({ error: newAccessToken.error });
    } else {
      return res.status(200).json(newAccessToken);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  login,
  refreshToken,
  register,
};
