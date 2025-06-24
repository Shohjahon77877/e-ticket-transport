import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import adminRouter from './routes/admin.routes.js';
import transportRouter from './routes/transport.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import customerRouter from './routes/customer.routes.js';
import passportRouter from './routes/passport.routes.js';
import cookieParser from 'cookie-parser';
import { createSuperAdmin } from './db/create-superadmin.js';

const app = express();
app.use(express.json());

await connectDB();
await createSuperAdmin();

app.use(cookieParser());

app.use('/admin', adminRouter);
app.use('/transport', transportRouter);
app.use('/ticket', ticketRouter);
app.use('/customer', customerRouter);
app.use('/passportInfo', passportRouter);

app.listen(config.PORT, () => console.log('Server is running on port', +config.PORT));