const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLID,
	GraphQLString,
} = require("graphql");
const UserModel = require("../models/user.js");

const GameType = new GraphQLObjectType({
	name: "GameType",
	fields: () => ({
		config: { type: GraphQLString },
		state: { type: GraphQLString },
	}),
});

const UserType = new GraphQLObjectType({
	name: "UserType",
	fields: () => ({
		game: { type: GameType },
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	fields: {
		user: {
			type: UserType,
			args: {
				id: { type: GraphQLID },
			},
			resolve: (parent, args) => UserModel.findById(args.id),
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		addUser: {
			type: UserType,
			args: {
				config: { type: GraphQLString },
				state: { type: GraphQLString },
			},
			resolve: (parent, args) => {
				const newGame = new UserModel({
					game: {
						state: args.state,
						config: args.config,
					},
				});

				return newGame.save();
			},
		},
	}),
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});