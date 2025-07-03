const graphql = require('graphql');
const Anime = require('../model/AnimeCard');
const Genre = require('../model/Genre');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;

const AnimeCardType = new GraphQLObjectType({
    name: 'AnimeCard',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: {
            type: GenreType,
            resolve(parent, args){
                // data fetching code
                return Genre.findById(parent.genreID);
            }
        }
    })
});

const GenreType = new GraphQLObjectType({
    name: 'Genre',
    fields: () => ({
        id: {type: GraphQLID},
        name: { type: GraphQLString },
        animes: {
            type: new graphql.GraphQLList(AnimeCardType),
            resolve(parent, args) {
                // Data fetching code
                return Anime.find({ genreID: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        anime: {
            type: AnimeCardType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                // data fetching code
                return Anime.findById(args.id);
            }
        },
        animesByName: {
            type: new GraphQLList(AnimeCardType),
            args: { name: { type: GraphQLString }},
            resolve(parent, args){
                // data fetching code
                return Anime.find({ name: new RegExp(args.name, 'i') });
            }
        },
        animes: {
            type: new GraphQLList(AnimeCardType),
            resolve(parent, args){
                // data fetching code
                return Anime.find({});
            }
        },
        genre: {
            type: GenreType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                // data fetching code
                return Genre.findById(args.id);
            }
        },
        genres: {
            type: new GraphQLList(GenreType),
            resolve(parent, args) {
                // data fetching code 
                return Genre.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addGenre: {
            type: GenreType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let genre = new Genre({
                    name: args.name,
                });
                return genre.save();
            }
        },
        addAnime: {
            type: AnimeCardType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genreID: { type: new GraphQLNonNull(GraphQLID) }, 
            },
            resolve(parent, args) {
                let anime = new Anime({
                    name: args.name,
                    genreID: args.genreID,
                });
                return anime.save();
            }
        },
        updateAnime: { //Working on now ...
            type: AnimeCardType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                genreID: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                return Anime.findByIdAndUpdate(
                    args.id,
                    {
                        name: args.name,
                        genreID: args.genreID,
                    },
                    { new: true }
                );
            }
        },
        deleteAnime: {
            type: AnimeCardType,
            args: { id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parent,args) {
                return Anime.findByIdAndDelete(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})