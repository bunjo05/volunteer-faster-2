<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrganizationProfile;
use Illuminate\Support\Facades\Auth;
use App\Models\VolunteerFollowingOrganization;

class VolunteerFollowOrganization extends Controller
{
    public function follow(OrganizationProfile $organization)
    {
        $user = Auth::user();

        // Check if already following
        if (!$user->isFollowing($organization)) {
            VolunteerFollowingOrganization::create([
                'organization_id' => $organization->id,
                'user_id' => $user->id
            ]);

            return back()->with('success', 'You are now following this organization');
        }

        return back()->with('info', 'You are already following this organization');
    }

    public function unfollow(OrganizationProfile $organization)
    {
        $user = Auth::user();

        $user->followingOrganizations()
            ->where('organization_id', $organization->id)
            ->delete();

        return back()->with('success', 'You have unfollowed this organization');
    }
}
