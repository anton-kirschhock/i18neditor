import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslationNode, inflateNodes } from '../helpers';
import { Languages } from '../step1/step1.component';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    NgIf,
    MatSnackBarModule,
  ],
})
export class Step3Component implements OnInit {
  @Input() nodes!: TranslationNode[];
  @Input() languages: Languages[] = [];
  crunching = false;
  result?: {
    en_gb: string;
    fr_be: string;
    nl_be: string;
  };

  constructor(public snackBar: MatSnackBar, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.crunch();
  }

  buildUri(content: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(
        new Blob([content], { type: 'application/json' })
      )
    );
  }

  crunch() {
    this.crunching = true;
    const res = inflateNodes(this.nodes);
    this.result = {
      en_gb: JSON.stringify(res.en_gb, null, 2),
      fr_be: JSON.stringify(res.fr_be, null, 2),
      nl_be: JSON.stringify(res.nl_be, null, 2),
    };
    this.crunching = false;
  }
}
