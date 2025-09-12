@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header bg-danger text-white">Payment Cancelled</div>
                <div class="card-body text-center">
                    <h4 class="text-danger mb-4">{{ $message }}</h4>
                    <p>Your payment was not completed. You can try again if you wish.</p>
                    <a href="/" class="btn btn-primary">Return to Home</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
