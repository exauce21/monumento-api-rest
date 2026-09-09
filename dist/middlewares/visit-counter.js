let visits = 0;
export const visitCounter = (req, res, next) => {
    req.visit = ++visits;
    res.setHeader("X-Visit", req.visit);
    next();
};
//# sourceMappingURL=visit-counter.js.map