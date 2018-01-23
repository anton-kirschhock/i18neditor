import { Component } from '@angular/core';
import { TranslationNode, extractNodes, inflateNodes } from './helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  step = 1;
  nodes: TranslationNode[];

  next() {
    if (this.step === 1 && (!this.nodes || this.nodes.length === 0)) {
      return;
    }

    if (this.step < 3) {
      this.step++;
    }
  }

  prev() {
    if (this.step > 1) {
      this.step--;
    }
  }
}
