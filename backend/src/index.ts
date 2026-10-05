const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./graphql/index');
const { prisma } = require('./database');
const jwt = require('jsonwebtoken');
import type { Request } from 'express';

const port = process.env.PORT || 3001;
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const JWT_SECRET = process.env.JWT_SECRET;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  context: async ({ req }: { req: Request }) => {
    // Extract token from Authorization header
    let user = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        user = await prisma.users.findUnique({
          where: { id: decoded.userId }
        });
      } catch (error) {
        console.log('Invalid token');
      }
    }

    return {
      user,
      prisma
    };
  },
  cors: {
    origin: process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : ['https://pintrest.no', 'https://www.pintrest.no', 'https://pintrest-ecru.vercel.app'],
    credentials: true,
  },
  csrfPrevention: false,
  plugins: [
    {
      async requestDidStart() {
        return {
          async parsingDidStart() {
            // Increase body size limit to 50MB
          },
        };
      },
    },
  ],
});

server.listen({ 
  port, 
  host,
  bodyParserConfig: {
    limit: '50mb'
  }
}).then(({ url }: { url: string }) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`Server runs at ${url}`);
  } else if (process.env.NODE_ENV !== 'production') {
    console.log(`Server runs at http://localhost:${port}/`);
    console.log(`🔒 Development mode: Server accessible only on localhost`);
  }
});
