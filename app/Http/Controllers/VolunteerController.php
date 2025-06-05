<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VolunteerBooking;
use Illuminate\Support\Facades\Auth;

class VolunteerController extends Controller
{
    public function index()
    {
        return inertia('Volunteers/Dashboard');
    }

    public function projects()
    {
        $bookings = VolunteerBooking::with('project')
            ->where('user_id', Auth::id())
            ->get();

        return inertia('Volunteers/Projects', [
            'bookings' => $bookings
        ]);
    }
    public function messages()
    {
        return inertia('Volunteers/Messages');
    }
    public function profile()
    {
        return inertia('Volunteers/Profile');
    }
}
