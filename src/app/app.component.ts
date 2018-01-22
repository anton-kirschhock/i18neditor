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
  uploading = false;
  step2 = false;
  nodes: TranslationNode[];
  filteredNodes: TranslationNode[];
  filterText = '';

  newNode: TranslationNode = { key: '', en: '', fr: '', nl: '' };
  result: {
    en: string;
    fr: string;
    nl: string;
  };

  crunching = false;
  constructor(public snackBar: MatSnackBar, private sanitizer: DomSanitizer) {}
  onFilter($event: string) {
    this.filterText = $event;
    this.filteredNodes = this.nodes.filter(item => item.key.indexOf(this.filterText) !== -1);
  }
  addNode() {
    this.nodes.push(this.newNode);
    this.newNode = { key: '', en: '', fr: '', nl: '' };
    this.onFilter('');
  }

  removeNode(key: string) {
    const indexToRemove = this.nodes.findIndex(node => node.key === key);
    this.nodes = [...this.nodes.splice(indexToRemove, 1)];
  }

  onSelect($event, stepper: { next: Function }) {
    this.uploading = true;
    this.snackBar.open('Reading JSON file...', undefined, { duration: 5000 });
    const reader: FileReader = new FileReader();
    reader.onloadend = event => {
      const jsonString = reader.result as string;
      if (jsonString && jsonString.trim() !== '') {
        const json = JSON.parse(jsonString);
        this.nodes = extractNodes(json);
        this.snackBar.open('All done!', undefined, { duration: 5000 });
        this.step2 = true;
        stepper.next();
        this.onFilter('');
      }
    };
    reader.readAsText($event.target.files[0]);
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
