import express from "express";
import { celebrate, Joi} from 'celebrate'

import multer from 'multer';

import multerConfig from './config/multer'
import MarketsController from './controllers/marketsController'
import ItemsController from './controllers/itemsController'


const routes = express.Router();
const upload = multer(multerConfig);

const marketsController = new MarketsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index)

routes.post('/markets',
upload.single('image'),
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    descricao: Joi.string().required(),
    latitude: Joi.number().required(),
    longtude: Joi.number().required(),
    city: Joi.string().required(),
    uf: Joi.string().required().max(2),
    items: Joi.string().required(),
  })
},{
  abortEarly:false,
}),
marketsController.create);
routes.get('/markets/:id', marketsController.show);

routes.get('/markets', marketsController.index);
routes.get('/markets-all', marketsController.indexAll);

export default routes;
