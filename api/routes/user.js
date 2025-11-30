const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { celebrate } = require("celebrate");
const { Parser } = require("json2csv");
const User = require("../models/User.model");
const { user: userSchema } = require("../models/schema");
const {
  verifyToken,
  verifyAuthorization,
  verifyAdminAccess,
} = require("../middlewares/verifyAuth");

// Get all users - admin only
// router.get(
//   "/",
//   verifyAdminAccess,
//   celebrate({ query: userSchema.query }),
//   async (req, res) => {
//     const query = req.query;
//     try {
//       let users;
//       if (query.new) {
//         users = await User.find(
//           { isAdmin: { $ne: true } },
//           { password: 0 }
//         )
//           .sort({ createdAt: -1 })
//           .limit(5);
//       } else {
//         users = await User.find(
//           { isAdmin: { $ne: true } },
//           { password: 0 }
//         );
//       }
//       return res.json(users);
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json(userResponse.unexpectedError);
//     }
//   }
// );

router.get(
  "/",
  verifyAdminAccess,
  celebrate({ query: userSchema.query }),
  async (req, res) => {
    const query = req.query;

    try {
      let users;

      const filter = { isAdmin: { $ne: true } };
      const projection = { password: 0, __v: 0 };

      if (query.new) {
        users = await User.find(filter, projection)
          .sort({ createdAt: -1 })
          .limit(5);
      } else {
        users = await User.find(filter, projection);
      }

      if (query.export === "csv") {

        if (!users.length) {
          return res.status(404).json({
            success: false,
            message: "No users found to export",
          });
        }

        const fields = [
          { label: "ID", value: "_id" },
          { label: "Full Name", value: "fullname" },
          { label: "Email", value: "email" },
          { label: "Address", value: "address" },
          { label: "Created At", value: "createdAt" }
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(users);

        res.header("Content-Type", "text/csv");
        res.attachment("users.csv");

        return res.send(csv);
      }

      // ✅ Không có export -> trả JSON như bình thường
      return res.json(users);

    } catch (err) {
      console.error(err);
      return res.status(500).json(userResponse.unexpectedError);
    }
  }
);

// Get current user - any authenticated user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, { password: 0 });
    return res.json({ status: "ok", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json(userResponse.unexpectedError);
  }
});

//update profile user
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { fullname, address, password, newPassword } = req.body;

    const _user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(password, _user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không đúng" });
    }

    const updates = {};

    if (fullname) updates.fullname = fullname;
    if (address) updates.address = address;
    if (newPassword) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      updates.password = passwordHash;
    }

    //update user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });

    res.json({
      status: "ok",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
});

// Update a user - authorized user & admin only
router.put(
  "/:id",
  verifyAuthorization,
  celebrate({ body: userSchema.update }),
  async (req, res) => {
    let { currentPassword, newPassword, fullname } = req.body;

    // reset password
    let password;
    if (newPassword) {
      const user = await User.findById(req.params.id);
      const isValid = await bcrypt.compare(currentPassword, user.password);

      if (isValid) {
        password = await bcrypt.hash(newPassword, 10);
      } else {
        return res.status(401).json(userResponse.userUpdateFailed);
      }
    }

    try {
      await User.findByIdAndUpdate(
        req.params.id,
        { $set: { fullname, password } },
        { new: true }
      );
      return res.json(userResponse.userUpdated);
    } catch (err) {
      console.error(err);
      return res.status(500).json(userResponse.unexpectedError);
    }
  }
);

// Delete a user - authorized user & admin only
router.delete("/:id", verifyAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json(userResponse.userDeleted);
  } catch (err) {
    console.log(err);
    return res.status(500).json(userResponse.unexpectedError);
  }
});

// Get user statistics - admin only
router.get("/stats", verifyAdminAccess, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json(userResponse.unexpectedError);
  }
});

// Export user emails as CSV - for Admin
router.get("/export-emails", verifyAdminAccess, async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, _id: 0 }).lean();

    if (!users || users.length === 0) {
      // No content
      return res.status(204).send();
    }

    // Build CSV: header + each email on new line
    const header = "email";
    const rows = users.map((u) => (u.email || "").replace(/\r?\n/g, " "));
    const csv = [header, ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="emails.csv"');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).json(userResponse.unexpectedError);
  }
});

router.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await User.updateOne(
      { email: email },
      { $set: { isAdmin: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    console.log(`User ${email} is now admin`);
    res.json({
      status: "ok",
      message: `User ${email} is now admin`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Get any user - admin only
router.get("/:id", verifyAdminAccess, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json(userResponse.unexpectedError);
  }
});

const userResponse = {
  unexpectedError: {
    status: "error",
    message: "an unexpected error occurred",
  },
  userDeleted: {
    status: "ok",
    message: "user has been deleted",
  },
  userUpdateFailed: {
    status: "error",
    message: "user update failed",
  },
  userUpdated: {
    status: "ok",
    message: "user has been updated",
  },
};

module.exports = router;
