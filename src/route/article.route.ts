import * as express from 'express';

const route = express.Router();

route.post('/');
route.get('/');
route.get('/:id');
route.put('/:id');
route.patch('/complete/:id');
route.delete('/:id');

export default route;
