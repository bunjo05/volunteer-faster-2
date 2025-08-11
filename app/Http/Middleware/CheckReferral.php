<?php

// app/Http/Middleware/CheckReferral.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckReferral
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->has('ref') && !$request->cookie('referral')) {
            return redirect($request->fullUrl())->withCookie(
                cookie('referral', $request->query('ref'), 60 * 24 * 7) // 1 week
            );
        }

        return $next($request);
    }
}
