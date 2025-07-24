@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h4 class="mb-0">Certificate Verification</h4>
                </div>

                <div class="card-body">
                    @if($valid)
                        <div class="alert alert-success">
                            <h5><i class="fas fa-check-circle"></i> Valid Certificate</h5>
                            <p>This certificate has been successfully verified.</p>
                        </div>

                        <div class="details">
                            <h5>Volunteer Details</h5>
                            <p><strong>Name:</strong> {{ $booking->user->name }}</p>
                            <p><strong>Project:</strong> {{ $booking->project->title }}</p>
                            <p><strong>Dates:</strong> {{ \Carbon\Carbon::parse($booking->start_date)->format('M j, Y') }} to {{ \Carbon\Carbon::parse($booking->end_date)->format('M j, Y') }}</p>
                            <p><strong>Duration:</strong> {{ $booking->duration }} days</p>
                            <p><strong>Verified On:</strong> {{ \Carbon\Carbon::now()->format('M j, Y H:i') }}</p>
                        </div>
                    @else
                        <div class="alert alert-danger">
                            <h5><i class="fas fa-times-circle"></i> Invalid Certificate</h5>
                            <p>This certificate could not be verified.</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
