import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslationNode, inflateNodes } from '../helpers';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatListModule, NgIf],
})
export class Step3Component implements OnInit {
  @Input() nodes!: TranslationNode[];
  crunching = false;
  result?: {
    en: string;
    fr: string;
    nl: string;
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
      en: JSON.stringify(res.en, null, 2),
      fr: JSON.stringify(res.fr, null, 2),
      nl: JSON.stringify(res.nl, null, 2),
    };
    this.crunching = false;
  }
}
