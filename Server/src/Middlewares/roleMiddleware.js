/**
 * Middleware: Role Authorization Gatekeeper
 * Restricts route access to specific user roles (e.g. 'Student', 'Outlet').
 * Takes a list of authorized roles, checks the logged-in user's role,
 * and blocks access with a 403 Forbidden status if they don't match.
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        // Step 1: Compare the logged-in user's role against the array of allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "You don't have permission" });
        }
        
        // Step 2: User has permission — proceed to next handler
        next();
    };
};