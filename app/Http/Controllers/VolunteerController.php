<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function index()
    {
        return inertia('Volunteers/Dashboard');
    }

    public function projects()
    {
        return inertia('Volunteers/Projects');
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
