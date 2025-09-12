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
                'organization_public_id' => $organization->public_id,
                'user_public_id' => $user->public_id
            ]);

            return back()->with('success', 'You are now following this organization');
        }

        return back()->with('info', 'You are already following this organization');
    }

    public function unfollow(OrganizationProfile $organization)
    {
        $user = Auth::user();

        $user->followingOrganizations()
            ->where('organization_public_id', $organization->public_id)
            ->delete();

        return back()->with('success', 'You have unfollowed this organization');
    }
}
