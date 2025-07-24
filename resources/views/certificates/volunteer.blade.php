<!DOCTYPE html>
<html>
<head>
    <title>Volunteer Certificate</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0px;
        }

        body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-family: Arial, sans-serif;
        }

        .certificate-container {
            width: 150mm;
            height: 230mm;
            margin: 15mm auto;
            padding: 15mm;
            box-sizing: border-box;
            position: relative;
            background: linear-gradient(135deg, #ffffff, #fdfdfd);
            border: 2px solid #d4af37;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-family: "Times New Roman", serif;
            font-size: 120pt;
            color: rgba(212, 175, 55, 0.05);
            white-space: nowrap;
            pointer-events: none;
            z-index: 0;
        }

        .content {
            position: relative;
            z-index: 1;
            text-align: center;
        }

        .logo {
            height: 20mm;
            margin-bottom: 5mm;
        }

        .organization {
            font-family: Georgia, serif;
            font-size: 14pt;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            margin-bottom: 5mm;
            letter-spacing: 1px;
        }

        .title {
            font-size: 34pt;
            font-weight: bold;
            font-family: "Times New Roman", serif;
            color: #d4af37;
            margin-bottom: 2mm;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .presented {
            font-size: 10pt;
            letter-spacing: 1.5px;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 6mm;
        }

        .recipient {
            font-size: 22pt;
            font-weight: bold;
            color: #2c3e50;
            border-top: 1px solid #d4af37;
            border-bottom: 1px solid #d4af37;
            padding: 4mm 0;
            margin: 0 auto 8mm;
            width: 70%;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .message {
            font-size: 10.5pt;
            color: #34495e;
            width: 85%;
            margin: 0 auto 10mm;
            line-height: 1.6;
        }

        .project-title {
            font-size: 14pt;
            font-style: italic;
            color: #d4af37;
            margin-bottom: 10mm;
            text-transform: uppercase;
            font-weight: bold;
            text-decoration: underline;
            letter-spacing: 1px;
        }

        .details-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            width: 100%;
            margin: 0 auto 5mm;
        }

        .details {
            flex: 1;
            font-size: 10pt;
            color: #555555;
            background: #f9f9f94b;
            padding: 8mm;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            border: 1px solid #eee;
            /* margin-right:; */
        }

        .details-columns {
            display: flex;
            justify-content: space-between;
        }

        .details-column {
            flex: 1;
            padding: 0 5px;
            text-align: left;
        }

        .details-column:first-child {
            border-right: 1px solid #ddd;
            padding-right: 5px;
        }

        .details-column:last-child {
            padding-left: 5px;
        }

        .details p {
            margin: 3mm 0;
            padding: 2mm 0;
            border-bottom: 1px dashed #eee;
        }

        .details p:last-child {
            border-bottom: none;
        }

        .details strong {
            color: #2c3e50;
            font-weight: bold;
            display: inline-block;
            width: 45mm;
        }

        .qr-section {
            width: 40mm;
            text-align: center;
            background: #f9f9f9;
            padding: 5mm;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            border: 1px solid #eee;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .qr-code {
            width: 30mm;
            height: 30mm;
            margin: 0 auto;
            padding: 2mm;
            background: white;
            border: 1px solid #ddd;
        }

        .verification {
            margin-top: 2mm;
            font-size: 8pt;
            color: #666;
            text-align: center;
        }

        .signatures {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin: 18mm 0 10mm;
            flex-wrap: wrap;
        }

        .signature {
            width: 60mm;
            text-align: center;
            flex: 0 0 auto;
        }

        .signature-line {
            border-top: 1px solid #2c3e50;
            margin: 15mm auto 4mm;
            width: 80%;
        }

        .signature-label {
            font-size: 9pt;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 8pt;
            color: #999;
            margin-top: 5mm;
        }

        .issue-date {
            text-align: right;
            font-size: 9pt;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="watermark">Certificate</div>

        {{-- <p>VOL-{{ strtoupper(substr(sha1($booking->id), 0, 8)) }}</p> --}}

        <div class="content">
            @if($hasLogo)
                <img src="{{ asset('images/logo.png') }}" class="logo" alt="Logo">
            @endif

            <div class="organization">{{ config('app.name') }}</div>
            <div class="title">Certificate of Appreciation</div>
            <div class="presented">is hereby awarded to</div>
            <div class="recipient">{{ $booking->user->name }}</div>

            <div class="message">
                In recognition of your exceptional dedication and invaluable contribution as a volunteer.
                Your service has made a lasting impact, and we sincerely appreciate your commitment to our cause.
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
                            {{-- <p><strong>Issued By:</strong> {{ config('app.name') }}</p> --}}
                            {{-- <p><strong>Certificate ID:</strong> VOL-{{ strtoupper(substr(sha1($booking->id), 0, 8)) }}</p> --}}
                            <p><strong>Issue Date:</strong> {{ \Carbon\Carbon::now()->format('F j, Y') }}</p>
                        </div>
                    </div>
                </div>

                <div class="qr-section">
                    <div class="qr-code">
                        <img src="{{ $qrCode }}" alt="QR Code" style="width: 100%; height: 100%;">
                    </div>
                    {{-- <div class="verification">Scan to verify</div> --}}
                </div>
            </div>
            <div class="footer">
                <div class="issue-date">
                    {{ config('app.name') }} &copy; {{ now()->year }}<br>
                    Certificate ID: VOL-{{ strtoupper(substr(sha1($booking->id), 0, 8)) }}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
