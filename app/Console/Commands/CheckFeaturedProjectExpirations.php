<?php

namespace App\Console\Commands;

use App\Models\FeaturedProject;
use Illuminate\Console\Command;

class CheckFeaturedProjectExpirations extends Command
{
    protected $signature = 'featured-projects:check-expirations';
    protected $description = 'Check and update expired featured projects and send notifications';

    public function handle()
    {
        $count = FeaturedProject::checkAllExpirations();
        $this->info("Processed {$count} featured projects for expiration checks and notifications.");

        return Command::SUCCESS;
    }
}
