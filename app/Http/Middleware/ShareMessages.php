<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\VolunteerController;

class ShareMessages
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user) {
            if ($user->role === 'Organization') {
                $organizationController = new OrganizationController();
                $messagesData = $organizationController->shareMessages();
            } elseif ($user->role === 'Volunteer') {
                $volunteerController = new VolunteerController();
                $messagesData = $volunteerController->shareMessages();
            } else {
                $messagesData = ['conversations' => []];
            }

            // Share messages data with all Inertia responses
            if ($request->header('X-Inertia')) {
                $response = $next($request);
                $content = json_decode($response->getContent(), true);
                if ($content && isset($content['props'])) {
                    $content['props']['messages'] = $messagesData;
                    $response->setContent(json_encode($content));
                }
                return $response;
            }
        }

        return $next($request);
    }
}
