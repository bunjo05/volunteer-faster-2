<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admins.Dashboard');
    }
}
