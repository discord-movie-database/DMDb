import mongoose from 'mongoose';
import config from '../config';

mongoose.connect(
    `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, config.db.options
);

export default mongoose;
