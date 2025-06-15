<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;

class HandleUnauthorized
{
    public function handle($request, Closure $next, $error = null)
    {
        try {
            return $next($request);
        } catch (AuthorizationException $e) {
            if ($request->inertia()) {
                return redirect()->route('login');
            }

            return $request->expectsJson()
                ? response()->json(['message' => 'Unauthorized'], 403)
                : redirect()->guest(route('login'))->with('error', $e->getMessage());
        }
    }
}
