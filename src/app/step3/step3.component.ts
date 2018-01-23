import { Component, OnInit, Input } from '@angular/core';
import { inflateNodes, TranslationNode } from '../helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html'
})
export class Step3Component implements OnInit {
  @Input() nodes: TranslationNode[];
  crunching = false;
  result: {
    en: string;
    fr: string;
    nl: string;
  };

  constructor(public snackBar: MatSnackBar, private sanitizer: DomSanitizer) {}

ngOnInit(){
  this.crunch();
}

  buildUri(content: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(new Blob([content], { type: 'application/json' })));
  }

  crunch() {
    this.crunching = true;
    const res = inflateNodes(this.nodes);
    this.result = {
      en: JSON.stringify(res.en, null, 2),
      fr: JSON.stringify(res.fr, null, 2),
      nl: JSON.stringify(res.nl, null, 2)
    };
    this.crunching = false;
  }
}
