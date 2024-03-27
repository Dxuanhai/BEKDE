const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET_KEY; // Use the secret key from environment variables
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET; // Use the refresh token secret from environment variables
const bcrypt = require("bcrypt");

async function login(username, password) {
  try {
    // Check if the user exists in the database
    const user = await prisma.profile.findFirst({
      where: { email: username },
      include: {
        role: {
          select: {
            id: true,
            roleName: true,
          },
        },
      },
    });
    if (!user) {
      return {
        status: 404,
        error: "User not found",
      };
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        status: 401,
        error: "Invalid password",
      };
    }

    // Create the access token
    const accessToken = jwt.sign(
      { userId: user.id, roleName: user.role.roleName },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    // Create the refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, roleName: user.role.roleName },
      refreshTokenSecret,
      {
        expiresIn: "7d",
      }
    );

    // Update the user's refresh token in the database
    await prisma.profile.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      status: 200,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return {
      status: 500,
      error: error.message,
    };
  }
}

async function register(email, password, fullName, genders) {
  try {
    // Check if the user exists in the database
    const user = await prisma.profile.findFirst({
      where: { email: email },
    });
    if (user) {
      return {
        status: 404,
        error: "email already exists",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.profile.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
        genders,
      },
    });

    return {
      status: 200,
      message: "created successfully",
    };
  } catch (error) {
    return {
      status: 500,
      error: error.message,
    };
  }
}
async function refreshAccessToken(refreshToken) {
  try {
    // Verify the refresh token
    const { userId } = jwt.verify(refreshToken, refreshTokenSecret);

    // Get the user from the database
    const user = await prisma.profile.findFirst({ where: { id: userId } });
    if (!user || user.refreshToken !== refreshToken) {
      return {
        status: 401,
        error: "Invalid refresh token",
      };
    }

    // Create a new access token
    const newAccessToken = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: accessTokenExpiration,
    });

    return {
      status: 200,
      accessToken: newAccessToken,
    };
  } catch (error) {
    return {
      status: 500,
      error: error.message,
    };
  }
}

module.exports = {
  login,
  refreshAccessToken,
  register,
};
