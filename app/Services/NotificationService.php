<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\Admin;

class NotificationService
{
    public static function createNotification($userPublicId, $type, $title, $message, $data = [], $adminPublicId = null)
    {
        return Notification::create([
            'user_public_id' => $userPublicId,
            'admin_public_id' => $adminPublicId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'is_read' => false
        ]);
    }

    // Project related notifications
    public static function notifyProjectApproved($project)
    {
        return self::createNotification(
            $project->user_public_id,
            'project_approved',
            'Project Approved',
            "Your project '{$project->title}' has been approved and is now live.",
            [
                'project_id' => $project->public_id,
                'project_title' => $project->title,
                'project_slug' => $project->slug
            ],
            auth('admin')->id()
        );
    }

    public static function notifyProjectRejected($project, $remark = null)
    {
        $message = "Your project '{$project->title}' has been rejected.";
        if ($remark) {
            $message .= " Reason: {$remark}";
        }

        return self::createNotification(
            $project->user_public_id,
            'project_rejected',
            'Project Rejected',
            $message,
            [
                'project_id' => $project->public_id,
                'project_title' => $project->title,
                'project_slug' => $project->slug,
                'remark' => $remark
            ],
            auth('admin')->id()
        );
    }

    // Booking related notifications
    public static function notifyNewBooking($booking)
    {
        return self::createNotification(
            $booking->project->user_public_id,
            'new_booking',
            'New Booking Received',
            "A new booking has been made for your project '{$booking->project->title}' by {$booking->user->name}.",
            [
                'booking_id' => $booking->public_id,
                'project_id' => $booking->project_public_id,
                'project_title' => $booking->project->title,
                'volunteer_name' => $booking->user->name
            ]
        );
    }

    public static function notifyBookingApproved($booking)
    {
        return self::createNotification(
            $booking->user_public_id,
            'booking_approved',
            'Booking Approved',
            "Your booking for '{$booking->project->title}' has been approved by the organization.",
            [
                'booking_id' => $booking->public_id,
                'project_id' => $booking->project_public_id,
                'project_title' => $booking->project->title,
                'organization_name' => $booking->project->user->name
            ]
        );
    }

    public static function notifyBookingCancelled($booking)
    {
        return self::createNotification(
            $booking->user_public_id,
            'booking_cancelled',
            'Booking Cancelled',
            "Your booking for '{$booking->project->title}' has been marked as cancelled.",
            [
                'booking_id' => $booking->public_id,
                'project_id' => $booking->project_public_id,
                'project_title' => $booking->project->title
            ]
        );
    }

    public static function notifyBookingRejected($booking)
    {
        return self::createNotification(
            $booking->user_public_id,
            'booking_rejected',
            'Booking Rejected',
            "Your booking for '{$booking->project->title}' has been marked as rejected.",
            [
                'booking_id' => $booking->public_id,
                'project_id' => $booking->project_public_id,
                'project_title' => $booking->project->title
            ]
        );
    }

    public static function notifyBookingCompleted($booking)
    {
        return self::createNotification(
            $booking->user_public_id,
            'booking_completed',
            'Booking Completed',
            "Your booking for '{$booking->project->title}' has been marked as completed.",
            [
                'booking_id' => $booking->public_id,
                'project_id' => $booking->project_public_id,
                'project_title' => $booking->project->title
            ]
        );
    }

    // Organization verification notifications
    public static function notifyOrganizationVerification($organization, $status)
    {
        $title = $status === 'Approved' ? 'Verification Approved' : 'Verification Rejected';
        $message = $status === 'Approved'
            ? "Your organization verification has been approved."
            : "Your organization verification has been rejected.";

        return self::createNotification(
            $organization->user_public_id,
            'organization_verification_' . strtolower($status),
            $title,
            $message,
            [
                'organization_id' => $organization->public_id,
                'organization_name' => $organization->name,
                'status' => $status
            ],
            auth('admin')->id()
        );
    }

    // Volunteer verification notifications
    public static function notifyVolunteerVerification($volunteer, $status)
    {
        $title = $status === 'Approved' ? 'Verification Approved' : 'Verification Rejected';
        $message = $status === 'Approved'
            ? "Your volunteer verification has been approved."
            : "Your volunteer verification has been rejected.";

        return self::createNotification(
            $volunteer->user_public_id,
            'volunteer_verification_' . strtolower($status),
            $title,
            $message,
            [
                'volunteer_id' => $volunteer->public_id,
                'status' => $status
            ],
            auth('admin')->id()
        );
    }

    // Featured project notifications
    public static function notifyFeaturedProjectApproved($featuredProject)
    {
        return self::createNotification(
            $featuredProject->user_public_id,
            'featured_project_approved',
            'Featured Project Approved',
            "Your featured project request for '{$featuredProject->project->title}' has been approved.",
            [
                'featured_project_id' => $featuredProject->public_id,
                'project_id' => $featuredProject->project_public_id,
                'project_title' => $featuredProject->project->title
            ],
            auth('admin')->id()
        );
    }

    public static function notifyFeaturedProjectRejected($featuredProject)
    {
        return self::createNotification(
            $featuredProject->user_public_id,
            'featured_project_rejected',
            'Featured Project Rejected',
            "Your featured project request for '{$featuredProject->project->title}' has been rejected.",
            [
                'featured_project_id' => $featuredProject->public_id,
                'project_id' => $featuredProject->project_public_id,
                'project_title' => $featuredProject->project->title,
                'rejection_reason' => $featuredProject->rejection_reason
            ],
            auth('admin')->id()
        );
    }

    // Get notifications for user
    public static function getUserNotifications($userPublicId, $limit = 10)
    {
        return Notification::forUser($userPublicId)
            ->with('admin')
            ->recent()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    // Get unread count for user
    public static function getUnreadCount($userPublicId)
    {
        return Notification::forUser($userPublicId)
            ->unread()
            ->count();
    }
}
