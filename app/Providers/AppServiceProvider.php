<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
// use App\Http\Middleware\CheckUserRole;

use Illuminate\Routing\Router;
use App\Http\Middleware\CheckUserRole;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->booted(function () {
            $router = $this->app->make(Router::class);
            $router->aliasMiddleware('check.role', CheckUserRole::class);
        });
        // Vite::prefetch(concurrency: 3);
        // Route::middleware('check.role', CheckUserRole::class);
    }
}
