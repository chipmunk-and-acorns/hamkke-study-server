import express from 'express';

import * as imageController from '../controller/image.controller';
import { upload } from '../middleware/image';

const route = express.Router();

route.get('/presigned', imageController.presigned);
route.post('/upload', upload.single('image'), imageController.upload);

export default route;

// 1.presignedDate 가져오기
// const presignedData = await axios.get('/presigned?contentType' + type);
