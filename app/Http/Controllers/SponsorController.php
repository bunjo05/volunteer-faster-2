<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SponsorController extends Controller
{
    public function index()
    {
        return inertia('Sponsors/Index');
    }
}
