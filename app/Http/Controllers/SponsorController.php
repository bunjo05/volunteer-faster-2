<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SponsorController extends Controller
{

    public function index()
    {
        return inertia('Sponsors/Index');
    }

    public function dashboard()
    {
        return inertia('Sponsors/Dashboard', [
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}
