<?php

namespace App\Http\Middleware;

use App\Models\FeaturedProject;
use Closure;
use Illuminate\Http\Request;

class CheckFeaturedProjectExpiration
{
    public function handle(Request $request, Closure $next)
    {
        // Check for expired featured projects on specific routes
        if ($this->shouldCheckExpiration($request)) {
            FeaturedProject::checkAllExpirations();
        }

        return $next($request);
    }

    protected function shouldCheckExpiration(Request $request)
    {
        // Only check on certain routes to avoid performance issues
        $routesToCheck = [
            'home',
            'projects.*',
            'organization.*',
            'admin.*',
            'featured.*', // Add featured project routes if any
        ];

        foreach ($routesToCheck as $route) {
            if ($request->routeIs($route)) {
                return true;
            }
        }

        return false;
    }
}
