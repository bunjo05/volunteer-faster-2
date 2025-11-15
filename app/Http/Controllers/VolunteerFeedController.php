<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VolunteerFeedController extends Controller
{
    public function index()
    {
        return inertia('VolunteerFeed/Index');
    }
}
