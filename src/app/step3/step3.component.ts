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
  result: Partial<Record<Languages, string>> = {};

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
    const res = inflateNodes(this.nodes, this.languages);
    console.log(res);
    this.result = {};
    Object.keys(res).forEach(
      (key: string) =>
        (this.result[key as Languages] = JSON.stringify(
          res[key as Languages],
          null,
          2
        ))
    );
    this.crunching = false;
  }
}
