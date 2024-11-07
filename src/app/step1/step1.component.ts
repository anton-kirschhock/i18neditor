import { NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslationNode, extractNodes } from '../helpers';
export type Languages =
  | 'en_gb'
  | 'fr_be'
  | 'nl_be'
  | 'nl_nl'
  | 'en_be'
  | 'en_nl'
  | 'fr_fr'
  | 'en_fr'
  | 'fr_ch'
  | 'en_ch';
export interface UploadData {
  fileName: string;
  fileSize: number;
}

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgClass,
    MatSnackBarModule,
    MatMenuModule,
  ],
})
export class Step1Component implements OnInit {
  uploading = false;
  isDragOver = false;

  readonly allLanguages: Languages[] = [
    'en_gb',
    'nl_be',
    'fr_be',
    'nl_nl',
    'en_be',
    'en_nl',
    'fr_fr',
    'en_fr',
    'fr_ch',
    'en_ch',
  ];

  supportedLanguages: Languages[] = ['en_gb', 'nl_be', 'nl_nl'];
  languages: Languages[] = [];
  uploadStatus: Partial<Record<Languages, boolean>> = {};

  uploadData: Partial<Record<Languages, UploadData | null>> = {};

  nodes!: TranslationNode[];

  @Output() completed: EventEmitter<{
    nodes: TranslationNode[];
    languages: Languages[];
  }> = new EventEmitter<{ nodes: TranslationNode[]; languages: Languages[] }>();
  constructor(private snackBar: MatSnackBar) {}
  ngOnInit() {}

  onSelect($event: any, lang: Languages = 'en_gb') {
    this.uploading = true;
    this.snackBar.open(`Reading ${lang} JSON file...`);
    const reader: FileReader = new FileReader();
    const file = $event.target.files[0];
    console.log(file);
    reader.onloadend = (event) => {
      const jsonString = reader.result as string;
      if (jsonString && jsonString.trim() !== '') {
        const json = JSON.parse(jsonString);
        extractNodes(json).forEach((node) => this.pushNode(node, lang));
        this.snackBar.open('Finished importing ' + lang);
        this.languages.push(lang);
        this.completed.next({ nodes: this.nodes, languages: this.languages });
        this.uploading = false;
        this.uploadStatus[lang] = true;
        this.uploadData[lang] = {
          fileName: file.name,
          fileSize: file.size,
        } as UploadData;
      }
    };
    reader.readAsText(file);
  }

  public pushNode(node: { key: string; value: string }, lang: Languages) {
    if (!this.nodes) {
      this.nodes = [];
    }

    let item = this.nodes.find((i) => i.key === node.key);
    if (!item) {
      item = { key: node.key };
      this.nodes.push(item);
    }
    item[lang] = node.value;
  }

  nodeCounter(lang: string): number {
    return this.nodes?.filter((e: any) => e?.[lang] !== undefined).length;
  }

  addLanguage(lang: Languages) {
    this.supportedLanguages.push(lang);
  }

  onDrop(event: DragEvent) {
    this.isDragOver = false;

    if (event && event.dataTransfer != null) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      const lang = this.extractLanguageFromFilename(file.name);
      if (lang) {
        const reader: FileReader = new FileReader();
        this.readFile(reader, file, lang);
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  extractLanguageFromFilename(filename: string): Languages | null {
    const match = filename.match(/([a-z]{2})_([a-z]{2})\.json$/i);
    return match
      ? (`${match[1]}_${match[2]}`.toLowerCase() as Languages)
      : null;
  }

  readFile(reader: FileReader, file: File, lang: Languages) {
    console.log(file);
    reader.onloadend = (event) => {
      const jsonString = reader.result as string;
      if (jsonString && jsonString.trim() !== '') {
        const json = JSON.parse(jsonString);
        extractNodes(json).forEach((node) => this.pushNode(node, lang));
        this.snackBar.open('Finished importing ' + lang);
        this.languages.push(lang);
        this.completed.next({ nodes: this.nodes, languages: this.languages });
        this.uploading = false;
        this.uploadStatus[lang] = true;
        this.uploadData[lang] = {
          fileName: file.name,
          fileSize: file.size,
        };
      }
    };
    reader.readAsText(file);
  }
}
