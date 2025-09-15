import { User, Post, File } from "../model/model.js";
import { createToken, matchPassword, encryptPass } from "../util/util.js";

export const resolvers = {
  Query: {
    getUserDocs: async (_, { userId, offset = 0, limit = 10 }, { user }) => {
      // Check authentication
      if (!user) throw new Error("Unauthorized");

      // Ensure users can only fetch their own documents
      if (user.id !== userId) throw new Error("Forbidden");

      // Fetch documents (existing logic)
      return await File.find({ user: userId })
        .populate("user")
        .skip(offset)
        .limit(limit);
    },
  },
  Mutation: {
    signup: async (_, { name, email, password }) => {
      if (await User.findOne({ email })) throw new Error("User already exists");
      const hashed = await encryptPass(password);
      const user = new User({ name, email, password: hashed });
      await user.save();
      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      const valid = await matchPassword(password, user.password);
      if (!valid) throw new Error("Invalid password");

      user.tokenVersion += 1;
      await user.save();

      const token = createToken(user);
      return { token, user };
    },
    deleteUserDocs: async (_, { fileId }, { user }) => {
      // Fixed: use `user` from context
      if (!user) throw new Error("Unauthorized");

      const file = await File.findById(fileId);
      if (!file) throw new Error("File not found");

      if (file.user.toString() !== user.id) throw new Error("Forbidden");

      await File.findByIdAndDelete(fileId);
      return "File deleted successfully";
    },
  },
};
