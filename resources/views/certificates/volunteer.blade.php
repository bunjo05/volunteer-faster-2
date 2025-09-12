<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Volunteer Certificate</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500&display=swap');

        @page {
            size: A4 portrait;
            margin: 0;
        }

        body {
            margin: 0;
            padding: 0;
            background: #f9f7f1;
            font-family: 'Montserrat', sans-serif;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .certificate-container {
            width: 180mm;
            height: 250mm;

            /* width: 150mm;
            height: 230mm; */

            background: white;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            padding: 15mm;
        }

        /* .border-design {
            position: absolute;
            top: 10mm;
            left: 10mm;
            right: 10mm;
            bottom: 10mm;
            border: 2px solid #c0a86a;
            pointer-events: none;
        } */

        .border-design:before {
            content: '';
            position: absolute;
            top: 5mm;
            left: 5mm;
            right: 5mm;
            bottom: 5mm;
            border: 1px solid #d6c89f;
            pointer-events: none;
        }

        .corner {
            position: absolute;
            width: 20px;
            height: 20px;
            border-color: #c0a86a;
            border-style: solid;
            pointer-events: none;
        }

        .corner-tl {
            top: 0;
            left: 0;
            border-width: 2px 0 0 2px;
        }

        .corner-tr {
            top: 0;
            right: 0;
            border-width: 2px 2px 0 0;
        }

        .corner-bl {
            bottom: 0;
            left: 0;
            border-width: 0 0 2px 2px;
        }

        .corner-br {
            bottom: 0;
            right: 0;
            border-width: 0 2px 2px 0;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 70pt;
            font-weight: bold;
            color: rgba(192, 168, 106, 0.08);
            font-family: 'Playfair Display', serif;
            text-transform: uppercase;
            pointer-events: none;
            z-index: 0;
            white-space: nowrap;
            text-align: center;
            width: 1000px;
        }

        .content {
            position: relative;
            z-index: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .header {
            margin-top: 10mm;
            width: 100%;
        }

        .logo-container {
            margin-bottom: 5mm;
        }

        .logo {
            height: 25mm;
            max-width: 100%;
        }

        .organization {
            font-family: 'Montserrat', sans-serif;
            font-size: 14pt;
            font-weight: 500;
            color: #555;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 3mm;
        }

        .title {
            font-family: 'Playfair Display', serif;
            font-size: 32pt;
            color: #8a6d3b;
            margin: 5mm 0;
            font-weight: 700;
            position: relative;
            display: inline-block;
            padding-bottom: 5mm;
        }

        .title:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: linear-gradient(to right, #c0a86a, #8a6d3b, #c0a86a);
        }

        .presented {
            font-size: 12pt;
            color: #666;
            margin-top: 8mm;
            font-style: italic;
        }

        .recipient {
            font-family: 'Playfair Display', serif;
            font-size: 26pt;
            font-weight: 700;
            color: #333;
            margin: 5mm 0 8mm;
            padding: 0 10mm;
            text-align: center;
            border-bottom: 2px solid #d6c89f;
            display: inline-block;
            line-height: 1.2;
        }

        .message {
            font-size: 11.5pt;
            color: #444;
            line-height: 1.8;
            width: 85%;
            margin: 0 auto 8mm;
            text-align: center;
            font-weight: 400;
        }

        .project-title {
            font-family: 'Playfair Display', serif;
            font-size: 14pt;
            color: #8a6d3b;
            font-weight: 700;
            margin-bottom: 8mm;
            padding: 3mm 8mm;
            background: rgba(192, 168, 106, 0.1);
            display: inline-block;
            border-left: 3px solid #c0a86a;
            border-right: 3px solid #c0a86a;
        }

        .details-container {
            display: flex;
            justify-content: space-between;
            width: 90%;
            margin: 0 auto 8mm;
        }

        .details {
            flex: 2;
            font-size: 10pt;
            color: #555;
            background: #fcfaf6;
            padding: 4mm;
            border-radius: 3px;
            border: 1px solid #e8e1cf;
            text-align: left;
        }

        .details-columns {
            display: flex;
            justify-content: space-between;
        }

        .details-column {
            flex: 1;
            padding: 0 5px;
        }

        .details-column:first-child {
            border-right: 1px solid #e8e1cf;
            padding-right: 10px;
        }

        .details p {
            margin: 2mm 0;
            padding-bottom: 2mm;
            border-bottom: 1px dashed #e8e1cf;
        }

        .details strong {
            color: #666;
            font-weight: 500;
            display: inline-block;
            width: 45mm;
        }

        .qr-section {
            flex: 1;
            text-align: center;
            /* background: #fcfaf6; */
            width: auto;
            padding: 4mm;
            border-radius: 3px;
            /* border: 1px solid #e8e1cf; */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-left: 5mm;
        }

        .qr-code {
            width: 30mm;
            height: 30mm;
            margin-bottom: 2mm;
            padding: 2mm;
            background: white;
            border: 1px solid #ddd;
        }

        .qr-label {
            font-size: 8pt;
            color: #777;
        }

        /* .signatures {
            display: flex;
            justify-content: space-around;
            width: 85%;
            margin: 8mm auto 5mm;
        }

        .signature {
            text-align: center;
            width: 40%;
        } */

        /* .signature-line {
            width: 100%;
            height: 1px;
            background: #ccc;
            margin: 15px 0 5px;
        }

        .signature-name {
            font-family: 'Playfair Display', serif;
            font-size: 12pt;
            color: #333;
            font-weight: 700;
        }

        .signature-title {
            font-size: 9pt;
            color: #666;
            font-style: italic;
        } */

        .footer {
            margin-top: auto;
            font-size: 9pt;
            color: #999;
            padding-top: 5mm;
            border-top: 1px solid #eee;
            width: 90%;
        }

        .certificate-id {
            font-weight: 500;
            letter-spacing: 1px;
            margin-bottom: 2mm;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="border-design">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
        </div>

        <div class="watermark">Certificate</div>

        <div class="content">
            <div class="header">
                @if($hasLogo)
                    <div class="logo-container">
                        <img src="{{ asset('images/logo.png') }}" class="logo" alt="Organization Logo">
                    </div>
                @endif

                <div class="organization">{{ config('app.name') }}</div>
                <div class="title">Certificate of Appreciation</div>
            </div>

            <div class="presented">This certificate is proudly presented to</div>
            <div class="recipient">{{ $booking->user->name }}</div>

            <div class="message">
                In grateful recognition of your outstanding commitment, passion, and selfless dedication
                as a volunteer. Your invaluable contributions have made a significant impact on our mission
                and have been instrumental in furthering our cause.
            </div>

            <div class="project-title">{{ $booking->project->title }}</div>

            <div class="details-container">
                <div class="details">
                    <div class="details-columns">
                        <div class="details-column">
                            <p><strong>Project Duration:</strong> {{ $duration }} days</p>
                            <p><strong>Start Date:</strong> {{ \Carbon\Carbon::parse($booking->start_date)->format('F j, Y') }}</p>
                            <p><strong>End Date:</strong> {{ \Carbon\Carbon::parse($booking->end_date)->format('F j, Y') }}</p>
                        </div>
                        <div class="details-column">
                            <p><strong>Issue Date:</strong> {{ \Carbon\Carbon::now()->format('F j, Y') }}</p>
                            <p><strong>Certificate ID:</strong> VOL-{{ strtoupper(substr(sha1($booking->public_id), 0, 8)) }}</p>
                        </div>
                    </div>
                </div>

                <div class="qr-section">
                    <div class="qr-code">
                        <img src="{{ $qrCode }}" alt="Verification QR Code" style="width: 100%; height: 100%;">
                    </div>
                    {{-- <div class="qr-label">Scan to verify authenticity</div> --}}
                </div>
            </div>



            <div class="footer">
                <div class="certificate-id">Certificate ID: VOL-{{ strtoupper(substr(sha1($booking->public_id), 0, 8)) }}</div>
                Issued by {{ config('app.name') }} &copy; {{ now()->year }}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
