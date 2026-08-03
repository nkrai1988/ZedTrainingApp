import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CertificateService } from '../../../services/certificates.service';

@Component({
  selector: 'app-certificate-verify',
  imports: [CommonModule],
  templateUrl: './certificate-verify.component.html',
  styleUrl: './certificate-verify.component.css',
})
export class CertificateVerifyComponent implements OnInit {
  constructor(private route: ActivatedRoute, private service: CertificateService) {}

  loading = true;
  cert: any = null;
  error = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.service.verifyCertificate(id).subscribe({
      next: (res: any) => {
        this.cert = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Certificate not found or invalid QR code.';
        this.loading = false;
      }
    });
  }
}
