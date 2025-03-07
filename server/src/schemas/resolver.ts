// import { userInfo } from 'node:os';
import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// Define types for the arguments
interface AddUserArgs {
  userData: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface BookArgs {
  bookData:  {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image?: string;
};
}

interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    // Get all users
    users: async () => {
      return User.find().populate('savedBooks');
    },

    // Get user by username
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('savedBooks');
    },

    // Get current user (me), requires authentication
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
  },

  Mutation: {
    // Create a new user (sign up)
    addUser: async (_parent: any, { userData }: AddUserArgs) => {
      const user = await User.create( userData );
      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },

    // Login a user
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Save a book for the authenticated user
    saveBook: async (_parent: any, args: BookArgs, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to save a book!');
      }
      return await User.findByIdAndUpdate(
        { _id: context.user._id }, 
        {$addToSet: {savedBooks: args}},
        {new: true}
      );
      },


    // Remove a saved book from the authenticated user's savedBooks
    removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: any) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("Couldn't find the user or the book to remove.");
        }
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in to remove a book!');
    },
  },
};

export default resolvers;
