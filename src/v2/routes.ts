import { Router, type Express, type Request, type Response, type NextFunction } from 'express';
import { getDatabaseStatus, isMongoLive } from '../db.js';
import { successResponse } from '../shared/http/response.js';
import { websiteRoutes } from '../modules/website/routes.js';
import { contactRoutes } from '../modules/contact/routes.js';
import { configurationRoutes } from '../modules/configuration/routes.js';
import { appointmentRoutes } from '../modules/appointment/routes.js';
import { inquiryRoutes } from '../modules/inquiry/routes.js';
import { applicationRoutes } from '../modules/application/routes.js';
import { serviceRequestRoutes } from '../modules/service-request/routes.js';
import { registrationRoutes } from '../modules/registration/routes.js';
import { productRoutes } from '../modules/product/routes.js';
import { donationRoutes } from '../modules/donation/routes.js';
import { websiteContext, requireModule } from './middleware/websiteContext.js';
import { v2ErrorHandler } from './middleware/errorHandler.js';

export function registerV2Routes(app: Express): void {
  const v2 = Router();

  v2.get('/health', async (req: Request, res: Response) => {
    const live = await isMongoLive();
    res.json(
      successResponse(
        {
          status: 'ok',
          ...getDatabaseStatus(),
          mongoConnected: live,
          timestamp: new Date(),
        },
        { requestId: req.requestId }
      )
    );
  });

  v2.use('/websites', websiteRoutes());

  const websiteScoped = Router({ mergeParams: true });
  websiteScoped.use(websiteContext);
  websiteScoped.use('/contacts', contactRoutes());
  websiteScoped.use('/configuration', configurationRoutes());
  websiteScoped.use('/appointments', appointmentRoutes());
  websiteScoped.use('/inquiries', inquiryRoutes());
  websiteScoped.use('/applications', applicationRoutes());
  websiteScoped.use('/service-requests', serviceRequestRoutes());
  websiteScoped.use('/registrations', registrationRoutes());
  websiteScoped.use('/products', productRoutes());
  websiteScoped.use('/donations', requireModule('donation'), donationRoutes());

  v2.use('/websites/:slug', websiteScoped);

  v2.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    v2ErrorHandler(err, req, res, next);
  });

  app.use('/api/v2', v2);
}
