<?php

namespace App\Providers;

use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Route;
// use App\Http\Middleware\CheckUserRole;

use App\Http\Middleware\CheckUserRole;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast;

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

        // Update broadcast routes to include all guards
        Broadcast::routes(['middleware' => ['auth:web,admin']]);

        Broadcast::channel('admin.chat-requests', function ($admin) {
            return true;
        });

        Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
            return \App\Models\ChatParticipant::where('chat_id', $chatId)
                ->where(function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->orWhere('admin_id', $user->id);
                })
                ->exists();
        });

        require base_path('routes/channels.php');
    }
}
