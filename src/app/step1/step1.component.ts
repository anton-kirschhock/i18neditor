import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { extractNodes, TranslationNode } from '../helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
export type Languages = 'en' | 'fr' | 'nl';
export interface UploadData {
  fileName: string;
  fileSize: number;
}

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {
  uploading = false;
  uploadStatus = {
    fr: false,
    en: false,
    nl: false
  };

  uploadData = {
    fr: null,
    nl: null,
    en: null
  };

  nodes: TranslationNode[];

  @Output() completed: EventEmitter<TranslationNode[]> = new EventEmitter<TranslationNode[]>();
  constructor(private snackBar: MatSnackBar) {}
  ngOnInit() {}

  onSelect($event, lang: Languages = 'en') {
    this.uploading = true;
    this.snackBar.open(`Reading ${lang} JSON file...`, undefined, { duration: 5000 });
    const reader: FileReader = new FileReader();
    const file = $event.target.files[0];
    console.log(file);
    reader.onloadend = event => {
      const jsonString = reader.result as string;
      if (jsonString && jsonString.trim() !== '') {
        const json = JSON.parse(jsonString);
        extractNodes(json).forEach(node => this.pushNode(node, lang));
        this.snackBar.open('Finished with ' + lang, undefined, { duration: 5000 });
        this.completed.next(this.nodes);
        this.uploading = false;
        this.uploadStatus[lang] = true;
        this.uploadData[lang] = <UploadData>{
          fileName: file.name,
          fileSize: file.size
        };
      }
    };
    reader.readAsText(file);
  }

  public pushNode(node: { key: string; value: string }, lang: Languages) {
    if (!this.nodes) {
      this.nodes = [];
    }

    let item = this.nodes.find(i => i.key === node.key);
    if (!item) {
      item = { key: node.key, en: '', fr: '', nl: '' };
      this.nodes.push(item);
    }
    item[lang] = node.value;
  }
}
