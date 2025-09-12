@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header bg-{{ $verificationDetails['valid'] ? 'success' : 'danger' }} text-white">
                    <h4 class="mb-0">Certificate Verification</h4>
                </div>

                <div class="card-body">
                    @if($verificationDetails['valid'] && $verificationDetails['booking_exists'] && $verificationDetails['is_completed'])
                        <div class="alert alert-success">
                            <h5><i class="fas fa-check-circle"></i> Valid Certificate</h5>
                            <p>This certificate has been successfully verified.</p>
                        </div>

                        <div class="details">
                            <h5>Volunteer Details</h5>
                            <p><strong>Name:</strong> {{ $booking->user->name }}</p>
                            <p><strong>Project:</strong> {{ $booking->project->title }}</p>
                            <p><strong>Dates:</strong> {{ \Carbon\Carbon::parse($booking->start_date)->format('M j, Y') }} to {{ \Carbon\Carbon::parse($booking->end_date)->format('M j, Y') }}</p>
                            <p><strong>Status:</strong> {{ $booking->booking_status }}</p>
                            <p><strong>Certificate ID:</strong> {{ $verificationDetails['certificate_id'] }}</p>
                            <p><strong>Verified On:</strong> {{ $verificationDetails['verification_date'] }}</p>
                        </div>
                    @else
                        <div class="alert alert-danger">
                            <h5><i class="fas fa-times-circle"></i> Invalid Certificate</h5>
                            <p>This certificate could not be verified.</p>

                            @if(isset($verificationDetails['error']))
                                <p class="mb-0"><strong>Reason:</strong> {{ $verificationDetails['error'] }}</p>
                            @elseif(!$verificationDetails['booking_exists'])
                                <p class="mb-0"><strong>Reason:</strong> Certificate record not found</p>
                            @elseif(!$verificationDetails['hash_matches'])
                                <p class="mb-0"><strong>Reason:</strong> Invalid verification link</p>
                            @elseif(!$verificationDetails['is_completed'])
                                <p class="mb-0"><strong>Reason:</strong> Booking status is not completed</p>
                            @endif
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
