import { base } from "@models/customer";
import { Router } from "express";
import reportIssueRoute from "./report&Issue";
import faqRoute from "./faq";
import paymentRoute from "./payment";


//Export base-router
var baseRouter = Router();

//setup routers
baseRouter.use('/report',reportIssueRoute);
baseRouter.use('/faq',faqRoute);
baseRouter.use('/payment',paymentRoute);

export default baseRouter