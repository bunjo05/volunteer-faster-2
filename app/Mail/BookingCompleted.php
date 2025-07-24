<?php

namespace App\Mail;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\VolunteerBooking;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Log;

class BookingCompleted extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $hasLogo;

    public function __construct(VolunteerBooking $booking)
    {
        $this->booking = $booking;
        $this->hasLogo = file_exists(public_path('images/logo.png'));
    }

    public function build()
    {
        try {
            $certificatePath = $this->generateCertificate();

            return $this->subject('Your Volunteer Certificate')
                ->markdown('emails.booking.completed')
                ->attach($certificatePath, [
                    'as' => 'Volunteer_Certificate.pdf',
                    'mime' => 'application/pdf',
                ]);
        } catch (\Exception $e) {
            Log::error('Certificate generation failed: ' . $e->getMessage());

            // Fallback - send email without attachment
            return $this->subject('Your Volunteer Certificate')
                ->markdown('emails.booking.completed')
                ->with('error', 'Certificate could not be generated');
        }
    }

    protected function generateCertificate()
    {
        // Calculate duration
        $startDate = \Carbon\Carbon::parse($this->booking->start_date);
        $endDate = \Carbon\Carbon::parse($this->booking->end_date);
        $duration = $startDate->diffInDays($endDate) + 1; // +1 to include both start and end dates

        // Generate verification URL
        $verificationUrl = route('certificate.verify', [
            'id' => $this->booking->id,
            'hash' => sha1($this->booking->id . config('app.key'))
        ]);

        // Generate QR code
        // $qrCodeSvg = QrCode::size(120)
        //     ->style('square')
        //     ->color(44, 62, 80)
        //     ->generate($verificationUrl);

        // Generate QR code as base64 encoded SVG
        $qrCodeSvg = QrCode::format('svg')
            ->size(150) // Smaller size for PDF
            ->margin(1)
            ->errorCorrection('H')
            ->color(44, 62, 80) // Dark blue color
            ->backgroundColor(255, 255, 255)
            ->generate($verificationUrl);

        // Convert SVG to base64 for better PDF rendering
        $qrCodeBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg);

        // Save QR code temporarily
        // $qrCodePath = 'temp/qrcodes/' . uniqid() . '.png';
        // Storage::disk('public')->put($qrCodePath, $qrCodeImage);
        // $absoluteQrCodePath = Storage::disk('public')->path($qrCodePath);

        // Pass duration to view
        $pdf = Pdf::loadView('certificates.volunteer', [
            'booking' => $this->booking,
            'qrCode' => $qrCodeBase64, // Pass base64 encoded image
            'hasLogo' => $this->hasLogo,
            'duration' => $duration, // Pass the calculated duration
            'verificationUrl' => $verificationUrl // Pass URL for fallback text
        ])
            ->setPaper('a4', 'portrait')
            ->setOption('enable_php', false)
            ->setOption('isHtml5ParserEnabled', true)
            ->setOption('isRemoteEnabled', false);

        // Store PDF
        Storage::disk('public')->makeDirectory('certificates');
        $certificatePath = 'certificates/cert_' . $this->booking->id . '_' . time() . '.pdf';
        Storage::disk('public')->put($certificatePath, $pdf->output());

        return Storage::disk('public')->path($certificatePath);
    }
}
