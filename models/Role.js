import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const RoleModel = mongoose.model("Role", RoleSchema);

export { RoleModel };
