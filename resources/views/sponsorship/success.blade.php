@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header bg-success text-white">Payment Successful</div>
                <div class="card-body text-center">
                    <h4 class="text-success mb-4">{{ $message }}</h4>
                    <p>Thank you for supporting {{ $sponsorship->user->name }}'s volunteer journey!</p>
                    <a href="/" class="btn btn-primary">Return to Home</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
