export const nightBlocker = (req, res, next) => {
    const hour = new Date().getHours();
    console.log(`Current hour: ${hour}`);
    if (hour >= 0 && hour < 6) {
        res.status(503).json({
            message: "Le serveur est en cours de maintenance",
            data: null,
        });
        return;
    }
    next();
};
//# sourceMappingURL=night-blocker.js.map