import path from 'path';
import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Hamkke Study API with Swagger',
      version: '1.0.0',
      description: '함께 스터디 API Document',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'quokka_jeong',
        url: 'https://velog.io/@wldns12378',
        email: 'devquokkajeong@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: [path.join(__dirname, '..', 'document', 'api.js')],
};

const specs = swaggerJsdoc(options);

export default specs;
